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

const PORT = Number(process.env.PORT ?? 3001)

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

const server = createApp(catalogService, enquiryService)

server.listen(PORT, () => {
  process.stderr.write(`Backend listening on :${PORT}\n`)
})

async function shutdown(): Promise<void> {
  server.close()
  await disconnectClient()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
