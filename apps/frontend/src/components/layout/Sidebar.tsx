import { Link, useLocation } from 'react-router-dom'
import { useCategories } from '@/hooks/use-catalog'
import { cn } from '@/lib/utils'

interface Props {
  isOpen: boolean
  onToggle: () => void
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
]

export function Sidebar({ isOpen, onToggle }: Props) {
  const { data: categories } = useCategories()
  const location = useLocation()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 top-14 z-30 bg-black/40 backdrop-blur-sm"
          onClick={onToggle}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-14 h-[calc(100vh-3.5rem)] z-40 w-60 bg-background shadow-xl',
          'transform transition-transform duration-200 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-12 border-b shrink-0">
          <span className="text-sm font-semibold">Menu</span>
          <button
            onClick={onToggle}
            aria-label="Close sidebar"
            className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Primary nav links */}
        <nav className="py-1 border-b shrink-0">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(href)
            return (
              <Link
                key={href}
                to={href}
                onClick={onToggle}
                className={cn(
                  'flex items-center px-4 py-2.5 text-sm transition-colors duration-150',
                  isActive
                    ? 'text-primary font-medium bg-primary/10'
                    : 'text-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Categories label */}
        <div className="px-4 pt-3 pb-1 shrink-0">
          <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground">
            Categories
          </p>
        </div>

        {/* Category links */}
        <nav className="flex flex-col pb-4 overflow-y-auto">
          {categories?.map((cat) => (
            <Link
              key={cat}
              to={`/categories/${encodeURIComponent(cat)}`}
              onClick={onToggle}
              className="px-4 py-2 text-sm capitalize text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {cat}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
