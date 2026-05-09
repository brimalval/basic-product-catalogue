import { useSearchParams, Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/types'

export type SortKey = 'price_asc' | 'price_desc' | 'rating_desc' | 'name_asc'

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating_desc' },
  { label: 'Name A → Z', value: 'name_asc' },
]

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  return [...products].sort((a, b) => {
    switch (sort) {
      case 'price_asc': return a.price - b.price
      case 'price_desc': return b.price - a.price
      case 'rating_desc': return b.rating.rate - a.rating.rate
      case 'name_asc': return a.title.localeCompare(b.title)
    }
  })
}

interface Props {
  categories?: string[]
  activeCategory?: string
}

export function SortFilterBar({ categories, activeCategory }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const sort = (searchParams.get('sort') ?? 'rating_desc') as SortKey

  function handleSort(value: SortKey) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('sort', value)
      return next
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground shrink-0">Sort:</span>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value as SortKey)}
          className="text-sm border rounded-md px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground shrink-0">Filter:</span>
          {categories.map((cat) => (
            <Link key={cat} to={`/categories/${encodeURIComponent(cat)}`}>
              <Badge
                variant={activeCategory === cat ? 'default' : 'outline'}
                className="capitalize cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {cat}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
