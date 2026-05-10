import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { useCategories } from '@/hooks/use-catalog'
import { cn } from '@/lib/utils'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
]

export function Sidebar({ isOpen, onClose }: Props) {
  const { data: categories } = useCategories()
  const location = useLocation()

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 top-14 z-30 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200"
        />
        <DialogPrimitive.Content
          id="primary-sidebar"
          aria-label="Site navigation"
          className={cn(
            'fixed left-0 top-14 h-[calc(100vh-3.5rem)] z-40 w-60 bg-background shadow-xl flex flex-col',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
            'duration-200',
          )}
        >
          <DialogPrimitive.Title className="sr-only">Navigation Menu</DialogPrimitive.Title>

          {/* Header */}
          <div className="flex items-center justify-between px-4 h-12 border-b shrink-0">
            <span className="text-sm font-semibold" aria-hidden="true">Menu</span>
            <DialogPrimitive.Close
              aria-label="Close navigation menu"
              className="inline-flex items-center justify-center h-10 w-10 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          {/* Primary nav links */}
          <nav aria-label="Mobile primary navigation" className="py-1 border-b shrink-0">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  to={href}
                  onClick={onClose}
                  aria-current={isActive ? 'page' : undefined}
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
          <nav aria-label="Product categories" className="flex flex-col pb-4 overflow-y-auto">
            {categories?.map((cat) => (
              <Link
                key={cat}
                to={`/categories/${encodeURIComponent(cat)}`}
                onClick={onClose}
                className="px-4 py-2 text-sm capitalize text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {cat}
              </Link>
            ))}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
