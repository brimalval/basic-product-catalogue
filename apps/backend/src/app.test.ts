import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import http from 'node:http'
import { createApp } from './app.js'
import type { CatalogService } from './modules/catalog/catalog.service.js'
import type { EnquiryService } from './modules/enquiry/enquiry.service.js'
import { EnquiryValidationError } from './modules/enquiry/enquiry.service.js'
import { UpstreamCatalogError } from './modules/catalog/catalog.provider.js'

const PRODUCT = {
  id: 1, title: 'Widget', price: 9.99, description: 'A widget',
  category: 'test', image: '', rating: { rate: 4, count: 10 },
}
const ENQUIRY = {
  id: 1, productId: 1, productTitle: 'Widget', name: 'Alice',
  email: 'alice@example.com', message: 'Hi', createdAt: new Date(),
}

function makeCatalogSvc(overrides: Partial<CatalogService> = {}): CatalogService {
  return {
    getProducts: vi.fn().mockResolvedValue([PRODUCT]),
    getProduct: vi.fn().mockResolvedValue(PRODUCT),
    getCategories: vi.fn().mockResolvedValue(['test']),
    getCategoryProducts: vi.fn().mockResolvedValue([PRODUCT]),
    search: vi.fn().mockResolvedValue([PRODUCT]),
    getFeatured: vi.fn().mockResolvedValue([PRODUCT]),
    ...overrides,
  } as unknown as CatalogService
}

function makeEnquirySvc(overrides: Partial<EnquiryService> = {}): EnquiryService {
  return { submit: vi.fn().mockResolvedValue(ENQUIRY), ...overrides } as unknown as EnquiryService
}

function startServer(srv: http.Server): Promise<string> {
  return new Promise((resolve) => {
    srv.listen(0, () => {
      const addr = srv.address() as { port: number }
      resolve(`http://localhost:${addr.port}`)
    })
  })
}

function stopServer(srv: http.Server): Promise<void> {
  return new Promise((resolve) => srv.close(() => resolve()))
}

let server: http.Server
let base: string

beforeAll(async () => {
  server = createApp(makeCatalogSvc(), makeEnquirySvc())
  base = await startServer(server)
})

afterAll(() => stopServer(server))

async function get(path: string) {
  const res = await fetch(`${base}${path}`)
  return { status: res.status, body: await res.json() }
}

async function post(path: string, body: unknown) {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { status: res.status, body: await res.json() }
}

describe('HTTP layer', () => {
  it('GET /health → 200 { status: ok }', async () => {
    const { status, body } = await get('/health')
    expect(status).toBe(200)
    expect(body.status).toBe('ok')
  })

  it('GET /api/products → 200 array', async () => {
    const { status, body } = await get('/api/products')
    expect(status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
  })

  it('GET /api/products?q=widget → calls search not getProducts', async () => {
    const catalogSvc = makeCatalogSvc()
    const srv = createApp(catalogSvc, makeEnquirySvc())
    const url = await startServer(srv)
    await fetch(`${url}/api/products?q=widget`)
    expect(catalogSvc.search).toHaveBeenCalledWith('widget')
    expect(catalogSvc.getProducts).not.toHaveBeenCalled()
    await stopServer(srv)
  })

  it('GET /api/products/featured → 200 (not treated as :id)', async () => {
    const { status } = await get('/api/products/featured')
    expect(status).toBe(200)
  })

  it('GET /api/products/1 → 200 product', async () => {
    const { status, body } = await get('/api/products/1')
    expect(status).toBe(200)
    expect(body.id).toBe(1)
  })

  it('GET /api/products/abc → 400 invalid id', async () => {
    const { status } = await get('/api/products/abc')
    expect(status).toBe(400)
  })

  it('GET /api/categories → 200 array', async () => {
    const { status, body } = await get('/api/categories')
    expect(status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
  })

  it('GET /api/categories/electronics/products → 200', async () => {
    const { status } = await get('/api/categories/electronics/products')
    expect(status).toBe(200)
  })

  it('POST /api/enquiries valid → 201 with id', async () => {
    const { status, body } = await post('/api/enquiries', {
      productId: 1, productTitle: 'Widget', name: 'Alice',
      email: 'alice@example.com', message: 'Hi',
    })
    expect(status).toBe(201)
    expect(body.id).toBeDefined()
  })

  it('POST /api/enquiries → 422 on EnquiryValidationError', async () => {
    const enquirySvc = makeEnquirySvc({
      submit: vi.fn().mockRejectedValue(new EnquiryValidationError([])),
    })
    const srv = createApp(makeCatalogSvc(), enquirySvc)
    const url = await startServer(srv)
    const res = await fetch(`${url}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'bad' }),
    })
    expect(res.status).toBe(422)
    await stopServer(srv)
  })

  it('GET /api/products → 502 on UpstreamCatalogError', async () => {
    const catalogSvc = makeCatalogSvc({
      getProducts: vi.fn().mockRejectedValue(new UpstreamCatalogError('down')),
    })
    const srv = createApp(catalogSvc, makeEnquirySvc())
    const url = await startServer(srv)
    const res = await fetch(`${url}/api/products`)
    expect(res.status).toBe(502)
    await stopServer(srv)
  })

  it('unknown route → 404', async () => {
    const { status } = await get('/api/unknown-route')
    expect(status).toBe(404)
  })
})
