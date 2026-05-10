import { Link } from 'react-router-dom'
import { useCategories, useProducts } from '@/hooks/use-catalog'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { useSeo } from '@/hooks/use-seo'
import type { Product } from '@/lib/types'

const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'Categories' },
]

export function CategoriesPage() {
  const { data: categories, isLoading: loadingCategories } = useCategories()
  const { data: products, isLoading: loadingProducts } = useProducts()

  const isLoading = loadingCategories || loadingProducts

  const thumbnailByCategory: Record<string, string> = {}
  const countByCategory: Record<string, number> = {}

  if (products && categories) {
    for (const cat of categories) {
      const catProducts = products.filter((p: Product) => p.category === cat)
      const first = catProducts[0]
      if (first) thumbnailByCategory[cat] = first.image
      countByCategory[cat] = catProducts.length
    }
  }

  return (
    <div>
      {useSeo({ title: 'Categories', description: 'Browse all product categories.', path: '/categories' })}

      {/* Compact hero band */}
      <section className="py-10 bg-gradient-to-b from-accent/40 via-accent/10 to-transparent">
        <div className="container mx-auto px-4">
          <Breadcrumb crumbs={crumbs} />
          <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-primary mb-1">Browse by</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Categories</h1>
        </div>
      </section>

      {/* Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories?.map((cat) => (
              <Link
                key={cat}
                to={`/categories/${encodeURIComponent(cat)}`}
                className="group rounded-xl border border-border/60 bg-card overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20"
              >
                <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-accent/60 to-background p-4 sm:p-6 relative">
                  {thumbnailByCategory[cat] ? (
                    <img
                      src={thumbnailByCategory[cat]}
                      alt={cat}
                      className="max-h-24 sm:max-h-28 object-contain transition-transform duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]"
                    />
                  ) : (
                    <span className="text-4xl text-muted-foreground">🗂</span>
                  )}
                  {countByCategory[cat] !== undefined && (
                    <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] font-medium">
                      {countByCategory[cat]}
                    </Badge>
                  )}
                </div>
                <div className="p-2 sm:p-3 text-center border-t border-border/60">
                  <p className="text-sm font-semibold capitalize truncate">{cat}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{countByCategory[cat] ?? 0} products</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
