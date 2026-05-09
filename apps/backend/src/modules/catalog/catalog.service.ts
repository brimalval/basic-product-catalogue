import type { Product, ProductProvider, IFeaturedRepository } from './catalog.types.js'

export class CatalogService {
  constructor(
    private readonly provider: ProductProvider,
    private readonly featuredRepo: IFeaturedRepository,
  ) {}

  getProducts(): Promise<Product[]> {
    return this.provider.getProducts()
  }

  getProduct(id: number): Promise<Product> {
    return this.provider.getProduct(id)
  }

  getCategories(): Promise<string[]> {
    return this.provider.getCategories()
  }

  getCategoryProducts(category: string): Promise<Product[]> {
    return this.provider.getCategoryProducts(category)
  }

  async search(query: string): Promise<Product[]> {
    const q = query.toLowerCase()
    const all = await this.provider.getProducts()
    return all.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        String(p.price).includes(q),
    )
  }

  async getFeatured(scope: string): Promise<Product[]> {
    const prefs = await this.featuredRepo.findByScope(scope)
    return Promise.all(prefs.map((p) => this.provider.getProduct(p.productId)))
  }
}
