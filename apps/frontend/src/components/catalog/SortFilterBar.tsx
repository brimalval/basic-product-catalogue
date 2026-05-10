import { useSearchParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
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
}

export function SortFilterBar({ categories }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const sort = (searchParams.get('sort') ?? 'rating_desc') as SortKey
  const activeCats = searchParams.getAll('cat')

  function handleSort(value: SortKey) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('sort', value)
      return next
    })
  }

  function toggleCategory(cat: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      const current = next.getAll('cat')
      next.delete('cat')
      if (current.includes(cat)) {
        current.filter(c => c !== cat).forEach(c => next.append('cat', c))
      } else {
        [...current, cat].forEach(c => next.append('cat', c))
      }
      return next
    })
  }

  function clearCategories() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('cat')
      return next
    })
  }

  return (
    <div className="flex flex-col gap-3 mb-6">
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
        <div className="flex items-start gap-2">
          <span className="text-sm text-muted-foreground shrink-0 mt-1">Filter:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCats.includes(cat)
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full text-xs font-medium px-3 py-1.5 capitalize',
                    'transition-colors duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  {cat}
                  {isActive && <span className="ml-0.5 opacity-80 text-[10px] leading-none">×</span>}
                </button>
              )
            })}
            {activeCats.length > 0 && (
              <button
                onClick={clearCategories}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
