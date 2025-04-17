import type { Prisma } from '@prisma/client'

export type ClientWithProjects = Prisma.ClientGetPayload<{
  include: { projects: true }
}>