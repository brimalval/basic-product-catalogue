import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ProductCard } from '@/components/catalog/ProductCard'
import type { Product } from '@/lib/types'

interface Props {
  products: Product[]
  title?: string
}

export function ProductCarousel({ products, title }: Props) {
  if (products.length === 0) return null

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      <Carousel
        opts={{ align: 'start', loop: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((p) => (
            <CarouselItem key={p.id} className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4">
              <ProductCard product={p} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {products.length > 4 && (
          <>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </>
        )}
      </Carousel>
    </div>
  )
}
