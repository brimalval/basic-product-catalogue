import type { Product, ProductProvider } from './catalog.types.js'

export class UpstreamCatalogError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'UpstreamCatalogError'
  }
}

const BASE_URL = 'https://fakestoreapi.com'
const TIMEOUT_MS = 5000
const CACHE_TTL_MS = 60_000

async function safeFetch(url: string): Promise<unknown> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new UpstreamCatalogError(`Upstream ${res.status}: ${url}`)
    return res.json()
  } catch (err) {
    if (err instanceof UpstreamCatalogError) throw err
    throw new UpstreamCatalogError(`Fetch failed: ${url}`, err)
  } finally {
    clearTimeout(timer)
  }
}

function withTtlCache<T>(fn: () => Promise<T>): () => Promise<T> {
  let cachedValue: T | undefined
  let expiresAt = 0
  return async () => {
    if (cachedValue !== undefined && Date.now() < expiresAt) return cachedValue
    cachedValue = await fn()
    expiresAt = Date.now() + CACHE_TTL_MS
    return cachedValue
  }
}

const fetchAllProducts = withTtlCache(
  () => safeFetch(`${BASE_URL}/products`) as Promise<Product[]>,
)

const fetchCategories = withTtlCache(
  () => safeFetch(`${BASE_URL}/products/categories`) as Promise<string[]>,
)

export const fakeStoreAdapter: ProductProvider = {
  getProducts: fetchAllProducts,
  async getProduct(id) {
    const all = await fetchAllProducts()
    const product = all.find((p) => p.id === id)
    if (!product) throw new UpstreamCatalogError(`Product not found: ${id}`)
    return product
  },
  getCategories: fetchCategories,
  getCategoryProducts: (category) =>
    safeFetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`) as Promise<Product[]>,
}
