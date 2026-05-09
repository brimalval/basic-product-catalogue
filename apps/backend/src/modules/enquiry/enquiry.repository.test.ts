import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'
import { rmSync, existsSync } from 'node:fs'
import path from 'node:path'
import { PrismaEnquiryRepository } from './enquiry.repository.js'

const TEST_DB_PATH = path.resolve('./prisma', `enquiry-test-${Date.now()}.db`)
const TEST_DB_URL = `file:${TEST_DB_PATH}`

let db: PrismaClient
let repo: PrismaEnquiryRepository

beforeAll(async () => {
  execSync('pnpm exec prisma db push --force-reset', {
    stdio: 'ignore',
    env: { ...process.env, DATABASE_URL: TEST_DB_URL },
  })
  db = new PrismaClient({ datasources: { db: { url: TEST_DB_URL } } })
  await db.$connect()
  repo = new PrismaEnquiryRepository(db)
})

afterAll(async () => {
  await db.$disconnect()
  if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH)
})

describe('PrismaEnquiryRepository', () => {
  it('creates enquiry and returns id + createdAt', async () => {
    const result = await repo.create({
      productId: 1,
      productTitle: 'Test Product',
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'I am interested',
    })
    expect(result.id).toBeGreaterThan(0)
    expect(result.productId).toBe(1)
    expect(result.name).toBe('Jane Doe')
    expect(result.email).toBe('jane@example.com')
    expect(result.phone).toBeNull()
    expect(result.message).toBe('I am interested')
    expect(result.createdAt).toBeInstanceOf(Date)
  })

  it('creates enquiry with optional phone', async () => {
    const result = await repo.create({
      productId: 2,
      productTitle: 'Another Product',
      name: 'John',
      email: 'john@example.com',
      phone: '+1234567890',
      message: 'Call me',
    })
    expect(result.phone).toBe('+1234567890')
  })

  it('persists each enquiry independently', async () => {
    await repo.create({
      productId: 3,
      productTitle: 'Product C',
      name: 'Alice',
      email: 'alice@example.com',
      message: 'Interested',
    })
    const count = await db.enquiry.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })
})
