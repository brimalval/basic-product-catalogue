import { Link } from 'react-router-dom'
import { useCategories, useProducts } from '@/hooks/use-catalog'
import { Skeleton } from '@/components/ui/skeleton'
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
  if (products && categories) {
    for (const cat of categories) {
      const first = products.find((p: Product) => p.category === cat)
      if (first) thumbnailByCategory[cat] = first.image
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {useSeo({ title: 'Categories', description: 'Browse all product categories.', path: '/categories' })}
      <Breadcrumb crumbs={crumbs} />
      <h1 className="text-3xl font-bold tracking-tight mb-6">Categories</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.map((cat) => (
            <Link
              key={cat}
              to={`/categories/${encodeURIComponent(cat)}`}
              className="group rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square flex items-center justify-center bg-muted p-6">
                {thumbnailByCategory[cat] ? (
                  <img
                    src={thumbnailByCategory[cat]}
                    alt={cat}
                    className="max-h-28 object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <span className="text-4xl text-muted-foreground">🗂</span>
                )}
              </div>
              <div className="p-3 text-center">
                <p className="text-sm font-medium capitalize">{cat}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
