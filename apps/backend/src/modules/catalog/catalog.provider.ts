import type { Product, ProductProvider } from './catalog.types.js'

export class UpstreamCatalogError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'UpstreamCatalogError'
  }
}

const BASE_URL = 'https://fakestoreapi.com'
const TIMEOUT_MS = 5000

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

export const fakeStoreAdapter: ProductProvider = {
  getProducts: () => safeFetch(`${BASE_URL}/products`) as Promise<Product[]>,
  getProduct: (id) => safeFetch(`${BASE_URL}/products/${id}`) as Promise<Product>,
  getCategories: () => safeFetch(`${BASE_URL}/products/categories`) as Promise<string[]>,
  getCategoryProducts: (category) =>
    safeFetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`) as Promise<Product[]>,
}
