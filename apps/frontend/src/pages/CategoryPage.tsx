import { useParams, useSearchParams } from 'react-router-dom'
import { useFeatured, useCategoryProducts } from '@/hooks/use-catalog'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SortFilterBar, sortProducts } from '@/components/catalog/SortFilterBar'
import { useInfiniteItems } from '@/hooks/use-infinite-items'
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

  const label = decoded.charAt(0).toUpperCase() + decoded.slice(1)
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: label },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb crumbs={crumbs} />

      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-1 capitalize">{decoded}</h1>
        <p className="text-muted-foreground mb-6">Top rated picks</p>
        {loadingFeatured ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-lg" />
            ))}
          </div>
        ) : featured && featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No featured picks for this category yet.</p>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-xl font-semibold">More in {decoded}</h2>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visible.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {hasMore && <div ref={sentinelRef} className="h-10" />}
          </>
        )}
      </section>
    </main>
  )
}
