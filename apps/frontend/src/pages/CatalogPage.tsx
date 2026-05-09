import { useSearchParams } from 'react-router-dom'
import { useProducts, useSearch, useCategories } from '@/hooks/use-catalog'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export function CatalogPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const { data: allProducts, isLoading: loadingAll } = useProducts()
  const { data: searchResults, isLoading: loadingSearch } = useSearch(q)
  const { data: categories } = useCategories()

  const products = q ? searchResults : allProducts
  const isLoading = q ? loadingSearch : loadingAll

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {q ? `Results for "${q}"` : 'All Products'}
        </h1>
        {products && (
          <span className="text-muted-foreground text-sm">{products.length} items</span>
        )}
      </div>
      {categories && !q && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <Badge key={cat} variant="outline" className="capitalize">
              {cat}
            </Badge>
          ))}
        </div>
      )}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </main>
  )
}
