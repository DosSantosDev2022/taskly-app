'use client'
import { BiTask } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { GrView } from 'react-icons/gr'
import { formatDate } from '@/utils/formatDate'
import { DetailRow } from '@/components/pages/clients/detailRow'
import {
	Badge,
	Button,
	ModalClose,
	ModalContent,
	ModalHeader,
	ModalLoading,
	ModalOverlay,
	ModalRoot,
	ModalTitle,
	ModalTrigger,
	TextArea,
} from '@/components/ui'
import { FetchProjectId } from '@/lib/api/fetchProjectId'
import { FormEditProject } from './formEditProject'
import { isPastDueDate } from '@/utils/isPastDueDate'
import { translateStatus } from '@/utils/translateStatus'
import { Progress } from '@/components/ui/progress'
import type { Project } from '@/@types/prismaSchema'
import { AddCommentsProjects } from './addCommentsProject'
import { AddTasks } from '../tasks/addTasks'
import { getPriorityInfo } from '@/utils/mapPriorityToBadgeVariant'
import { FaEdit } from 'react-icons/fa'
import { getTaskProgress } from '@/utils/getTaskProgress'

const ViewDetailsProject = ({ projectId }: { projectId: string }) => {
	const [isEditable, setIsEditable] = useState(false)
	const [project, setProject] = useState<Project | null>(null)
	const [loading, setLoading] = useState(true)
	const progress = getTaskProgress(project?.tasks ?? [])

	const handleEditProject = () => {
		setIsEditable((prev) => !prev)
	}

	const fetchData = async () => {
		try {
			const data = await FetchProjectId({
				projectId,
				cache: 'no-cache',
				revalidate: 0,
			})
			setProject(data)
		} catch (error) {
			console.error('Erro ao buscar detalhes do projeto:', error)
		} finally {
			setLoading(false)
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchData()
	}, [projectId])

	const handleProjectUpdated = () => {
		fetchData()
		setIsEditable(false) // Fechar o formulário de edição após atualização
	}

	return (
		<ModalRoot>
			<ModalTrigger
				className='hover:scale-95 duration-300 transition-all'
				sizes='icon'
				variants='link'
			>
				<GrView size={24} />
			</ModalTrigger>
			<ModalOverlay variant='dark' />
			<ModalContent>
				<ModalHeader>
					<ModalTitle>Detalhes do projeto</ModalTitle>
					<ModalClose />
				</ModalHeader>

				{loading ? (
					<ModalLoading />
				) : project ? (
					isEditable ? (
						<div>
							{/* Aqui entraria o formulário de edição */}
							<FormEditProject
								handleEditProject={handleEditProject}
								project={project}
								handleProjectUpdated={handleProjectUpdated}
							/>
						</div>
					) : (
						<div className='space-y-2  max-h-[628px] overflow-y-scroll scrollbar-custom p-1 '>
							{/* bloco infos */}
							<div className='rounded-2xl border border-border bg-muted/20 p-4 shadow-sm space-y-6'>
								<div className='flex items-center justify-between'>
									<h2 className='text-lg font-semibold tracking-tight text-foreground sm:text-xl'>
										Informações
									</h2>
									<Button sizes='icon' onClick={handleEditProject}>
										<FaEdit size={20} />
									</Button>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<DetailRow label='Nome:' value={project.name} />
									<DetailRow
										label='Status:'
										value={
											<Badge>{translateStatus(project.status)}</Badge>
										}
									/>
									<DetailRow
										label='Data de criação:'
										value={formatDate(project.createdAt)}
									/>

									<DetailRow
										label='Prazo de entrega:'
										value={formatDate(project.dueDate || '')}
									/>
									<DetailRow
										label='Prazo:'
										value={
											project.dueDate ? (
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
											)
										}
									/>
									<DetailRow
										label='Proprietário:'
										value={project.owner.surname}
									/>
								</div>

								<div className='flex flex-col gap-2 whitespace-pre-wrap'>
									<strong className='font-bold'>Descrição: </strong>
									<p className='text-foreground'>{project.description}</p>
								</div>
							</div>

							<div className='space-y-2'>
								{/* bloco tasks */}
								<section className='rounded-2xl border border-border bg-muted/20 p-4 shadow-sm space-y-6'>
									{/* Header */}
									<div className='flex items-center justify-between'>
										<h2 className='text-lg font-semibold tracking-tight text-foreground sm:text-xl'>
											Tarefas
										</h2>
										<AddTasks
											ownerId={project.ownerId}
											projectId={project.id}
											teamId={project.teamId || ''}
											onTaskAdded={handleProjectUpdated}
											triggerSize='icon'
										/>
									</div>

									{/* Progresso */}
									<div className='space-y-1 p-1'>
										<span className='text-sm font-medium text-muted-foreground'>
											{`${progress}% concluído`}
										</span>
										<Progress value={progress} />
									</div>

									{/* Lista de tarefas */}
									<ul className='space-y-2 max-h-[380px] overflow-y-scroll scrollbar-custom p-1 '>
										{project.tasks?.map((task) => {
											const { label, variant } = getPriorityInfo(
												task.priority,
											)
											return (
												<li
													key={task.id}
													className='flex items-center justify-between gap-2 rounded-lg cursor-pointer bg-background px-3 py-2 border border-border hover:bg-background/50 transition'
												>
													<div
														className={`flex gap-1 items-center ${task.status === 'done' ? 'text-success' : 'text-muted-foreground'}`}
													>
														<BiTask />
														<span
															className={`font-medium ${task.status === 'done' ? 'line-through' : ''}`}
														>
															{task.title}
														</span>
													</div>
													<Badge variant={variant}>{label}</Badge>
												</li>
											)
										})}
									</ul>
								</section>

								{/* Bloco Comentários */}
								<section className='border border-border rounded-xl p-4 space-y-4 bg-muted/30 shadow-sm'>
									{/* Cabeçalho */}
									<div className='flex items-center justify-between border-b border-border pb-2'>
										<h2 className='text-xl font-semibold tracking-tight text-foreground'>
											Comentários
										</h2>
										<AddCommentsProjects
											onCommentAdded={handleProjectUpdated}
											projectId={projectId}
											triggerSize='icon'
										/>
									</div>

									{/* Lista de comentários */}
									<ul className='space-y-2 max-h-[428px]  overflow-y-scroll scrollbar-custom p-1 '>
										{project.comments?.map((comment) => (
											<li
												key={comment.id}
												className='rounded-lg border border-border p-4 bg-background hover:bg-background/50 cursor-pointer flex flex-col gap-2 shadow-sm'
											>
												{/* Info do autor e data */}
												<div className='flex items-center justify-between text-xs text-muted-foreground'>
													<span>
														Comentado por:{' '}
														<strong>{comment.user?.name}</strong>
													</span>
													<span>{formatDate(comment.createdAt)}</span>
												</div>

												{/* Conteúdo do comentário */}
												<p className='text-sm text-foreground break-words truncate max-w-[500px]'>
													{comment.content}
												</p>
											</li>
										))}
									</ul>
								</section>

								{/* bloco time */}
								<section className='border border-border p-2 space-x-2'>
									<div className='flex items-center justify-between w-full border border-border px-2 py-1.5 rounded-lg'>
										<h2 className='text-lg font-semibold leading-none tracking-tight text-foreground sm:text-xl'>
											Meu time
										</h2>
									</div>
								</section>
							</div>
						</div>
					)
				) : (
					<p>Projeto não encontrado.</p>
				)}
			</ModalContent>
		</ModalRoot>
	)
}

export { ViewDetailsProject }
