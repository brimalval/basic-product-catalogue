import nodemailer from 'nodemailer'
import type { Enquiry, MailPort } from './enquiry.types.js'

interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
  to: string
}

function loadConfig(): SmtpConfig {
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'MAIL_TO'] as const
  const missing = required.filter((k) => !process.env[k])
  if (missing.length > 0) throw new Error(`Missing SMTP env vars: ${missing.join(', ')}`)

  return {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
    from: process.env.SMTP_FROM!,
    to: process.env.MAIL_TO!,
  }
}

// Strip CR/LF characters to prevent SMTP header injection via user-supplied fields.
function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

function productUrl(enquiry: Enquiry): string | null {
  const base = process.env.FRONTEND_URL
  return base ? `${base}/products/${enquiry.productId}` : null
}

function salesBody(enquiry: Enquiry): string {
  const url = productUrl(enquiry)
  return [
    `New enquiry received for: ${enquiry.productTitle}`,
    url ? `Product URL: ${url}` : null,
    '',
    `Name:    ${enquiry.name}`,
    `Email:   ${enquiry.email}`,
    enquiry.phone ? `Phone:   ${enquiry.phone}` : null,
    `Message: ${enquiry.message}`,
    '',
    `Product ID: ${enquiry.productId}`,
    `Submitted:  ${enquiry.createdAt.toISOString()}`,
  ]
    .filter((line): line is string => line !== null)
    .join('\n')
}

function customerBody(enquiry: Enquiry): string {
  const url = productUrl(enquiry)
  return [
    `Hi ${enquiry.name},`,
    '',
    'Thank you for your enquiry! One of our team members will reach out to you shortly.',
    '',
    'Here is a summary of what you submitted:',
    '',
    `Product: ${enquiry.productTitle}`,
    url ? `Link:    ${url}` : null,
    enquiry.phone ? `Phone:   ${enquiry.phone}` : null,
    `Message: ${enquiry.message}`,
    '',
    'We appreciate your interest and will be in touch soon.',
  ]
    .filter((line): line is string => line !== null)
    .join('\n')
}

export function createSmtpMailAdapter(): MailPort {
  const config = loadConfig()

  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  })

  return {
    async send(enquiry: Enquiry): Promise<void> {
      await Promise.all([
        transport.sendMail({
          from: config.from,
          to: config.to,
          subject: `New Enquiry — ${sanitizeHeader(enquiry.productTitle)}`,
          text: salesBody(enquiry),
        }),
        transport.sendMail({
          from: config.from,
          to: enquiry.email,
          subject: `Thanks for your enquiry — ${sanitizeHeader(enquiry.productTitle)}`,
          text: customerBody(enquiry),
        }),
      ])
    },
  }
}
