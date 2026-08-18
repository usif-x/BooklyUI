import type { Metadata } from 'next'
import { Space_Grotesk, Archivo_Black } from 'next/font/google'
import { ThemeProvider } from '@/hooks/use-theme'
import { StoreProviders } from '@/providers/store-providers'
import { Navbar } from '@/components/navbar/navbar'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { Footer } from '@/components/footer/footer'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const archivoBlack = Archivo_Black({
  variable: '--font-archivo-black',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'BOOKLY — Books That Hit Different',
  description:
    'An independent neo-brutalist bookstore. Discover stories, ideas, and knowledge worth keeping.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${archivoBlack.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        <ThemeProvider defaultTheme="system" storageKey="bookly-theme">
          <StoreProviders>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <Toaster
              position="top-right"
              closeButton
              richColors
              toastOptions={{ duration: 2600 }}
            />
          </StoreProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}