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

function productUrl(enquiry: Enquiry): string | null {
  const base = process.env.FRONTEND_URL
  return base ? `${base}/products/${enquiry.productId}` : null
}

function salesBody(enquiry: Enquiry): string {
  return [
    `New enquiry received for: ${enquiry.productTitle}`,
    productUrl(enquiry) ? `Product URL: ${productUrl(enquiry)}` : null,
    '',
    `Name:    ${enquiry.name}`,
    `Email:   ${enquiry.email}`,
    enquiry.phone ? `Phone:   ${enquiry.phone}` : null,
    `Message: ${enquiry.message}`,
    '',
    `Product ID: ${enquiry.productId}`,
    `Submitted:  ${enquiry.createdAt.toISOString()}`,
  ]
    .filter((line) => line !== null)
    .join('\n')
}

function customerBody(enquiry: Enquiry): string {
  return [
    `Hi ${enquiry.name},`,
    '',
    'Thank you for your enquiry! One of our team members will reach out to you shortly.',
    '',
    'Here is a summary of what you submitted:',
    '',
    `Product: ${enquiry.productTitle}`,
    productUrl(enquiry) ? `Link:    ${productUrl(enquiry)}` : null,
    enquiry.phone ? `Phone:   ${enquiry.phone}` : null,
    `Message: ${enquiry.message}`,
    '',
    'We appreciate your interest and will be in touch soon.',
  ]
    .filter((line) => line !== null)
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
          subject: `New Enquiry — ${enquiry.productTitle}`,
          text: salesBody(enquiry),
        }),
        transport.sendMail({
          from: config.from,
          to: enquiry.email,
          subject: `Thanks for your enquiry — ${enquiry.productTitle}`,
          text: customerBody(enquiry),
        }),
      ])
    },
  }
}
