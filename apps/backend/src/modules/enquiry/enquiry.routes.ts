import type { Router } from '../../shared/http/router.js'
import { json, readBody } from '../../shared/http/helpers.js'
import { wrap } from '../../shared/http/middleware.js'
import { rateLimit } from '../../shared/http/rate-limit.js'
import type { EnquiryService } from './enquiry.service.js'

const enquiryRateLimit = rateLimit({ windowMs: 60_000, max: 5 })

export function registerEnquiryRoutes(router: Router, service: EnquiryService): void {
  router.post('/api/enquiries', enquiryRateLimit(wrap(async (req, res) => {
    const body = await readBody(req)
    const enquiry = await service.submit(body)
    json(res, { id: enquiry.id, createdAt: enquiry.createdAt }, 201)
  })))
}
