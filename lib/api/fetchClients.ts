import type { ClientWithProjects } from '@/@types/dataTypes'

type FetchClientsParams = {
	query?: Record<string, string | number | boolean | undefined>
	baseUrl?: string
	cache?: RequestCache
	revalidade?: number
}

type FetchClientsResponse = {
	clients: ClientWithProjects[]
  total: number
}

export async function fetchClients({
	query = {},
	baseUrl = process.env.NEXT_PUBLIC_URL,
	cache = 'force-cache',
	revalidade
}: FetchClientsParams = {}): Promise<FetchClientsResponse> {
	const searchParams = new URLSearchParams()

	// biome-ignore lint/complexity/noForEach: <explanation>
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined) {
			searchParams.append(key, String(value))
		}
	})

	try {
		const res = await fetch(`${baseUrl}/api/clients?${searchParams.toString()}`, {
			cache,
			next: {
				revalidate: revalidade
			}
		})

		if (!res.ok) {
			throw new Error(`Erro ao buscar clientes: ${res.statusText}`)
		}

		const data = await res.json()
		return {
      clients: data.clients, 
      total: data.total
    }
	} catch (error) {
		console.error('Erro no fetchClients:', error)
		return { clients: [], total: 0 }
	}
}
