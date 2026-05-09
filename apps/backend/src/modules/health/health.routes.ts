import type { Router } from '../../shared/http/router.js'
import { json } from '../../shared/http/helpers.js'

export function registerHealthRoutes(router: Router): void {
  router.get('/health', (_, res) => json(res, { status: 'ok' }))
}
