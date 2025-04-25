import type { ProjectWithRelations } from "@/@types/dataTypes"

export type FetchProjectsParams = {
	query?: Record<string, string | number | boolean | undefined>
	baseUrl?: string // opcional, útil para SSR
	cache?: RequestCache
}

export const fetchProjects = async ({
	query = {},
	baseUrl = process.env.NEXT_PUBLIC_URL,
	cache = 'no-store',
}: FetchProjectsParams) => {
	const searchParams = new URLSearchParams()

	// biome-ignore lint/complexity/noForEach: <explanation>
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined) {
			searchParams.append(key, String(value))
		}
	})

	const res = await fetch(`${baseUrl}/api/projects?${searchParams.toString()}`, {
		cache,
	})

	if (!res.ok) {
		throw new Error('Erro ao buscar projetos')
	}

	return res.json() as Promise<{ projects: ProjectWithRelations[]; total: number }>
}
