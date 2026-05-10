import type { Router } from '../../shared/http/router.js'
import { json } from '../../shared/http/helpers.js'
import { wrap } from '../../shared/http/middleware.js'
import type { CatalogService } from './catalog.service.js'
import { categoryParamSchema, productIdParamSchema, scopeQuerySchema, searchQuerySchema } from './catalog.schemas.js'

export function registerCatalogRoutes(router: Router, service: CatalogService): void {
  router.get('/api/products', wrap(async (req, res) => {
    const url = new URL(req.url!, 'http://localhost')
    const rawQ = url.searchParams.get('q')
    if (rawQ !== null) {
      const parsed = searchQuerySchema.safeParse({ q: rawQ })
      if (!parsed.success) return json(res, { error: parsed.error.flatten() }, 400)
      return json(res, await service.search(parsed.data.q))
    }
    json(res, await service.getProducts())
  }))

  router.get('/api/products/featured', wrap(async (req, res) => {
    const url = new URL(req.url!, 'http://localhost')
    const parsed = scopeQuerySchema.safeParse({ scope: url.searchParams.get('scope') ?? undefined })
    if (!parsed.success) return json(res, { error: parsed.error.flatten() }, 400)
    json(res, await service.getFeatured(parsed.data.scope))
  }))

  // PUT /api/products/featured is intentionally disabled — no auth mechanism
  // is in place to protect this write endpoint. Manage featured products via
  // the seed script (pnpm seed) or direct database edits instead.

  router.get('/api/products/:id', wrap(async (_req, res, params) => {
    const parsed = productIdParamSchema.safeParse({ id: params.id })
    if (!parsed.success) return json(res, { error: 'Invalid id' }, 400)
    json(res, await service.getProduct(parsed.data.id))
  }))

  router.get('/api/categories', wrap(async (_req, res) => {
    json(res, await service.getCategories())
  }))

  router.get('/api/categories/:category/products', wrap(async (_req, res, params) => {
    const parsed = categoryParamSchema.safeParse({ category: decodeURIComponent(params.category) })
    if (!parsed.success) return json(res, { error: 'Invalid category' }, 400)
    json(res, await service.getCategoryProducts(parsed.data.category))
  }))
}
