interface FetchProjectIdProps {
	projectId: string
	baseUrl?: string
	cache?: RequestCache
	revalidate?: number
}

export const FetchProjectId = async ({
	projectId,
	baseUrl = process.env.NEXT_PUBLIC_URL,
	cache = 'no-cache',
	revalidate
}: FetchProjectIdProps) => {
	try {
		const res = await fetch(`${baseUrl}/api/projects/${projectId}`, {
			cache,
			next : {
				revalidate
			}
		})

		if (!res.ok) {
			throw new Error('Erro ao buscar projetos')
		}

		const data = await res.json()
		return data
	} catch (error) {
		console.error('Erro ao buscar projeto por id')
		throw new Error('Erro ao buscar projeto')
	}
}
