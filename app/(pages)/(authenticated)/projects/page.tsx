import { Pagination } from '@/components/global/pagination'
import { AddProjects, DeleteProjectAction, FiltersProject, ViewDetailsProject } from '@/components/pages/project'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Badge,
	Popover,
	PopoverTrigger,
	Button,
	PopoverContent
} from '@/components/ui'
import { fetchProjects } from '@/actions/project/fetchProjects'
import { formatDate } from '@/utils/formatDate'
import { FaFile } from 'react-icons/fa'
import { isPastDueDate } from '@/utils/isPastDueDate'
import { translateStatus } from '@/utils/translateStatus'
import type { Project } from '@/@types/prismaSchema'
import { MoreHorizontal } from 'lucide-react'


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
		page: currentPage,
		pageSize: limit,
		search,
		status,
		startDate: start ? new Date(start) : undefined,
		endDate: end ? new Date(end) : undefined,
	})

	const headers = [
		'Nome',
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
					<AddProjects />
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
									<TableCell>{project.name}</TableCell>
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
														? 'destructive'
														: 'default'
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
													<ViewDetailsProject project={project} />
													<DeleteProjectAction projectId={project.id} />
												</div>
											</PopoverContent>
										</Popover>
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
