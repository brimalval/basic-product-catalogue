import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEnquiry } from '@/hooks/use-enquiry'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Product } from '@/lib/types'

const enquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
})

type EnquiryForm = z.infer<typeof enquirySchema>

interface Props {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EnquiryModal({ product, open, onOpenChange }: Props) {
  const enquiry = useEnquiry()

  const form = useForm<EnquiryForm>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
  })

  function onSubmit(values: EnquiryForm) {
    enquiry.mutate({ productId: product.id, productTitle: product.title, ...values })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make an Enquiry</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
          {product.title.length > 60 ? product.title.slice(0, 60) + '…' : product.title}
        </p>

        {enquiry.isSuccess ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 text-sm">
              Enquiry sent! We'll be in touch soon.
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => { enquiry.reset(); form.reset() }}
            >
              Send another enquiry
            </Button>
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
      </DialogContent>
    </Dialog>
  )
}
