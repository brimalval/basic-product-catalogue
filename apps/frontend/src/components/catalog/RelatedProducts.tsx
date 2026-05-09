import { useCategoryProducts } from '@/hooks/use-catalog'
import { ProductCard } from './ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  category: string
  excludeId: number
}

export function RelatedProducts({ category, excludeId }: Props) {
  const { data, isLoading } = useCategoryProducts(category)

  const related = data?.filter((p) => p.id !== excludeId).slice(0, 4)

  if (isLoading) {
    return (
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-lg" />
          ))}
        </div>
      </section>
    )
  }

  if (!related?.length) return null

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
