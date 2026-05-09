import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProduct } from '@/hooks/use-catalog'
import { useEnquiry } from '@/hooks/use-enquiry'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

const enquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
})

type EnquiryForm = z.infer<typeof enquirySchema>

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading } = useProduct(Number(id))
  const enquiry = useEnquiry()

  const form = useForm<EnquiryForm>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
  })

  function onSubmit(values: EnquiryForm) {
    if (!product) return
    enquiry.mutate({ productId: product.id, productTitle: product.title, ...values })
  }

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

  return (
    <main className="container mx-auto px-4 py-8">
      <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground mb-6 block">
        ← Back to products
      </Link>
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="aspect-square flex items-center justify-center bg-muted rounded-xl p-8">
          <img src={product.image} alt={product.title} className="max-h-80 object-contain" />
        </div>
        <div className="space-y-4">
          <Badge variant="secondary" className="capitalize">{product.category}</Badge>
          <h1 className="text-2xl font-bold leading-tight">{product.title}</h1>
          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>★ {product.rating.rate}</span>
            <span>({product.rating.count} reviews)</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <Separator className="my-2" />

          <div>
            <h2 className="text-lg font-semibold mb-4">Make an Enquiry</h2>
            {enquiry.isSuccess ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 text-sm">
                Enquiry sent! We'll be in touch soon.
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="jane@example.com" type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="I'm interested in this product..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {enquiry.isError && (
                    <p className="text-sm text-destructive">
                      Failed to send enquiry. Please try again.
                    </p>
                  )}
                  <Button type="submit" disabled={enquiry.isPending} className="w-full">
                    {enquiry.isPending ? 'Sending...' : 'Send Enquiry'}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
