export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: { rate: number; count: number }
}

export interface EnquiryPayload {
  productId: number
  productTitle: string
  name: string
  email: string
  phone?: string
  message: string
}

export interface EnquiryResponse {
  id: number
  createdAt: string
}
