import { Link } from 'react-router-dom'
import { Linkedin, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="bg-background mt-16">
      <div className="h-0.5 bg-primary" />
      <div className="container mx-auto px-4 py-8 sm:py-10 grid gap-6 sm:gap-8 sm:grid-cols-3">

        {/* Brand */}
        <div className="space-y-2">
          <p className="font-bold text-lg tracking-tight">Acme Corp</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Quality products curated for everyday life.
          </p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Acme Corp. All rights reserved.</p>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Quick links</p>
          <nav className="flex flex-col gap-1">
            {[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: 'Categories', href: '/categories' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact + social */}
        <div className="space-y-3">
          <p className="text-sm font-semibold">Get in touch</p>
          <p className="text-sm text-muted-foreground">
            Have a question about a product? We'd love to hear from you.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link to="/products">Browse &amp; Enquire</Link>
          </Button>
          <div className="flex gap-3 pt-1">
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Social"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}
