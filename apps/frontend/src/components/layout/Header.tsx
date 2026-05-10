import { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchSuggestions } from '@/components/catalog/SearchSuggestions'
import { cn } from '@/lib/utils'

interface Props {
  onToggleSidebar: () => void
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
]

export function Header({ onToggleSidebar }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
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
      <div className="flex h-14 items-center gap-3 px-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors duration-200 text-muted-foreground hover:text-foreground shrink-0"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link to="/" className="font-bold tracking-tight text-primary shrink-0">
          Acme Corp
        </Link>

        <nav className="hidden sm:flex gap-0.5 text-sm">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(href)
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  'px-3 py-1.5 rounded-md transition-colors duration-200',
                  isActive
                    ? 'text-primary font-medium bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto flex gap-2">
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search products..."
              className="w-36 sm:w-72"
            />
            {showSuggestions && (
              <SearchSuggestions query={query} onClose={closeSuggestions} />
            )}
          </div>
          <Button type="submit" variant="outline" size="sm" className="hidden sm:flex">Search</Button>
        </form>
      </div>
    </header>
  )
}
