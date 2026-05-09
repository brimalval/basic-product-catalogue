import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EnquiryService, EnquiryValidationError } from './enquiry.service.js'
import type { IEnquiryRepository, MailPort, Enquiry } from './enquiry.types.js'

const VALID_INPUT = {
  productId: 1,
  productTitle: 'Test Product',
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: 'I am interested',
}

const SAVED_ENQUIRY: Enquiry = {
  ...VALID_INPUT,
  id: 42,
  createdAt: new Date('2026-01-01'),
}

function makeRepo(): IEnquiryRepository {
  return { create: vi.fn().mockResolvedValue(SAVED_ENQUIRY) }
}

function makeMail(): MailPort {
  return { send: vi.fn().mockResolvedValue(undefined) }
}

let repo: IEnquiryRepository
let mail: MailPort
let service: EnquiryService

beforeEach(() => {
  repo = makeRepo()
  mail = makeMail()
  service = new EnquiryService(repo, mail)
})

describe('EnquiryService', () => {
  it('submits valid enquiry and returns it', async () => {
    const result = await service.submit(VALID_INPUT)
    expect(result.id).toBe(42)
    expect(repo.create).toHaveBeenCalledWith(VALID_INPUT)
    expect(mail.send).toHaveBeenCalledWith(SAVED_ENQUIRY)
  })

  it('throws EnquiryValidationError for missing name', async () => {
    const { name: _name, ...noName } = VALID_INPUT
    await expect(service.submit(noName)).rejects.toThrow(EnquiryValidationError)
  })

  it('throws EnquiryValidationError for invalid email', async () => {
    await expect(service.submit({ ...VALID_INPUT, email: 'not-an-email' })).rejects.toThrow(
      EnquiryValidationError,
    )
  })

  it('throws EnquiryValidationError for non-positive productId', async () => {
    await expect(service.submit({ ...VALID_INPUT, productId: 0 })).rejects.toThrow(
      EnquiryValidationError,
    )
  })

  it('accepts optional phone', async () => {
    await expect(service.submit({ ...VALID_INPUT, phone: '+1234567890' })).resolves.not.toThrow()
  })

  it('propagates repo error', async () => {
    vi.mocked(repo.create).mockRejectedValue(new Error('db error'))
    await expect(service.submit(VALID_INPUT)).rejects.toThrow('db error')
  })
})
