import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/types'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  return (
    <Link to={`/products/${product.id}`}>
      <Card className="group h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="aspect-square mb-3 flex items-center justify-center bg-muted rounded-md overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="h-32 w-32 object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <Badge variant="secondary" className="mb-2 text-xs capitalize">
            {product.category}
          </Badge>
          <h3 className="text-sm font-medium leading-tight line-clamp-2">{product.title}</h3>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
