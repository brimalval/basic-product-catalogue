import { useParams, useSearchParams } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { useFeatured, useCategoryProducts } from '@/hooks/use-catalog'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductCarousel } from '@/components/catalog/ProductCarousel'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SortFilterBar, sortProducts } from '@/components/catalog/SortFilterBar'
import { useInfiniteItems } from '@/hooks/use-infinite-items'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { useSeo } from '@/hooks/use-seo'
import { cn } from '@/lib/utils'
import type { SortKey } from '@/components/catalog/SortFilterBar'

export function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const [searchParams] = useSearchParams()
  const sort = (searchParams.get('sort') ?? 'rating_desc') as SortKey

  const decoded = decodeURIComponent(category ?? '')

  const { data: featured, isLoading: loadingFeatured } = useFeatured(decoded)
  const { data: allInCategory, isLoading: loadingAll } = useCategoryProducts(decoded)

  const featuredIds = new Set(featured?.map((p) => p.id) ?? [])
  const rest = allInCategory?.filter((p) => !featuredIds.has(p.id))
  const sortedRest = rest ? sortProducts(rest, sort) : undefined

  const { visible, hasMore, sentinelRef } = useInfiniteItems(sortedRest, 8)

  const { ref: featuredRef, inView: featuredInView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const { ref: gridRef, inView: gridInView } = useInView({ triggerOnce: true, threshold: 0.03 })

  const label = decoded.charAt(0).toUpperCase() + decoded.slice(1)
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: label },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      {useSeo({ title: label, description: `Browse ${label} products.`, path: `/categories/${encodeURIComponent(decoded)}` })}
      <Breadcrumb crumbs={crumbs} />

      <section
        ref={featuredRef}
        className={cn(
          'mb-10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
          featuredInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-primary mb-1">Category</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 capitalize">{decoded}</h1>
        <p className="text-muted-foreground mb-6">Top rated picks</p>
        {loadingFeatured ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-lg" />
            ))}
          </div>
        ) : featured && featured.length > 0 ? (
          <ProductCarousel products={featured} title={`Featured in ${label}`} />
        ) : (
          <p className="text-muted-foreground text-sm">No featured picks for this category yet.</p>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-lg sm:text-xl font-semibold">More in {decoded}</h2>
          {sortedRest && (
            <span className="text-sm text-muted-foreground">{sortedRest.length} items</span>
          )}
        </div>
        <SortFilterBar />
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
      <ScrollToTop />
    </main>
  )
}
