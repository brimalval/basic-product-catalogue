import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useProduct } from '@/hooks/use-catalog'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { StarRating } from '@/components/catalog/StarRating'
import { RelatedProducts } from '@/components/catalog/RelatedProducts'
import { EnquiryModal } from '@/components/catalog/EnquiryModal'
import { useSeo } from '@/hooks/use-seo'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading } = useProduct(Number(id))
  const [enquiryOpen, setEnquiryOpen] = useState(false)

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Skeleton className="h-5 w-32 mb-6" />
        <div className="grid gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-6" />)}
          </div>
        </div>
      </main>
    )
  }

  if (!product) return null

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: product.title.length > 40 ? product.title.slice(0, 40) + '…' : product.title },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.image,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.rate,
      reviewCount: product.rating.count,
    },
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {useSeo({ title: product.title, description: product.description, image: product.image, type: 'product', path: `/products/${product.id}` })}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Breadcrumb crumbs={crumbs} />
      <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
        <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-accent/50 to-muted rounded-xl p-8">
          <img src={product.image} alt={product.title} className="max-h-80 object-contain" />
        </div>
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Badge variant="secondary" className="capitalize">{product.category}</Badge>
          <h1 className="text-2xl font-bold leading-tight">{product.title}</h1>
          <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <StarRating rate={product.rating.rate} count={product.rating.count} size="md" />
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <Separator className="my-2" />

          <Button onClick={() => setEnquiryOpen(true)} className="w-full">
            Enquire
          </Button>
        </div>
      </div>

      <RelatedProducts category={product.category} excludeId={product.id} />

      <EnquiryModal
        product={product}
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
      />
    </main>
  )
}
