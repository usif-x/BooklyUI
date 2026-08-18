'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import { Marquee, MarqueeItem, MarqueeSeparator } from '@/components/ui/marquee'

const PHRASES = [
  'FREE SHIPPING OVER $50',
  'BOOKS THAT HIT DIFFERENT',
  'NEW RELEASES EVERY WEEK',
  '-40% ON SELECT TITLES',
  'READ MORE. SCROLL LESS.',
]

export function MarqueeStrip({ reverse = false }: { reverse?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`border-y-3 border-foreground bg-primary py-1 ${reverse ? 'rotate-0' : ''}`}
    >
      <Marquee
        bordered={false}
        direction={reverse ? 'right' : 'left'}
        speed="normal"
        className="text-primary-foreground"
        repeat={2}
      >
        {PHRASES.map((phrase) => (
          <React.Fragment key={phrase}>
            <MarqueeItem className="py-0 text-sm font-black uppercase tracking-widest">
              {phrase}
            </MarqueeItem>
            <MarqueeSeparator>
              <Sparkles className="h-4 w-4" />
            </MarqueeSeparator>
          </React.Fragment>
        ))}
      </Marquee>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mt-16 border-t-3 border-foreground">
      <div className="bg-secondary text-secondary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center">
          <p className="text-xs font-black uppercase tracking-ultra-wide">STAY IN THE LOOP</p>
          <p className="font-display text-3xl uppercase md:text-5xl">GET BOOK NEWS FIRST</p>
          <form
            className="flex w-full max-w-md items-stretch gap-0"
            onSubmit={(e) => {
              e.preventDefault()
              e.currentTarget.reset()
            }}
          >
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="YOU@EXAMPLE.COM"
              className="h-12 flex-1 border-3 border-foreground bg-white px-4 text-sm font-bold text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            />
            <button
              type="submit"
              className="flex h-12 items-center gap-2 border-3 border-l-0 border-foreground bg-primary px-5 text-sm font-black uppercase text-primary-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))] transition hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
            >
              SUBSCRIBE <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-4xl uppercase">
            BOOK<span className="text-primary">LY</span>
          </p>
          <p className="mt-3 max-w-sm text-sm font-medium text-muted-foreground">
            An independent bookstore for readers who want their books to hit
            different. Fresh picks, deep cuts, zero filler.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-2 border-3 border-foreground bg-accent px-3 py-1 text-xs font-black uppercase shadow-[3px_3px_0px_hsl(var(--shadow-color))]">
              <BookOpen className="h-3 w-3" /> 10,000+ TITLES
            </span>
            <span className="inline-flex items-center gap-2 border-3 border-foreground bg-success px-3 py-1 text-xs font-black uppercase shadow-[3px_3px_0px_hsl(var(--shadow-color))]">
              ★ 4.8 RATING
            </span>
          </div>
        </div>

        <nav aria-label="Footer shop links">
          <h2 className="font-display text-lg uppercase">SHOP</h2>
          <ul className="mt-3 space-y-2 text-sm font-bold uppercase">
            {['ALL BOOKS', 'NEW RELEASES', 'BESTSELLERS', 'SALE', 'GIFT CARDS'].map((item) => (
              <li key={item}>
                <a href="/products" className="transition-colors hover:text-primary">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer company links">
          <h2 className="font-display text-lg uppercase">COMPANY</h2>
<ul className="mt-3 space-y-2 text-sm font-bold uppercase">
          {['ABOUT', 'STORES', 'CONTACT', 'FAQ', 'PRESS'].map((item) => (
            <li key={item}>
              <Link href="/" className="transition-colors hover:text-primary">
                {item}
              </Link>
            </li>
          ))}
        </ul>
        </nav>
      </div>

      <div className="border-t-3 border-foreground bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground sm:flex-row">
          <p>© 2026 BOOKLY — A DEMO STORE. NO REAL BOOKS WERE HARMED.</p>
          <p>MADE WITH BOLDKIT · NEO-BRUTALISM</p>
        </div>
      </div>
    </footer>
  )
}