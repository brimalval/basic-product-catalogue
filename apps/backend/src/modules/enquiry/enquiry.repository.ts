import type { PrismaClient } from '@prisma/client'
import type { Enquiry, EnquiryInput, IEnquiryRepository } from './enquiry.types.js'

export class PrismaEnquiryRepository implements IEnquiryRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: EnquiryInput): Promise<Enquiry> {
    return this.db.enquiry.create({ data })
  }
}
