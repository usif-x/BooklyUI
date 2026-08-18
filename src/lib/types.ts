export type User = {
  id: string
  name: string
  email: string
  password: string
  address: string
  phone?: string
  avatar?: string
  createdAt: string
}

export type Book = {
  id: string
  name: string
  slug: string
  author: string
  description: string
  category: string
  coverImage: string

  price: number
  originalPrice?: number

  hasDiscount?: boolean
  discountPercentage?: number

  rating: number
  reviewCount: number

  stock: number

  isFeatured: boolean
  isBestSeller: boolean
  isNew: boolean

  publisher?: string
  publicationDate?: string
  isbn?: string
  pages?: number
  language?: string
  format?: string

  createdAt: string
}

export type Category = {
  name: string
  blurb: string
  color: string
  accent: string
}

export type CartItem = {
  bookId: string
  quantity: number
}

export type OrderStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export type Order = {
  id: string
  date: string
  items: { bookId: string; quantity: number }[]
  total: number
  status: OrderStatus
}

export type Review = {
  id: string
  bookId: string
  name: string
  rating: number
  comment: string
  date: string
  avatarColor: string
}