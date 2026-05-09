import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'
import { rmSync, existsSync } from 'node:fs'
import path from 'node:path'
import { PrismaFeaturedRepository } from './catalog.repository.js'

const TEST_DB_PATH = path.resolve('./prisma', `catalog-test-${Date.now()}.db`)
const TEST_DB_URL = `file:${TEST_DB_PATH}`

let db: PrismaClient
let repo: PrismaFeaturedRepository

beforeAll(async () => {
  execSync('pnpm exec prisma db push --force-reset', {
    stdio: 'ignore',
    env: { ...process.env, DATABASE_URL: TEST_DB_URL },
  })
  db = new PrismaClient({ datasources: { db: { url: TEST_DB_URL } } })
  await db.$connect()
  repo = new PrismaFeaturedRepository(db)

  await db.featuredProductPreference.createMany({
    data: [
      { scope: 'global', productId: 1, rank: 1 },
      { scope: 'global', productId: 2, rank: 2 },
      { scope: 'electronics', productId: 3, rank: 1 },
    ],
  })
})

afterAll(async () => {
  await db.$disconnect()
  if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH)
})

describe('PrismaFeaturedRepository', () => {
  it('returns global featured ordered by rank', async () => {
    const result = await repo.findByScope('global')
    expect(result).toHaveLength(2)
    expect(result[0].productId).toBe(1)
    expect(result[1].productId).toBe(2)
  })

  it('returns category featured', async () => {
    const result = await repo.findByScope('electronics')
    expect(result).toHaveLength(1)
    expect(result[0].productId).toBe(3)
  })

  it('returns empty for unknown scope', async () => {
    const result = await repo.findByScope('nonexistent')
    expect(result).toHaveLength(0)
  })
})
