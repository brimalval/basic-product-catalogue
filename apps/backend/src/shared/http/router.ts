import type { IncomingMessage, ServerResponse } from 'node:http'

export type Params = Record<string, string>
export type Handler = (req: IncomingMessage, res: ServerResponse, params: Params) => Promise<void> | void

interface Route {
  method: string
  pattern: RegExp
  paramNames: string[]
  handler: Handler
}

export class Router {
  private routes: Route[] = []

  add(method: string, path: string, handler: Handler): void {
    const paramNames: string[] = []
    const regexStr = path.replace(/:([^/]+)/g, (_, name: string) => {
      paramNames.push(name)
      return '([^/]+)'
    })
    this.routes.push({
      method: method.toUpperCase(),
      pattern: new RegExp(`^${regexStr}$`),
      paramNames,
      handler,
    })
  }

  get(path: string, handler: Handler): void { this.add('GET', path, handler) }
  post(path: string, handler: Handler): void { this.add('POST', path, handler) }

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = new URL(req.url ?? '/', 'http://localhost')
    const method = req.method?.toUpperCase() ?? 'GET'

    for (const route of this.routes) {
      if (route.method !== method) continue
      const match = url.pathname.match(route.pattern)
      if (!match) continue
      const params = Object.fromEntries(route.paramNames.map((n, i) => [n, match[i + 1]!]))
      await route.handler(req, res, params)
      return
    }

    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not Found' }))
  }
}
