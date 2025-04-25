import { Pagination } from '@/components/global/pagination'
import { AddClients } from '@/components/pages/clients/addClients'
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui'
import { FaUser } from 'react-icons/fa'
import { ActionTable } from '@/components/global/actionsTable'
import { v4 as uuidv4 } from 'uuid'
import { FiltersClients } from '@/components/pages/clients/filterClients'
import type { ClientWithProjects } from '@/@types/dataTypes'
import { fetchClients } from '@/lib/api/fetchClients'

type ClientsProps = {
	searchParams: Promise<{
		search?: string
		status?: string
		state?: string
		city?: string
		page?: string
	}>
}

export default async function Clients({ searchParams }: ClientsProps) {
	const { search, city, state, status, page = '1' } = await searchParams
	const currentPage = Number.parseInt(page, 10)
	const limit = 10
	const query = new URLSearchParams()
	if (search) query.set('search', search)
	if (status) query.set('status', status)
	if (state) query.set('state', state)
	if (city) query.set('city', city)
	query.set('page', page)
	query.set('limit', limit.toString())

	const headers = [
		'Nome',
		'Email',
		'Telefone',
		'Endereço',
		'Cidade',
		'Estado',
		'Status',
		'Ação',
	]

	const { clients, total } = await fetchClients({
		query: {
			search,
			status,
			state,
			city,
			page,
			limit,
		},
	})

	return (
		<div className='flex flex-col space-y-3 h-full overflow-hidden'>
			<div className='flex flex-col space-y-3'>
				<div className='flex items-center space-x-3 p-1.5'>
					<FaUser size={28} />
					<h3 className='font-bold text-2xl tracking-wider'>
						Meus Clientes
					</h3>
				</div>
				<div className='flex items-center justify-between p-1.5 space-x-2'>
					<AddClients />
					<FiltersClients />
				</div>
			</div>

			<div className='flex-grow'>
				<Table>
					<TableHeader>
						<tr>
							{headers.map((header) => (
								<TableCell key={header}>{header}</TableCell>
							))}
						</tr>
					</TableHeader>
					<TableBody>
						{clients.map((client: ClientWithProjects) => (
							<TableRow key={uuidv4()}>
								<TableCell>{client.name}</TableCell>
								<TableCell>{client.email}</TableCell>
								<TableCell>{client.phone}</TableCell>
								<TableCell>{client.address}</TableCell>
								<TableCell>{client.city}</TableCell>
								<TableCell>{client.state}</TableCell>
								<TableCell>
									{client.status === 'active' ? (
										<span className='p-1 font-semibold text-success'>
											Ativo
										</span>
									) : (
										<span className='p-1 font-semibold text-warning'>
											Inativo
										</span>
									)}
								</TableCell>
								<TableCell>
									<ActionTable id={client.id} path='clients' />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className='w-full p-2 mt-1 flex items-center justify-between'>
					<span className='text-sm text-muted-foreground'>
						Exibindo {clients.length} de {total} clientes
					</span>
					<Pagination limit={limit} page={currentPage} total={total} />
				</div>
			</div>
		</div>
	)
}
