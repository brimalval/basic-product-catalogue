import http from 'node:http'
import { Router } from './shared/http/router.js'
import { setCors } from './shared/http/middleware.js'
import { registerHealthRoutes } from './modules/health/health.routes.js'
import { registerCatalogRoutes } from './modules/catalog/catalog.routes.js'
import { registerEnquiryRoutes } from './modules/enquiry/enquiry.routes.js'
import type { CatalogService } from './modules/catalog/catalog.service.js'
import type { EnquiryService } from './modules/enquiry/enquiry.service.js'

export function createApp(catalogService: CatalogService, enquiryService: EnquiryService): http.Server {
  const router = new Router()
  registerHealthRoutes(router)
  registerCatalogRoutes(router, catalogService)
  registerEnquiryRoutes(router, enquiryService)

  return http.createServer(async (req, res) => {
    setCors(res)
    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }
    await router.handle(req, res)
  })
}
