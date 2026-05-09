export interface EnquiryInput {
  productId: number
  productTitle: string
  name: string
  email: string
  phone?: string
  message: string
}

export interface Enquiry extends EnquiryInput {
  id: number
  createdAt: Date
}

export interface IEnquiryRepository {
  create(data: EnquiryInput): Promise<Enquiry>
}

export interface MailPort {
  send(enquiry: Enquiry): Promise<void>
}
