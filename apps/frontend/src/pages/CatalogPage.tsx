import { useSearchParams } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { useProducts, useSearch, useCategories } from '@/hooks/use-catalog'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { SortFilterBar, sortProducts } from '@/components/catalog/SortFilterBar'
import { useInfiniteItems } from '@/hooks/use-infinite-items'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { useSeo } from '@/hooks/use-seo'
import type { SortKey } from '@/components/catalog/SortFilterBar'

export function CatalogPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const sort = (searchParams.get('sort') ?? 'rating_desc') as SortKey
  const cats = searchParams.getAll('cat')

  const { data: allProducts, isLoading: loadingAll } = useProducts()
  const { data: searchResults, isLoading: loadingSearch } = useSearch(q)
  const { data: categories } = useCategories()

  const raw = q ? searchResults : allProducts
  const sorted = raw ? sortProducts(raw, sort) : undefined
  const filtered = cats.length > 0 ? sorted?.filter(p => cats.includes(p.category)) : sorted
  const isLoading = q ? loadingSearch : loadingAll

  const { visible, hasMore, sentinelRef } = useInfiniteItems(filtered, 8)

  const { ref: gridRef, inView: gridInView } = useInView({ triggerOnce: true, threshold: 0.03 })

  return (
    <main className="container mx-auto px-4 py-8">
      {useSeo({ title: 'All Products', description: 'Browse our full catalog of quality products.', path: '/products' })}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-primary mb-1">
            {q ? 'Search' : 'Full Catalog'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {q ? `Results for "${q}"` : 'All Products'}
          </h1>
        </div>
        {filtered && (
          <span className="text-muted-foreground text-sm">{filtered.length} items</span>
        )}
      </div>
      <SortFilterBar categories={!q ? categories : undefined} />
      {isLoading ? (
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
      <ScrollToTop />
    </main>
  )
}
