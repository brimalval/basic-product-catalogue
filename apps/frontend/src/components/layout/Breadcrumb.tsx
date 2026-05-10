import { Link } from 'react-router-dom'

interface Crumb {
  label: string
  href?: string
}

interface Props {
  crumbs: Crumb[]
}

export function Breadcrumb({ crumbs }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 min-w-0">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {crumb.href ? (
              <Link to={crumb.href} className="hover:text-foreground transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
