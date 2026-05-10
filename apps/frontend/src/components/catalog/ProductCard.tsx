import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarRating } from './StarRating'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  return (
    <Link to={`/products/${product.id}`} className="group block h-full">
      <Card className={cn(
        'h-full cursor-pointer overflow-hidden border-border/60',
        'transition-all duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
        'hover:-translate-y-1 hover:shadow-lg hover:border-primary/20',
      )}>
        <CardContent className="p-3">
          <div className="aspect-square mb-3 flex items-center justify-center bg-muted/60 rounded-md overflow-hidden p-4">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain transition-transform duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]"
            />
          </div>
          <Badge variant="secondary" className="mb-2 text-[10px] uppercase tracking-wide capitalize">
            {product.category}
          </Badge>
          <h3 className="text-sm font-medium leading-snug line-clamp-2">{product.title}</h3>
        </CardContent>
        <CardFooter className="px-3 pb-3 pt-0 flex items-center justify-between">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          <div className="flex flex-col items-end gap-0.5">
            <StarRating rate={product.rating.rate} />
            <span className="text-[10px] text-muted-foreground">{product.rating.count} ratings</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
