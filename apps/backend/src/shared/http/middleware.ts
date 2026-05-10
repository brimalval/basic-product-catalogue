import type { ServerResponse } from 'node:http'
import type { Handler } from './router.js'
import { json, PayloadTooLargeError } from './helpers.js'

function hasIssues(err: Error): err is Error & { issues: unknown } {
  return 'issues' in err
}

export function setCors(res: ServerResponse, allowedOrigin: string, requestOrigin?: string): void {
  const effectiveOrigin =
    allowedOrigin === '*' || requestOrigin === allowedOrigin ? allowedOrigin : ''
  if (effectiveOrigin) res.setHeader('Access-Control-Allow-Origin', effectiveOrigin)
  if (allowedOrigin !== '*') res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export function wrap(handler: Handler): Handler {
  return async (req, res, params) => {
    try {
      await handler(req, res, params)
    } catch (err) {
      if (err instanceof PayloadTooLargeError) {
        return json(res, { error: 'Payload too large' }, 413)
      }
      if (err instanceof Error) {
        if (err.name === 'EnquiryValidationError' && hasIssues(err)) {
          return json(res, { error: 'Validation failed', issues: err.issues }, 422)
        }
        if (err.name === 'UpstreamCatalogError') {
          return json(res, { error: 'Upstream service unavailable' }, 502)
        }
      }
      json(res, { error: 'Internal server error' }, 500)
    }
  }
}
