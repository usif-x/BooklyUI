import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'
import { HaikeiBlob } from '@/components/decor/haikei-blob'
import { TypographyCanvas } from '@/components/decor/typography-canvas'
import { PersonWaving } from '@/components/decor/illustrations'
import { SunShape } from '@/components/ui/shapes'

export const metadata: Metadata = {
  title: 'LOGIN — BOOKLY',
}

export default function LoginPage() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden border-b-3 border-foreground">
      <TypographyCanvas words={['READ', 'AGAIN', 'BOOKS']} paint="text-foreground/[0.04]" />
      <HaikeiBlob
        variant={1}
        size={300}
        animation="float"
        speed="slow"
        className="absolute -right-24 -top-24 text-secondary/70"
      />
      <HaikeiBlob
        variant={2}
        size={260}
        className="absolute -bottom-20 -left-24 text-accent/60"
      />
      <SunShape
        size={48}
        animation="spin"
        speed="slow"
        className="absolute left-[38%] top-10 text-warning"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="font-display uppercase leading-[0.9]">
            <span className="block text-6xl md:text-7xl">WELCOME</span>
            <span className="mt-2 inline-block bg-primary px-4 text-6xl text-primary-foreground shadow-[6px_6px_0px_hsl(var(--shadow-color))] md:text-7xl">
              BACK.
            </span>
          </h1>
          <p className="mt-6 max-w-sm text-sm font-bold uppercase tracking-wide text-muted-foreground md:text-base">
            Your shelf missed you. Log in and pick up right where you left off.
          </p>
          <ul className="mt-8 hidden space-y-3 md:block">
            {['SYNC YOUR WISHLIST', 'TRACK YOUR ORDERS', 'UNLOCK MEMBER DEALS'].map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 border-3 border-foreground bg-secondary px-3 py-1.5 text-xs font-black uppercase text-secondary-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))]"
              >
                ★ {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 hidden w-44 rotate-3 md:block">
            <PersonWaving className="w-full" />
          </div>
        </div>
        <LoginForm />
      </div>
    </section>
  )
}