export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: { rate: number; count: number }
}

export interface FeaturedProductPreference {
  id: number
  scope: string
  productId: number
  rank: number
}

export interface IFeaturedRepository {
  findByScope(scope: string): Promise<FeaturedProductPreference[]>
}

export interface ProductProvider {
  getProducts(): Promise<Product[]>
  getProduct(id: number): Promise<Product>
  getCategories(): Promise<string[]>
  getCategoryProducts(category: string): Promise<Product[]>
}
