'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, ShoppingCart, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { EmptyState, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle } from '@/components/ui/empty-state'
import { Separator } from '@/components/ui/separator'
import { BookCover } from '@/components/book/book-cover'
import { QuantityStepper } from '@/components/cart/quantity-stepper'
import { getBookById } from '@/data/books'
import { formatPrice } from '@/data/books'
import { useCart } from '@/providers/store-providers'

export function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem, totalPrice } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-0 p-0">
        <SheetHeader className="border-b-3 border-foreground p-4 text-left">
          <SheetTitle className="font-display text-2xl">
            YOUR CART{' '}
            <span className="text-primary">({items.reduce((s, i) => s + i.quantity, 0)})</span>
          </SheetTitle>
          <SheetDescription>Everything you want, none of the regrets.</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
            <EmptyState variant="card" size="lg">
              <EmptyStateIcon iconColor="primary" size="lg">
                <ShoppingCart className="h-8 w-8" />
              </EmptyStateIcon>
              <EmptyStateTitle className="font-display text-xl">CART IS EMPTY</EmptyStateTitle>
              <EmptyStateDescription>
                No books yet. Your next favorite read is one click away.
              </EmptyStateDescription>
            </EmptyState>
            <Button variant="default" asChild onClick={closeCart}>
              <Link href="/products">
                BROWSE BOOKS <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="bk-scroll-brutal flex-1 divide-y-3 divide-foreground overflow-y-auto">
              {items.map((item) => {
                const book = getBookById(item.bookId)
                if (!book) return null
                return (
                  <li key={item.bookId} className="flex gap-4 p-4">
                    <Link
                      href={`/product/${book.slug}`}
                      onClick={closeCart}
                      className="shrink-0 border-2 border-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    >
                      <BookCover
                        id={book.id}
                        title={book.name}
                        author={book.author}
                        category={book.category}
                        className="h-28 w-auto"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${book.slug}`}
                          onClick={closeCart}
                          className="line-clamp-2 font-display text-sm uppercase leading-tight transition-colors hover:text-primary"
                        >
                          {book.name}
                        </Link>
                        <button
                          type="button"
                          aria-label={`Remove ${book.name} from cart`}
                          onClick={() => {
                            removeItem(book.id)
                            toast.info('REMOVED FROM CART', { description: book.name })
                          }}
                          className="bk-interactive border-2 border-foreground bg-card p-1.5 text-destructive shadow-[3px_3px_0px_hsl(var(--shadow-color))] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs font-bold text-muted-foreground">
                        by {book.author}
                      </p>
                      <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                        <div>
                          <p className="text-sm font-black">
                            {formatPrice(book.price * item.quantity)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(book.price)} each
                          </p>
                        </div>
                        <QuantityStepper
                          size="sm"
                          value={item.quantity}
                          onChange={(q) => setQuantity(item.bookId, q)}
                        />
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <SheetFooter className="gap-3 border-t-3 border-foreground bg-muted/40 p-4 sm:flex-col sm:items-stretch sm:gap-3">
              <Separator className="bg-foreground" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wide">TOTAL</span>
                <span className="font-display text-2xl">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs font-bold uppercase text-muted-foreground">
                FREE SHIPPING OVER $50 · TAXES AT CHECKOUT
              </p>
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  toast('CHECKOUT COMING SOON!', {
                    description: 'This is a demo store — no real payments here.',
                  })
                }}
              >
                CHECKOUT <ArrowRight className="h-4 w-4" />
              </Button>
              <SheetClose asChild>
                <Button variant="outline" size="lg" className="w-full">
                  CONTINUE SHOPPING
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}