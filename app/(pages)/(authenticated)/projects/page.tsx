import { Pagination } from '@/components/global/pagination'
import { AddProjects } from '@/components/pages/project/addProject'
import { FiltersProject } from '@/components/pages/project/filtersProject'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui'
import { fetchClients } from '@/lib/api/fetchClients'
import { fetchProjects } from '@/lib/api/fetchProjects'
import { formatDate } from '@/utils/formatDate'
import { FaFile } from 'react-icons/fa'
import { ActionProjectTable } from '@/components/pages/project/actionProjectTable'
import { Badge } from '@/components/ui'
import { isPastDueDate } from '@/utils/isPastDueDate'
import { translateStatus } from '@/utils/translateStatus'
import type { Project } from '@/@types/prismaSchema'

type ProjectProps = {
	searchParams: Promise<{
		search?: string
		status?: string
		start?: string
		end?: string
		page?: string
	}>
}

export default async function Projects({ searchParams }: ProjectProps) {
	const { search, start, end, status, page = '1' } = await searchParams

	const currentPage = Number.parseInt(page, 10)
	const limit = 10

	const query = new URLSearchParams()
	if (search) query.set('search', search)
	if (status) query.set('status', status)
	if (start) query.set('start', start)
	if (end) query.set('end', end)
	query.set('page', page)
	query.set('limit', limit.toString())

	const { projects, total } = await fetchProjects({
		query: {
			search,
			status,
			start,
			end,
			page,
			limit,
		},
		cache: 'no-cache',
	})

	const { clients } = await fetchClients({ revalidade: 0 }) // revalida a cada 1h

	const headers = [
		'Nome',
		'Descrição',
		'Cliente',
		'Proprietário',
		'Time',
		'Data',
		'Prazo',
		'Status prazo',
		'Status',
		'Ações',
	]

	return (
		<div className='flex flex-col space-y-3 h-full overflow-hidden'>
			<div className='flex flex-col space-y-3'>
				<div className='flex items-center space-x-3 p-1.5'>
					<FaFile size={28} />
					<h3 className='font-bold text-2xl tracking-wider'>
						Meus Projetos
					</h3>
				</div>

				<div className='flex items-center justify-between p-1.5 space-x-2'>
					<AddProjects clients={clients} />
					{/* Filters */}
					<FiltersProject />
				</div>
			</div>

			<div className='flex-grow'>
				<Table>
					<TableHeader>
						<TableRow>
							{headers.map((header) => (
								<TableHead className='text-sm font-semibold' key={header}>
									{header}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{projects.length > 0 ? (
							projects.map((project: Project) => (
								<TableRow key={project.id}>
									<TableCell className='w-32'>{project.name}</TableCell>
									<TableCell>{project.description}</TableCell>
									<TableCell className='w-32'>
										{project.client?.name}
									</TableCell>
									<TableCell className='w-28'>
										{project.owner.surname}
									</TableCell>
									<TableCell>
										{project.team ? <>{project.team?.teamName}</> : <>-</>}
									</TableCell>
									<TableCell className='w-10'>
										{formatDate(project.createdAt)}
									</TableCell>
									<TableCell className='w-10'>
										{formatDate(project.dueDate || '')}
									</TableCell>
									<TableCell className='w-10'>
										{project.dueDate ? (
											<Badge
												variant={
													isPastDueDate(project.dueDate)
														? 'danger'
														: 'primary'
												}
											>
												{isPastDueDate(project.dueDate)
													? 'Fora do prazo'
													: 'No prazo'}
											</Badge>
										) : (
											'-'
										)}
									</TableCell>
									<TableCell className='w-8'>
										{translateStatus(project.status)}
									</TableCell>
									<TableCell className='w-10'>
										<ActionProjectTable
											project={project}
											path='projects'
										/>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={8} className='text-center py-6'>
									Nenhum projeto encontrado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<div className='w-full p-2 mt-1 flex items-center justify-between'>
					<span className='text-sm text-muted-foreground'>
						Exibindo {projects.length} de {total} projetos
					</span>
					<Pagination limit={limit} page={currentPage} total={total} />
				</div>
			</div>
		</div>
	)
}
