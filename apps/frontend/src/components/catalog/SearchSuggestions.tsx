import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '@/hooks/use-catalog'

interface Props {
  query: string
  onClose: () => void
}

function highlight(text: string, query: string): string {
  return text.replace(
    new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
    '<mark class="bg-yellow-100 text-yellow-900 rounded-sm px-0.5">$1</mark>',
  )
}

export function SearchSuggestions({ query, onClose }: Props) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 150)
    return () => clearTimeout(id)
  }, [query])

  const { data } = useSearch(debouncedQuery.length >= 2 ? debouncedQuery : '')
  const matches = (data ?? []).slice(0, 6)

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [onClose])

  if (matches.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border bg-popover shadow-lg overflow-hidden max-h-72 overflow-y-auto"
    >
      {matches.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => { navigate(`/products/${p.id}`); onClose() }}
          className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-accent transition-colors"
        >
          <img src={p.image} alt="" className="h-9 w-9 object-contain shrink-0 rounded" />
          <div className="min-w-0">
            <p
              className="text-sm font-medium truncate"
              dangerouslySetInnerHTML={{ __html: highlight(p.title, query.trim()) }}
            />
            <p className="text-xs text-muted-foreground capitalize">{p.category}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
