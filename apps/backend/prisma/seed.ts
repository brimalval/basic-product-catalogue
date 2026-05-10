import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const GLOBAL_FEATURED = [
  { productId: 1, rank: 1 },
  { productId: 2, rank: 2 },
  { productId: 3, rank: 3 },
  { productId: 4, rank: 4 },
  { productId: 5, rank: 5 },
]

const CATEGORY_FEATURED: Record<string, Array<{ productId: number; rank: number }>> = {
  electronics: [
    { productId: 9, rank: 1 },
    { productId: 10, rank: 2 },
    { productId: 11, rank: 3 },
  ],
  jewelery: [
    { productId: 5, rank: 1 },
    { productId: 6, rank: 2 },
  ],
  "men's clothing": [
    { productId: 3, rank: 1 },
    { productId: 4, rank: 2 },
  ],
  "women's clothing": [
    { productId: 17, rank: 1 },
    { productId: 18, rank: 2 },
  ],
}

async function seed() {
  console.log('Seeding featured preferences...')

  for (const { productId, rank } of GLOBAL_FEATURED) {
    await db.featuredProductPreference.upsert({
      where: { scope_productId: { scope: 'global', productId } },
      create: { scope: 'global', productId, rank },
      update: { rank },
    })
  }

  for (const [category, items] of Object.entries(CATEGORY_FEATURED)) {
    for (const { productId, rank } of items) {
      await db.featuredProductPreference.upsert({
        where: { scope_productId: { scope: category, productId } },
        create: { scope: category, productId, rank },
        update: { rank },
      })
    }
  }

  const count = await db.featuredProductPreference.count()
  console.log(`Done. ${count} featured preferences seeded.`)
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
