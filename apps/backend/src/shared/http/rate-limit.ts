import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Handler } from './router.js'
import { json } from './helpers.js'

interface RateLimitOptions {
  windowMs: number
  max: number
}

export function rateLimit({ windowMs, max }: RateLimitOptions) {
  const hits = new Map<string, number[]>()

  return function rateLimitMiddleware(handler: Handler): Handler {
    return async (req: IncomingMessage, res: ServerResponse, params: Record<string, string>) => {
      const ip =
        (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim() ??
        req.socket.remoteAddress ??
        'unknown'

      const now = Date.now()
      const windowStart = now - windowMs
      const timestamps = (hits.get(ip) ?? []).filter((t) => t > windowStart)
      timestamps.push(now)
      hits.set(ip, timestamps)

      if (timestamps.length > max) {
        res.setHeader('Retry-After', String(Math.ceil(windowMs / 1000)))
        return json(res, { error: 'Too many requests' }, 429)
      }

      return handler(req, res, params)
    }
  }
}
