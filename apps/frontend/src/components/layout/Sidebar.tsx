import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/use-catalog'
import { cn } from '@/lib/utils'

interface Props {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: Props) {
  const { data: categories } = useCategories()

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
        <div className="flex items-center justify-between px-4 h-12 border-b shrink-0">
          <span className="text-sm font-semibold">Categories</span>
          <button
            onClick={onToggle}
            aria-label="Close sidebar"
            className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col py-2 overflow-y-auto">
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
