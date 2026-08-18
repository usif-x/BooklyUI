'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookMarked,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
  Monitor,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserAvatar } from '@/components/decor/user-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/use-theme'
import { useAuth, useCart } from '@/providers/store-providers'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'HOME', icon: Home },
  { href: '/products', label: 'BOOKS', icon: BookMarked },
  { href: '/categories', label: 'CATEGORIES', icon: LayoutGrid },
]

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = React.useState(false)

  const options = [
    { value: 'light' as const, label: 'LIGHT', icon: Sun },
    { value: 'dark' as const, label: 'DARK', icon: Moon },
    { value: 'system' as const, label: 'SYSTEM', icon: Monitor },
  ]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Theme: ${resolvedTheme}. Change theme`}
          className="h-9 w-9 sm:h-10 sm:w-10"
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-center text-xs">THEME</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => setTheme(opt.value)}
            className={cn('justify-between uppercase', resolvedTheme === opt.value && 'bg-primary text-primary-foreground')}
          >
            {opt.label}
            <opt.icon className="h-4 w-4" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CartButton() {
  const { totalItems, openCart } = useCart()
  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label={`Open cart, ${totalItems} items`}
      className="relative h-9 w-9 sm:h-10 sm:w-10"
      onClick={openCart}
    >
      <ShoppingCart className="h-4 w-4" />
      {totalItems > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center border-3 border-foreground bg-primary px-1 text-xs font-black shadow-[2px_2px_0px_hsl(var(--shadow-color))]"
        >
          {totalItems}
        </span>
      )}
    </Button>
  )
}

function AuthArea() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">LOGIN</Link>
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link href="/register">SIGN UP</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account menu for ${user.name}`}
          className="bk-interactive rounded-none border-3 border-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
            <UserAvatar
              name={user.avatar || user.name}
              size="sm"
              frame={false}
              className="h-8 w-8 sm:h-9 sm:w-9"
            />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-black uppercase">{user.name}</span>
          <span className="text-xs font-normal normal-case text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/me" className="justify-between uppercase">
            MY PROFILE
            <User className="h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => logout()}
          className="justify-between uppercase text-destructive"
        >
          LOGOUT
          <LogOut className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SearchNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = React.useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/products?q=${encodeURIComponent(q)}`)
    setQuery('')
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn('hidden items-stretch lg:flex', pathname === '/products' && 'lg:hidden')}
    >
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH BOOKS..."
          aria-label="Search books"
          className="h-10 w-44 border-3 pr-9 xl:w-56"
        />
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}

function ScrollProgress() {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = document.documentElement
      const max = el.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="absolute inset-x-0 bottom-0 h-1.5"
    >
      <div className="h-full w-full bg-foreground/10" />
      <div
        className="absolute inset-y-0 left-0 bg-primary"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b-3 border-foreground bg-background shadow-[0_4px_0px_hsl(var(--shadow-color))]">
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:gap-6">
        <Link
          href="/"
          className="font-display text-xl uppercase tracking-tight transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-2xl"
        >
          BOOK<span className="text-primary">LY</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                'h-9 uppercase',
                pathname === link.href || link.href === '/products' && pathname.startsWith('/product')
                  ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                  : ''
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <SearchNav />
          <Button
            variant="outline"
            size="icon"
            aria-label="Go to search page"
            className="h-9 w-9 sm:h-10 sm:w-10 lg:hidden"
            asChild
          >
            <Link href="/products">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          <ThemeToggle />
          <CartButton />
          <AuthArea />
          <Button
            variant="outline"
            size="icon"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="h-9 w-9 sm:h-10 sm:w-10 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t-3 border-foreground bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                const input = new FormData(e.currentTarget).get('q') as string
                router.push(`/products?q=${encodeURIComponent(input)}`)
                closeMobile()
              }}
            >
              <div className="relative">
                <Input name="q" placeholder="SEARCH FOR A BOOK..." aria-label="Search books" className="h-11 border-3 pr-10" />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
            {NAV_LINKS.map((link) => (
              <Button key={link.href} variant="outline" className="h-12 w-full justify-start uppercase" asChild>
                <Link href={link.href} onClick={closeMobile}>
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-12 uppercase" asChild>
                <Link href="/login" onClick={closeMobile}>LOGIN</Link>
              </Button>
              <Button className="h-12 uppercase" asChild>
                <Link href="/register" onClick={closeMobile}>SIGN UP</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      <ScrollProgress />
    </header>
  )
}