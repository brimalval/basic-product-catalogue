import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CatalogService } from './catalog.service.js'
import type { Product, ProductProvider, IFeaturedRepository } from './catalog.types.js'

const PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Wireless Headphones',
    price: 29.99,
    description: 'Great audio quality',
    category: 'electronics',
    image: '',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'Gold Ring',
    price: 109.99,
    description: 'Beautiful jewelry',
    category: 'jewelery',
    image: '',
    rating: { rate: 4.0, count: 50 },
  },
  {
    id: 3,
    title: 'Casual T-Shirt',
    price: 15.99,
    description: 'Comfortable cotton shirt',
    category: "men's clothing",
    image: '',
    rating: { rate: 3.9, count: 200 },
  },
]

function makeProvider(overrides: Partial<ProductProvider> = {}): ProductProvider {
  return {
    getProducts: vi.fn().mockResolvedValue(PRODUCTS),
    getProduct: vi.fn().mockImplementation((id: number) => {
      const p = PRODUCTS.find((x) => x.id === id)
      if (!p) return Promise.reject(new Error('not found'))
      return Promise.resolve(p)
    }),
    getCategories: vi.fn().mockResolvedValue(['electronics', 'jewelery', "men's clothing"]),
    getCategoryProducts: vi.fn().mockImplementation((cat: string) =>
      Promise.resolve(PRODUCTS.filter((p) => p.category === cat)),
    ),
    ...overrides,
  }
}

function makeFeaturedRepo(overrides: Partial<IFeaturedRepository> = {}): IFeaturedRepository {
  return {
    findByScope: vi.fn().mockResolvedValue([]),
    ...overrides,
  }
}

let provider: ProductProvider
let featuredRepo: IFeaturedRepository
let service: CatalogService

beforeEach(() => {
  provider = makeProvider()
  featuredRepo = makeFeaturedRepo()
  service = new CatalogService(provider, featuredRepo)
})

describe('CatalogService', () => {
  describe('getProducts', () => {
    it('delegates to provider', async () => {
      const result = await service.getProducts()
      expect(result).toHaveLength(3)
      expect(provider.getProducts).toHaveBeenCalledOnce()
    })
  })

  describe('getProduct', () => {
    it('returns product by id', async () => {
      const result = await service.getProduct(1)
      expect(result.id).toBe(1)
      expect(provider.getProduct).toHaveBeenCalledWith(1)
    })

    it('propagates provider error', async () => {
      await expect(service.getProduct(999)).rejects.toThrow('not found')
    })
  })

  describe('getCategories', () => {
    it('delegates to provider', async () => {
      const result = await service.getCategories()
      expect(result).toContain('electronics')
    })
  })

  describe('getCategoryProducts', () => {
    it('returns products for category', async () => {
      const result = await service.getCategoryProducts('electronics')
      expect(result).toHaveLength(1)
      expect(result[0].category).toBe('electronics')
    })
  })

  describe('search', () => {
    it('matches title case-insensitively', async () => {
      const result = await service.search('wireless')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
    })

    it('matches description', async () => {
      const result = await service.search('jewelry')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(2)
    })

    it('matches category', async () => {
      const result = await service.search("men's")
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(3)
    })

    it('returns empty for no match', async () => {
      const result = await service.search('xyznonexistent')
      expect(result).toHaveLength(0)
    })
  })

  describe('getFeatured', () => {
    it('returns products in rank order from prefs', async () => {
      featuredRepo = makeFeaturedRepo({
        findByScope: vi.fn().mockResolvedValue([
          { id: 1, scope: 'global', productId: 2, rank: 1 },
          { id: 2, scope: 'global', productId: 1, rank: 2 },
        ]),
      })
      service = new CatalogService(provider, featuredRepo)
      const result = await service.getFeatured('global')
      expect(result[0].id).toBe(2)
      expect(result[1].id).toBe(1)
    })

    it('returns empty for unknown scope', async () => {
      const result = await service.getFeatured('nonexistent')
      expect(result).toHaveLength(0)
    })
  })
})
