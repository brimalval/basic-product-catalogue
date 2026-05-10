import { useFeatured, useProducts } from '@/hooks/use-catalog'
import { ProductCarousel } from '@/components/catalog/ProductCarousel'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useInfiniteItems } from '@/hooks/use-infinite-items'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { useSeo } from '@/hooks/use-seo'

export function HomePage() {
  const { data: featured, isLoading: loadingFeatured } = useFeatured()
  const { data: allProducts, isLoading: loadingAll } = useProducts()

  const featuredIds = new Set(featured?.map((p) => p.id) ?? [])
  const browse = allProducts?.filter((p) => !featuredIds.has(p.id))

  const { visible, hasMore, sentinelRef } = useInfiniteItems(browse, 8)

  return (
    <main className="container mx-auto px-4 py-8 space-y-10">
      {useSeo({ path: '/' })}
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Featured Products</h1>
        <p className="text-muted-foreground mb-6">Hand-picked selections</p>
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

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Browse Catalog</h2>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visible.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {hasMore && <div ref={sentinelRef} className="h-10" />}
          </>
        )}
      </section>
      <ScrollToTop />
    </main>
  )
}
