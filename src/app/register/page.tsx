import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'
import { HaikeiBlob } from '@/components/decor/haikei-blob'
import { TypographyCanvas } from '@/components/decor/typography-canvas'
import { BookStack } from '@/components/decor/illustrations'
import { HandDrawnArrow } from '@/components/decor/hand-drawn-arrow'
import { Star5Shape } from '@/components/ui/shapes'

export const metadata: Metadata = {
  title: 'JOIN — BOOKLY',
}

export default function RegisterPage() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden border-b-3 border-foreground">
      <TypographyCanvas words={['JOIN', 'STACK', 'BOOKS']} paint="text-foreground/[0.04]" />
      <HaikeiBlob
        variant={0}
        size={280}
        animation="float"
        speed="slow"
        className="absolute -left-24 -top-20 text-accent/60"
      />
      <HaikeiBlob
        variant={3}
        size={240}
        className="absolute -bottom-24 -right-20 text-success/50"
      />

      <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-4 py-14 md:grid-cols-[1fr_1.15fr] md:py-20">
        <div className="relative sticky top-24 md:block">
          <Star5Shape
            size={34}
            animation="float"
            speed="slow"
            className="absolute -top-8 -right-4 text-accent"
          />
          <h1 className="font-display uppercase leading-[0.9]">
            <span className="block text-6xl md:text-7xl">JOIN</span>
            <span className="mt-2 inline-block -rotate-1 bg-accent px-4 text-6xl text-accent-foreground shadow-[6px_6px_0px_hsl(var(--shadow-color))] md:text-7xl">
              BOOKLY.
            </span>
          </h1>
          <p className="mt-6 max-w-sm text-sm font-bold uppercase tracking-wide text-muted-foreground md:text-base">
            One account. Every book. No spam, no nonsense — just the good stuff.
          </p>
          <div aria-hidden="true" className="mt-10 hidden lg:block">
            <div className="border-3 border-foreground bg-primary p-5 shadow-[8px_8px_0px_hsl(var(--shadow-color))] -rotate-2">
              <p className="font-display text-3xl uppercase leading-none">
                +1,000
                <span className="block text-primary-foreground text-lg mt-1">READERS JOINED THIS WEEK</span>
              </p>
            </div>
          </div>
          <div className="mt-10 hidden w-40 -rotate-6 lg:block">
            <BookStack className="w-full" />
          </div>
          <HandDrawnArrow className="absolute -right-16 top-[42%] hidden w-28 rotate-[14deg] text-secondary xl:block" />
        </div>
        <RegisterForm />
      </div>
    </section>
  )
}