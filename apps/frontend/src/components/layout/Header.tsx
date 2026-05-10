import { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchSuggestions } from '@/components/catalog/SearchSuggestions'
import { cn } from '@/lib/utils'

interface Props {
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
]

export function Header({ onToggleSidebar, sidebarOpen }: Props) {
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
          aria-label="Toggle navigation menu"
          aria-expanded={sidebarOpen}
          aria-controls="primary-sidebar"
          className="flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent transition-colors duration-200 text-muted-foreground hover:text-foreground shrink-0"
        >
          <Menu aria-hidden="true" className="h-4 w-4" />
        </button>

        <Link to="/" className="font-bold tracking-tight text-primary shrink-0">
          Acme Corp
        </Link>

        <nav aria-label="Primary navigation" className="hidden sm:flex gap-0.5 text-sm">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(href)
            return (
              <Link
                key={href}
                to={href}
                aria-current={isActive ? 'page' : undefined}
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

        <form onSubmit={handleSearch} role="search" aria-label="Site search" className="ml-auto flex gap-2">
          <div className="relative">
            <label htmlFor="site-search" className="sr-only">Search products</label>
            <Input
              id="site-search"
              type="search"
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
