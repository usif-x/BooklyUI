import { Hero } from '@/components/home/hero'
import { MarqueeStrip } from '@/components/footer/footer'
import { FeaturedReads } from '@/components/home/featured-reads'
import { CategoryPosters } from '@/components/home/categories'
import { SaleSection } from '@/components/home/sale-section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <FeaturedReads />
      <CategoryPosters />
      <SaleSection />
      <MarqueeStrip reverse />
    </>
  )
}