import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProductsCatalog } from '@/components/products/products-catalog'

export const metadata: Metadata = {
  title: 'ALL BOOKS — BOOKLY',
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsCatalog />
    </Suspense>
  )
}