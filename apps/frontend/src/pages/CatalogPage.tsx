import { useSearchParams } from 'react-router-dom'
import { useProducts, useSearch, useCategories } from '@/hooks/use-catalog'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { SortFilterBar, sortProducts } from '@/components/catalog/SortFilterBar'
import { useInfiniteItems } from '@/hooks/use-infinite-items'
import type { SortKey } from '@/components/catalog/SortFilterBar'

export function CatalogPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const sort = (searchParams.get('sort') ?? 'rating_desc') as SortKey

  const { data: allProducts, isLoading: loadingAll } = useProducts()
  const { data: searchResults, isLoading: loadingSearch } = useSearch(q)
  const { data: categories } = useCategories()

  const raw = q ? searchResults : allProducts
  const sorted = raw ? sortProducts(raw, sort) : undefined
  const isLoading = q ? loadingSearch : loadingAll

  const { visible, hasMore, sentinelRef } = useInfiniteItems(sorted, 8)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {q ? `Results for "${q}"` : 'All Products'}
        </h1>
        {sorted && (
          <span className="text-muted-foreground text-sm">{sorted.length} items</span>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visible.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {hasMore && <div ref={sentinelRef} className="h-10" />}
        </>
      )}
    </main>
  )
}
