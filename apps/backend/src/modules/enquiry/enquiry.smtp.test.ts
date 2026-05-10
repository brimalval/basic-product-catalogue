import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Enquiry } from './enquiry.types.js'

const ENQUIRY: Enquiry = {
  id: 1,
  productId: 10,
  productTitle: 'Widget Pro',
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '+1 555 0100',
  message: 'I would like to know more.',
  createdAt: new Date('2026-01-01T00:00:00Z'),
}

const SMTP_ENV = {
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: '587',
  SMTP_SECURE: 'false',
  SMTP_USER: 'user@example.com',
  SMTP_PASS: 'secret',
  SMTP_FROM: 'noreply@example.com',
  MAIL_TO: 'sales@example.com',
  FRONTEND_URL: 'https://yourstore.com',
}

const sendMail = vi.fn().mockResolvedValue({ messageId: 'test-id' })

vi.mock('nodemailer', () => ({
  default: { createTransport: vi.fn(() => ({ sendMail })) },
}))

describe('createSmtpMailAdapter', () => {
  beforeEach(() => {
    Object.assign(process.env, SMTP_ENV)
    sendMail.mockClear()
  })

  afterEach(() => {
    for (const key of Object.keys(SMTP_ENV)) delete process.env[key]
  })

  it('sends sales email and customer confirmation on submit', async () => {
    const { createSmtpMailAdapter } = await import('./enquiry.smtp.js')
    const adapter = createSmtpMailAdapter()
    await adapter.send(ENQUIRY)

    expect(sendMail).toHaveBeenCalledTimes(2)

    const [salesCall, customerCall] = sendMail.mock.calls
    expect(salesCall[0]).toMatchObject({
      to: 'sales@example.com',
      subject: 'New Enquiry — Widget Pro',
    })
    expect(salesCall[0].text).toContain('jane@example.com')
    expect(salesCall[0].text).toContain('https://yourstore.com/products/10')

    expect(customerCall[0]).toMatchObject({
      to: 'jane@example.com',
      subject: 'Thanks for your enquiry — Widget Pro',
    })
    expect(customerCall[0].text).toContain('Jane Doe')
    expect(customerCall[0].text).toContain('Widget Pro')
    expect(customerCall[0].text).toContain('I would like to know more.')
    expect(customerCall[0].text).toContain('https://yourstore.com/products/10')
  })

  it('omits phone line when phone is not provided', async () => {
    const { createSmtpMailAdapter } = await import('./enquiry.smtp.js')
    const adapter = createSmtpMailAdapter()
    const noPhone = { ...ENQUIRY, phone: undefined }
    await adapter.send(noPhone)

    const [salesCall, customerCall] = sendMail.mock.calls
    expect(salesCall[0].text).not.toContain('Phone')
    expect(customerCall[0].text).not.toContain('Phone')
  })

  it('omits product URL when FRONTEND_URL is not set', async () => {
    delete process.env.FRONTEND_URL
    const { createSmtpMailAdapter } = await import('./enquiry.smtp.js')
    const adapter = createSmtpMailAdapter()
    await adapter.send(ENQUIRY)

    const [salesCall, customerCall] = sendMail.mock.calls
    expect(salesCall[0].text).not.toContain('http')
    expect(customerCall[0].text).not.toContain('http')
  })

  it('throws at construction when required env vars are missing', async () => {
    delete process.env.SMTP_HOST
    delete process.env.SMTP_USER

    const { createSmtpMailAdapter } = await import('./enquiry.smtp.js')
    expect(() => createSmtpMailAdapter()).toThrow('Missing SMTP env vars: SMTP_HOST, SMTP_USER')
  })
})
