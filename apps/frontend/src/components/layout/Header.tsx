import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchSuggestions } from '@/components/catalog/SearchSuggestions'

interface Props {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const closeSuggestions = useCallback(() => setShowSuggestions(false), [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`)
      setShowSuggestions(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="flex items-center justify-center h-8 w-8 rounded hover:bg-accent transition-colors text-muted-foreground"
        >
          ☰
        </button>

        <Link to="/" className="font-semibold tracking-tight">
          Catalog
        </Link>

        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <Link to="/categories" className="hover:text-foreground transition-colors">Categories</Link>
        </nav>

        <form onSubmit={handleSearch} className="ml-auto flex gap-2">
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search products..."
              className="w-56 sm:w-72"
            />
            {showSuggestions && (
              <SearchSuggestions query={query} onClose={closeSuggestions} />
            )}
          </div>
          <Button type="submit" variant="outline" size="sm">Search</Button>
        </form>
      </div>
    </header>
  )
}
