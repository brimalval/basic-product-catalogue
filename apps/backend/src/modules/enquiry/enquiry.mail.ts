import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import type { Enquiry, MailPort } from './enquiry.types.js'

const MAIL_DIR = path.resolve('.dev-mail')

export const devMailAdapter: MailPort = {
  async send(enquiry: Enquiry): Promise<void> {
    mkdirSync(MAIL_DIR, { recursive: true })
    const filename = path.join(MAIL_DIR, `enquiry-${enquiry.id}-${Date.now()}.json`)
    writeFileSync(filename, JSON.stringify(enquiry, null, 2))
    process.stderr.write(`[mail] id=${enquiry.id} product=${enquiry.productId}\n`)
  },
}
