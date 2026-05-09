import type { Product, EnquiryPayload, EnquiryResponse } from './types'

const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  getProducts: () => request<Product[]>('/products'),
  getProduct: (id: number) => request<Product>(`/products/${id}`),
  getCategories: () => request<string[]>('/categories'),
  getCategoryProducts: (cat: string) =>
    request<Product[]>(`/categories/${encodeURIComponent(cat)}/products`),
  searchProducts: (q: string) =>
    request<Product[]>(`/products?q=${encodeURIComponent(q)}`),
  getFeatured: (scope = 'global') =>
    request<Product[]>(`/products/featured?scope=${encodeURIComponent(scope)}`),
  submitEnquiry: (data: EnquiryPayload) =>
    request<EnquiryResponse>('/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
}
