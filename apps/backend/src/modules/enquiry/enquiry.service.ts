import type { ZodIssue } from 'zod'
import { enquirySchema } from './enquiry.schemas.js'
import type { IEnquiryRepository, MailPort } from './enquiry.types.js'

export class EnquiryValidationError extends Error {
  constructor(public readonly issues: ZodIssue[]) {
    super('Enquiry validation failed')
    this.name = 'EnquiryValidationError'
  }
}

export class EnquiryService {
  constructor(
    private readonly repo: IEnquiryRepository,
    private readonly mail: MailPort,
  ) {}

  async submit(raw: unknown) {
    const result = enquirySchema.safeParse(raw)
    if (!result.success) throw new EnquiryValidationError(result.error.issues)
    const enquiry = await this.repo.create(result.data)
    await this.mail.send(enquiry)
    return enquiry
  }
}
