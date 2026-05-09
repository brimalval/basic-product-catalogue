import { useFeatured } from '@/hooks/use-catalog'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

export function HomePage() {
  const { data: products, isLoading } = useFeatured()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-1">Featured Products</h1>
      <p className="text-muted-foreground mb-6">Hand-picked selections</p>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {products?.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </main>
  )
}
