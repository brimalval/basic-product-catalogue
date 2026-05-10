import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useFeatured, useProducts } from '@/hooks/use-catalog'
import { ProductCarousel } from '@/components/catalog/ProductCarousel'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useInfiniteItems } from '@/hooks/use-infinite-items'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { useSeo } from '@/hooks/use-seo'
import { cn } from '@/lib/utils'

export function HomePage() {
  const { data: featured, isLoading: loadingFeatured } = useFeatured()
  const { data: allProducts, isLoading: loadingAll } = useProducts()

  const featuredIds = new Set(featured?.map((p) => p.id) ?? [])
  const browse = allProducts?.filter((p) => !featuredIds.has(p.id))

  const { visible, hasMore, sentinelRef } = useInfiniteItems(browse, 8)

  const { ref: featuredRef, inView: featuredInView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const { ref: gridRef, inView: gridInView } = useInView({ triggerOnce: true, threshold: 0.03 })

  return (
    <main>
      {useSeo({ path: '/' })}

      {/* Hero */}
      <section className="relative overflow-hidden py-14 sm:py-24 bg-gradient-to-b from-accent/30 to-background">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--accent)), transparent)' }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-primary">
                Curated Collection
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
              Products you'll{' '}
              <span className="text-primary">actually love</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed max-w-lg">
              Hand-picked selections from top categories, all in one place. Quality you can feel.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full group gap-2">
                <Link to="/products">
                  Browse Products
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/20 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/categories">View Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 sm:py-12 space-y-10 sm:space-y-12">
        {/* Featured Products */}
        <section
          ref={featuredRef}
          className={cn(
            'transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
            featuredInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-primary mb-1">Hand-Picked</p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground text-sm mt-1">Selections worth exploring</p>
          </div>
          {loadingFeatured ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-lg" />
              ))}
            </div>
          ) : (
            <ProductCarousel products={featured ?? []} />
          )}
        </section>

        <Separator />

        {/* Browse Catalog */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-primary mb-1">Everything</p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Browse Catalog</h2>
              <p className="text-muted-foreground text-sm mt-1">Explore everything we carry</p>
            </div>
            {browse && (
              <span className="text-sm text-muted-foreground">{browse.length} products</span>
            )}
          </div>
          {loadingAll ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {visible.map((p, i) => (
                  <div
                    key={p.id}
                    className="transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    style={{
                      opacity: gridInView ? 1 : 0,
                      transform: gridInView ? 'translateY(0)' : 'translateY(16px)',
                      transitionDelay: gridInView ? `${Math.min(i, 12) * 50}ms` : '0ms',
                    }}
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
              {hasMore && <div ref={sentinelRef} className="h-10" />}
            </>
          )}
        </section>
      </div>

      <ScrollToTop />
    </main>
  )
}
