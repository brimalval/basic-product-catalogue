import type { IncomingMessage, ServerResponse } from 'node:http'

const MAX_BODY_BYTES = 1 * 1024 * 1024 // 1 MB

export class PayloadTooLargeError extends Error {
  constructor() {
    super('Payload too large')
    this.name = 'PayloadTooLargeError'
  }
}

export function json(res: ServerResponse, data: unknown, status = 200): void {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

export function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let totalBytes = 0
    req.on('data', (chunk: Buffer) => {
      totalBytes += chunk.byteLength
      if (totalBytes > MAX_BODY_BYTES) {
        req.destroy()
        reject(new PayloadTooLargeError())
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString()
        resolve(text ? JSON.parse(text) : null)
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}
