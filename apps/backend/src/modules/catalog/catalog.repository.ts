import type { PrismaClient } from '@prisma/client'
import type { FeaturedProductPreference, IFeaturedRepository } from './catalog.types.js'

export class PrismaFeaturedRepository implements IFeaturedRepository {
  constructor(private readonly db: PrismaClient) {}

  async findByScope(scope: string): Promise<FeaturedProductPreference[]> {
    return this.db.featuredProductPreference.findMany({
      where: { scope },
      orderBy: { rank: 'asc' },
    })
  }
}
