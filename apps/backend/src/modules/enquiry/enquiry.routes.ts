import type { Router } from '../../shared/http/router.js'
import { json, readBody } from '../../shared/http/helpers.js'
import { wrap } from '../../shared/http/middleware.js'
import type { EnquiryService } from './enquiry.service.js'

export function registerEnquiryRoutes(router: Router, service: EnquiryService): void {
  router.post('/api/enquiries', wrap(async (req, res) => {
    const body = await readBody(req)
    const enquiry = await service.submit(body)
    json(res, { id: enquiry.id, createdAt: enquiry.createdAt }, 201)
  }))
}
