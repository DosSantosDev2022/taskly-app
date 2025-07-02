import { Pagination } from '@/components/global/pagination'
import { AddClients, FiltersClients, ViewDetailsClient, DeleteClientAction } from '@/components/pages/clients'
import {
	Badge,
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui'
import { FaUser } from 'react-icons/fa'
import { fetchClients } from '@/actions/client/fetchClients'
import type { Client } from '@/@types/prismaSchema'
import { MdBorderHorizontal } from 'react-icons/md'
import { MoreHorizontal } from 'lucide-react'

type ClientsSearchParams = {
	searchParams: Promise<{
		search?: string
		status?: string
		state?: string
		city?: string
		page?: string
	}>
}

export default async function Clients({
	searchParams,
}: ClientsSearchParams) {
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
		page: currentPage,
		pageSize: limit,
		search,
		status,
		city,
		state
	})

	return (
		<div className='flex flex-col space-y-1 h-full overflow-hidden'>
			<div className='flex flex-col space-y-3'>
				<div className='flex items-center space-x-3 p-1.5'>
					<FaUser size={28} />
					<h3 className='font-bold text-2xl tracking-wider'>
						Meus Clientes
					</h3>
				</div>
				<div className='flex items-center justify-between p-1 space-x-2'>
					<AddClients />
					<FiltersClients />
				</div>
			</div>

			<div className='flex-grow'>
				<Table>
					<TableHeader>
						<TableRow>
							{headers.map((header) => (
								<TableHead key={header}>{header}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{clients.length > 0 ? (
							clients.map((client: Client) => (
								<TableRow key={client.id}>
									<TableCell>{client.name}</TableCell>
									<TableCell>{client.email}</TableCell>
									<TableCell className='w-24'>{client.phone}</TableCell>
									<TableCell>{client.address}</TableCell>
									<TableCell>{client.city}</TableCell>
									<TableCell className='w-4'>{client.state}</TableCell>
									<TableCell className='w-4'>
										{client.status === 'active' ? (
											<Badge>Ativo</Badge>
										) : (
											<Badge variant='secondary'>Inativo</Badge>
										)}
									</TableCell>
									<TableCell className='w-10'>
										<Popover>
											<PopoverTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
													<span className="sr-only">Abrir menu de ações</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</PopoverTrigger>
											{/* O PopoverContent conterá as ações de visualizar e deletar */}
											<PopoverContent className="w-40 p-1" align="end" sideOffset={5} collisionPadding={{ right: 16, bottom: 16 }}>
												<div className="flex flex-col space-y-1">
													<ViewDetailsClient client={client} />
													<DeleteClientAction clientId={client.id} />
												</div>
											</PopoverContent>
										</Popover>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={8} className='text-center py-6'>
									Nenhum cliente encontrado.
								</TableCell>
							</TableRow>
						)}
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
