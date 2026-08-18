'use client'

import * as React from 'react'
import type { CartItem, User } from '@/lib/types'
import { getBookById } from '@/data/books'

/* ── LocalStorage store (useSyncExternalStore-safe) ───────────────────── */

function createLocalStore<T>(key: string, initial: T) {
  let value = initial
  const serverSnapshot = initial
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw) value = JSON.parse(raw) as T
    } catch {
      /* ignore corrupt storage */
    }
  }
  const listeners = new Set<() => void>()
  return {
    getSnapshot: () => value,
    getServerSnapshot: () => serverSnapshot,
    subscribe: (callback: () => void) => {
      listeners.add(callback)
      return () => {
        listeners.delete(callback)
      }
    },
    set: (next: T) => {
      value = next
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch {
        /* storage unavailable */
      }
      listeners.forEach((l) => l())
    },
  }
}

function useLocalStore<T>(store: ReturnType<typeof createLocalStore<T>>) {
  return React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
}

/* ── Auth ─────────────────────────────────────────────────────────────── */

type AuthContextValue = {
  user: User | null
  login: (email: string, password: string) => { ok: boolean; error?: string }
  register: (data: Omit<User, 'id' | 'createdAt'>) => { ok: boolean; error?: string }
  loginWithGoogle: () => void
  logout: () => void
  updateUser: (patch: Partial<Pick<User, 'name' | 'email' | 'password' | 'address' | 'phone'>>) => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

const usersStore = createLocalStore<User[]>('bookly-users', [])
const sessionStore = createLocalStore<User | null>('bookly-session', null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useLocalStore(sessionStore)

  const persistSession = React.useCallback((next: User | null) => {
    sessionStore.set(next)
  }, [])

  const login = React.useCallback((email: string, password: string) => {
    const stored = usersStore.getSnapshot().concat(user ? [user] : [])
    const found = stored.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    )
    if (!found) return { ok: false, error: 'No account with that email. Create one!' }
    if (found.password !== password) return { ok: false, error: 'Wrong password. Try again.' }
    persistSession(found)
    return { ok: true }
  }, [user, persistSession])

  const register = React.useCallback(
    (data: Omit<User, 'id' | 'createdAt'>) => {
      const stored = usersStore.getSnapshot()
      const exists = stored.some(
        (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
      )
      if (exists) return { ok: false, error: 'That email is already registered. Log in instead!' }
      const next: User = {
        ...data,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      usersStore.set([...stored, next])
      persistSession(next)
      return { ok: true }
    },
    [persistSession]
  )

  const loginWithGoogle = React.useCallback(() => {
    const existing = usersStore.getSnapshot()
    let demo = existing.find((u) => u.email === 'yousseif@bookly.demo')
    if (!demo) {
      demo = {
        id: 'user-yousseif',
        name: 'Yousseif',
        email: 'yousseif@bookly.demo',
        password: 'demo-pass',
        address: '1 Brutalist Avenue, Cairo',
        phone: '+20 100 000 0000',
        avatar: '',
        createdAt: new Date().toISOString(),
      }
      usersStore.set([...existing, demo])
    }
    persistSession(demo)
  }, [persistSession])

  const logout = React.useCallback(() => persistSession(null), [persistSession])

  const updateUser = React.useCallback(
    (patch: Partial<Pick<User, 'name' | 'email' | 'password' | 'address' | 'phone'>>) => {
      if (!user) return
      const next = { ...user, ...patch } as User
      usersStore.set(usersStore.getSnapshot().map((u) => (u.id === next.id ? next : u)))
      persistSession(next)
    },
    [user, persistSession]
  )

  const value = React.useMemo(
    () => ({ user, login, register, loginWithGoogle, logout, updateUser }),
    [user, login, register, loginWithGoogle, logout, updateUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/* ── Cart ─────────────────────────────────────────────────────────────── */

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (bookId: string, quantity?: number) => void
  removeItem: (bookId: string) => void
  setQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = React.createContext<CartContextValue | null>(null)

const cartStore = createLocalStore<CartItem[]>('bookly-cart', [])
const cartOpenStore = createLocalStore<boolean>('bookly-cart-open', false)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useLocalStore(cartStore)
  const isOpen = useLocalStore(cartOpenStore)

  const openCart = () => cartOpenStore.set(true)
  const closeCart = () => cartOpenStore.set(false)

  const addItem = React.useCallback((bookId: string, quantity = 1) => {
    const prev = cartStore.getSnapshot()
    const existing = prev.find((i) => i.bookId === bookId)
    cartStore.set(
      existing
        ? prev.map((i) => (i.bookId === bookId ? { ...i, quantity: i.quantity + quantity } : i))
        : [...prev, { bookId, quantity }]
    )
  }, [])

  const removeItem = React.useCallback((bookId: string) => {
    cartStore.set(cartStore.getSnapshot().filter((i) => i.bookId !== bookId))
  }, [])

  const setQuantity = React.useCallback((bookId: string, quantity: number) => {
    cartStore.set(
      quantity <= 0
        ? cartStore.getSnapshot().filter((i) => i.bookId !== bookId)
        : cartStore
            .getSnapshot()
            .map((i) => (i.bookId === bookId ? { ...i, quantity } : i))
    )
  }, [])

  const clearCart = React.useCallback(() => cartStore.set([]), [])

  const totalItems = React.useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const totalPrice = React.useMemo(
    () =>
      items.reduce((sum, i) => {
        const book = getBookById(i.bookId)
        return sum + (book ? book.price * i.quantity : 0)
      }, 0),
    [items]
  )

  const value = React.useMemo(
    () => ({
      items,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, isOpen, addItem, removeItem, setQuantity, clearCart, totalItems, totalPrice]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

/* ── Wishlist ─────────────────────────────────────────────────────────── */

type WishlistContextValue = {
  ids: string[]
  isWishlisted: (bookId: string) => boolean
  toggle: (bookId: string) => void
  clear: () => void
  count: number
}

const WishlistContext = React.createContext<WishlistContextValue | null>(null)

const wishlistStore = createLocalStore<string[]>('bookly-wishlist', [])

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const ids = useLocalStore(wishlistStore)

  const toggle = React.useCallback((bookId: string) => {
    const prev = wishlistStore.getSnapshot()
    wishlistStore.set(
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    )
  }, [])

  const value = React.useMemo(
    () => ({
      ids,
      isWishlisted: (bookId: string) => ids.includes(bookId),
      toggle,
      clear: () => wishlistStore.set([]),
      count: ids.length,
    }),
    [ids, toggle]
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = React.useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

/* ── Aggregate ────────────────────────────────────────────────────────── */

export function StoreProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}