import { getClient, disconnectClient } from './shared/db/client.js'
import { fakeStoreAdapter } from './modules/catalog/catalog.provider.js'
import { PrismaFeaturedRepository } from './modules/catalog/catalog.repository.js'
import { CatalogService } from './modules/catalog/catalog.service.js'
import { PrismaEnquiryRepository } from './modules/enquiry/enquiry.repository.js'
import { devMailAdapter } from './modules/enquiry/enquiry.mail.js'
import { createSmtpMailAdapter } from './modules/enquiry/enquiry.smtp.js'
import { EnquiryService } from './modules/enquiry/enquiry.service.js'
import { createApp } from './app.js'
import type { MailPort } from './modules/enquiry/enquiry.types.js'

const PORT = parseInt(process.env.PORT ?? '3001', 10)
if (!Number.isFinite(PORT)) throw new Error(`Invalid PORT: ${process.env.PORT}`)
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*'

function resolveMailAdapter(): MailPort {
  if (process.env.SMTP_HOST) {
    return createSmtpMailAdapter()
  }
  process.stderr.write('[mail] SMTP not configured — using dev file adapter\n')
  return devMailAdapter
}

const db = getClient()
const catalogService = new CatalogService(fakeStoreAdapter, new PrismaFeaturedRepository(db))
const enquiryService = new EnquiryService(new PrismaEnquiryRepository(db), resolveMailAdapter())

const server = createApp(catalogService, enquiryService, CORS_ORIGIN)

server.setTimeout(30_000)
server.listen(PORT, () => {
  process.stderr.write(`Backend listening on :${PORT}\n`)
})

async function shutdown(): Promise<void> {
  const hardExit = setTimeout(() => process.exit(1), 10_000)
  await new Promise<void>((resolve) => server.close(() => resolve()))
  clearTimeout(hardExit)
  await disconnectClient()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
