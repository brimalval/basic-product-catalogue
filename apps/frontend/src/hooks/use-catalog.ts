import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: api.getProducts })
}

export function useProduct(id: number) {
  return useQuery({ queryKey: ['products', id], queryFn: () => api.getProduct(id) })
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: api.getCategories })
}

export function useCategoryProducts(category: string) {
  return useQuery({
    queryKey: ['categories', category, 'products'],
    queryFn: () => api.getCategoryProducts(category),
    enabled: !!category,
  })
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => api.searchProducts(query),
    enabled: query.length > 0,
  })
}

export function useFeatured(scope = 'global') {
  return useQuery({
    queryKey: ['products', 'featured', scope],
    queryFn: () => api.getFeatured(scope),
  })
}
