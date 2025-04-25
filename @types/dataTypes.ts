import type { Prisma } from '@prisma/client'

export type ClientWithProjects = Prisma.ClientGetPayload<{
  include: { projects: true }
}>

import type { Project, Client, User, Team, Task, Comment } from '@prisma/client'

export type ProjectWithRelations = Project & {
	client: Client | null
	owner: User
	team: Team | null
	tasks: Task[]
	comments: Comment[]
}
