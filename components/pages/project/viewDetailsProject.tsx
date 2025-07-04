'use client'
import { BiTask } from 'react-icons/bi'
import { useState } from 'react'
import { formatDate } from '@/utils/formatDate'
import { DetailRow } from '@/components/pages/clients/detailRow'
import {
	Badge,
	Button,
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from '@/components/ui'
import { FormEditProject } from './formEditProject'
import { isPastDueDate } from '@/utils/isPastDueDate'
import { translateStatus } from '@/utils/translateStatus'
import { Progress } from '@/components/ui/progress'
import { AddCommentsProjects } from './addCommentsProject'
import { AddTasks } from '../tasks/addTasks'
import { getPriorityInfo } from '@/utils/mapPriorityToBadgeVariant'
import { getTaskProgress } from '@/utils/getTaskProgress'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { MdEdit } from 'react-icons/md'
import type { ProjectWithRelations } from '@/@types/prismaSchema'

interface ViewDetailsProjectProps {
	project: ProjectWithRelations
}

const ViewDetailsProject = ({ project }: ViewDetailsProjectProps) => {
	console.log('projeto:', project)
	const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
	const [isEditable, setIsEditable] = useState(false)
	const progress = getTaskProgress(project?.tasks ?? [])

	const toggleExpand = (id: string) => {
		setExpandedComments((prev) => ({
			...prev,
			[id]: !prev[id],
		}))
	}

	const handleEditProject = () => {
		setIsEditable((prev) => !prev)
	}

	const handleProjectUpdated = () => {
		setIsEditable(false) // Fechar o formulário de edição após atualização
	}


	return (
		<Dialog>
			<DialogTrigger
				className='p-1 hover:bg-accent cursor-pointer'
			>
				<span>Detalhes</span>
			</DialogTrigger>

			<DialogContent className='sm:max-w-4xl'>
				<DialogHeader>
					<DialogTitle>Detalhes do projeto</DialogTitle>
					<DialogClose />
				</DialogHeader>

				{project ? (
					isEditable ? (
						<FormEditProject
							handleEditProject={handleEditProject}
							project={project}
							handleProjectUpdated={handleProjectUpdated}
						/>
					) : (
						<div className='space-y-2  max-h-[528px] overflow-y-scroll scrollbar-custom p-1 '>
							{/* bloco infos */}
							<div className='rounded-2xl border border-border bg-muted/20 p-4 shadow-sm space-y-6'>
								<div className='flex items-center justify-between'>
									<h2 className='text-lg font-semibold tracking-tight text-foreground sm:text-xl'>
										Informações
									</h2>
									<Button variant={'ghost'} size='icon' onClick={handleEditProject}>
										<MdEdit />
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
															? 'destructive'
															: 'outline'
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
									<h2 className='font-bold'>Descrição: </h2>
									<div
										className='prose prose-sm sm:prose lg:prose-base xl:prose-base max-w-none'
										// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
										dangerouslySetInnerHTML={{
											__html: project.description || '',
										}}
									/>
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
											projectId={project.id}
										/>
									</div>

									{/* Lista de comentários */}
									<ul className='space-y-2 max-h-[428px] overflow-y-scroll scrollbar-custom p-1'>
										{project.commentsProject?.map((comment) => {
											const isExpanded =
												expandedComments[comment.id] ?? false
											return (
												<li
													key={comment.id}
													className='rounded-lg border border-border p-4 bg-background hover:bg-background/50  flex flex-col gap-2 shadow-sm'
												>
													{/* Info do autor e data */}
													<div className='flex items-center justify-between text-xs text-muted-foreground'>
														<span>
															Comentado por:{' '}
															<strong>{comment.user?.name}</strong>
														</span>
														<div className='flex items-center gap-2'>
															<span>{formatDate(comment.createdAt)}</span>
															{/* Botão de expandir/recolher */}
															{comment.content.length > 100 && (
																<Button
																	variant='link'
																	size='icon'
																	onClick={() => toggleExpand(comment.id)}
																>
																	{isExpanded ? (
																		<>
																			<ChevronUp size={20} />
																		</>
																	) : (
																		<>
																			<ChevronDown size={20} />
																		</>
																	)}
																</Button>
															)}
														</div>
													</div>

													{/* Conteúdo do comentário com expansão */}
													<div
														className={`text-sm text-foreground break-words  transition-all duration-300 ease-in-out ${isExpanded
															? 'max-h-full whitespace-pre-line'
															: 'line-clamp-3'
															}`}
													>
														{comment.content}
													</div>
												</li>
											)
										})}
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
			</DialogContent>
		</Dialog>
	)
}

export { ViewDetailsProject }
