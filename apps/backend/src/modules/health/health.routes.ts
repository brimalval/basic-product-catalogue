import type { Router } from '../../shared/http/router.js'
import { json } from '../../shared/http/helpers.js'
import { wrap } from '../../shared/http/middleware.js'

export function registerHealthRoutes(router: Router): void {
  router.get('/health', wrap((_req, res) => { json(res, { status: 'ok' }) }))
}
