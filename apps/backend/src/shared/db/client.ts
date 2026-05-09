import { PrismaClient } from '@prisma/client'

let _client: PrismaClient | undefined

export function getClient(): PrismaClient {
  if (!_client) {
    _client = new PrismaClient()
  }
  return _client
}

export async function disconnectClient(): Promise<void> {
  if (_client) {
    await _client.$disconnect()
    _client = undefined
  }
}
