import Link from 'next/link'
import { ArrowRight, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sticker } from '@/components/ui/sticker'
import { BookStack } from '@/components/decor/illustrations'
import { HandDrawnArrow } from '@/components/decor/hand-drawn-arrow'
import { ExplosionShape, LightningShape, Star5Shape } from '@/components/ui/shapes'

export function SaleSection() {
  return (
    <section aria-label="Big book sale" className="relative flex min-h-screen w-full flex-col justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-7xl">
      <div className="bk-noise relative overflow-hidden border-3 border-foreground bg-primary shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
        <div aria-hidden="true" className="bk-diagonal-lines absolute inset-0 opacity-40" />
        <ExplosionShape
          size={110}
          animation="spin"
          speed="slow"
          className="absolute -right-6 -top-8 rotate-12 text-primary-foreground opacity-90"
        />
        <LightningShape
          size={44}
          animation="float"
          speed="slow"
          className="absolute bottom-10 left-[6%] rotate-[-14deg] text-primary-foreground opacity-80"
        />
        <Star5Shape
          size={30}
          animation="pulse"
          speed="slow"
          className="absolute right-[38%] top-6 text-primary-foreground"
        />
        <div className="absolute -left-6 -top-6 hidden w-32 -rotate-6 lg:block">
          <BookStack className="w-full" />
        </div>

        <div className="relative grid items-center gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
          <div>
            <Sticker variant="destructive" size="sm" rotation="heavy" shadow="double" tape>
              <span className="flex items-center gap-1">
                <Flame className="h-4 w-4" /> HOT DEALS · LIMITED STOCK
              </span>
            </Sticker>
            <h2 className="mt-6 font-display uppercase leading-[0.88]">
              <span className="block text-6xl text-primary-foreground md:text-8xl xl:text-9xl">BIG</span>
              <span className="block text-6xl text-primary-foreground md:text-8xl xl:text-9xl">BOOK</span>
              <span className="block -ml-2 text-6xl text-stroke md:text-8xl xl:text-9xl">SALE</span>
            </h2>
          </div>

          <div className="relative flex flex-col items-start gap-6 md:items-end">
            <p className="font-display text-3xl uppercase leading-tight text-primary-foreground md:text-right md:text-5xl">
              UP TO
              <span className="ml-3 inline-block -rotate-2 border-4 border-foreground bg-destructive px-4 py-1 text-white shadow-[6px_6px_0px_hsl(var(--shadow-color))]">
                40% OFF
              </span>
            </p>
            <p className="text-sm font-black uppercase tracking-widest text-primary-foreground/80">
              BESTSELLERS · NEW RELEASES · DEEP CUTS
            </p>
            <Button size="lg" className="h-14 bg-black px-10 text-base text-white hover:bg-black" asChild>
              <Link href="/products?discount=1">
                SHOP THE SALE <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <HandDrawnArrow className="absolute -left-10 bottom-8 hidden w-24 rotate-[-10deg] text-primary-foreground lg:block" />
          </div>
        </div>

        <div aria-hidden="true" className="absolute -left-8 bottom-6 hidden rotate-[-12deg] border-3 border-foreground bg-accent px-4 py-2 font-display text-2xl uppercase shadow-[5px_5px_0px_hsl(var(--shadow-color))] md:block">
          READ MORE ✦
        </div>
      </div>
      </div>
    </section>
  )
}