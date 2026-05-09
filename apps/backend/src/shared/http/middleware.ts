import type { ServerResponse } from 'node:http'
import type { Handler } from './router.js'
import { json } from './helpers.js'

export function setCors(res: ServerResponse, origin = '*'): void {
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export function wrap(handler: Handler): Handler {
  return async (req, res, params) => {
    try {
      await handler(req, res, params)
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'EnquiryValidationError') {
          return json(res, { error: 'Validation failed', issues: (err as any).issues }, 422)
        }
        if (err.name === 'UpstreamCatalogError') {
          return json(res, { error: 'Upstream service unavailable' }, 502)
        }
      }
      json(res, { error: 'Internal server error' }, 500)
    }
  }
}
