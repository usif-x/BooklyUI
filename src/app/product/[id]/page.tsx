import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/product/product-detail'
import { getBookBySlug } from '@/data/books'

export const metadata: Metadata = {
  title: 'BOOK — BOOKLY',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const book = getBookBySlug(id)
  if (!book) notFound()
  return <ProductDetail book={book} />
}