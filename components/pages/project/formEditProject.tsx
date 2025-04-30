'use client'

import { useEffect, useTransition } from 'react'
import {
	Button,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	TextArea,
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { type ProjectFormData, projectSchema } from '@/@types/zodSchemas'
import { updateProject } from '@/actions/project/updateProject'
import { useNotification } from '@/context/notificationContext'
import { DatePicker } from '@/components/ui/datePicker'
import type { Project } from '@/@types/prismaSchema'

interface FormEditProjectProps {
	project: Project
	handleEditProject: () => void
	handleProjectUpdated: () => void
}

const FormEditProject = ({
	project,
	handleEditProject,
	handleProjectUpdated,
}: FormEditProjectProps) => {
	const { showNotification } = useNotification()
	const [isPending, startTransition] = useTransition()

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<ProjectFormData>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			name: '',
			description: '',
			status: 'in_progress',
			clientId: '',
			teamId: '',
			dueDate: new Date(),
		},
	})

	// Preenche o formulário com os dados do projeto
	useEffect(() => {
		if (project) {
			reset({
				name: project.name,
				description: project.description || '',
				status: project.status,
				ownerId: project.ownerId,
				clientId: project.clientId || '',
				teamId: project.teamId || '',
				dueDate: project.dueDate || null,
			})
		}
	}, [project, reset])

	const onSubmit = async (formValues: ProjectFormData) => {
		startTransition(async () => {
			const result = await updateProject(project.id, formValues)

			if (result.success) {
				showNotification('Projeto atualizado com sucesso!', 'success')
				handleEditProject()
				handleProjectUpdated()
			} else {
				showNotification('Erro ao atualizar projeto!', 'error')
			}
		})
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
			{/* Nome */}
			<div>
				<Label htmlFor='name'>Nome do Projeto</Label>
				<Input id='name' {...register('name')} />
				{errors.name && (
					<span className='text-danger text-sm'>
						{errors.name.message}
					</span>
				)}
			</div>
			<div className='flex flex-col'>
				{/* Descrição */}
				<Label htmlFor='description'>Descrição</Label>
				<TextArea
					id='description'
					placeholder='Descreva o projeto...'
					{...register('description')}
				/>
				{errors.description && (
					<span className='text-danger text-sm'>
						{errors.description.message}
					</span>
				)}
			</div>
			<div className='grid grid-cols-2 gap-4'>
				{/* Status */}
				<div>
					<Label htmlFor='status'>Status</Label>
					<Controller
						control={control}
						name='status'
						render={({ field }) => (
							<Select onValueChange={field.onChange} value={field.value}>
								<SelectTrigger id='status'>
									<SelectValue placeholder='Selecione o status' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem key={'item01'} value='in_progress'>
										Em andamento
									</SelectItem>
									<SelectItem key={'item02'} value='pending'>
										Pendente
									</SelectItem>
									<SelectItem key={'item03'} value='completed'>
										Concluído
									</SelectItem>
									<SelectItem key={'item04'} value='archived'>
										Arquivado
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.status && (
						<span className='text-danger text-sm'>
							{errors.status.message}
						</span>
					)}
				</div>

				<div>
					<Label htmlFor='dueDate'>Prazo de entrega</Label>
					<Controller
						control={control}
						name='dueDate'
						render={({ field }) => {
							const value = field.value
								? { startDate: field.value, endDate: field.value }
								: { startDate: null, endDate: null }

							return (
								<DatePicker
									date={value}
									onChange={(newDate) => field.onChange(newDate.startDate)}
									range
									sizes='full'
									className='h-10'
								/>
							)
						}}
					/>
					{errors.dueDate && (
						<p className='text-danger text-sm'>{errors.dueDate.message}</p>
					)}
				</div>
			</div>

			<div className='grid grid-cols-2 gap-4'>
				{/* Cliente */}
				<div>
					<Label htmlFor='clientId'>Cliente</Label>
					<Controller
						control={control}
						name='clientId'
						render={({ field }) => (
							<Select onValueChange={field.onChange} value={field.value}>
								<SelectTrigger id='clientId'>
									<SelectValue placeholder='Selecione o cliente' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										key={project.client?.id}
										value={project.client?.id as string}
									>
										{project.client?.name}
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.clientId && (
						<span className='text-danger text-sm'>
							{errors.clientId.message}
						</span>
					)}
				</div>

				{/* Equipe */}
				{/* <div>
					<Label htmlFor='teamId'>Equipe</Label>
					<Controller
						control={control}
						name='teamId'
						render={({ field }) => (
							<Select onValueChange={field.onChange} value={field.value}>
								<SelectTrigger id='teamId'>
									<SelectValue placeholder='Selecione a equipe' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										key={project.team?.id}
										value={project.team?.id as string}
									>
										{project.team?.teamName}
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.teamId && (
						<span className='text-danger text-sm'>
							{errors.teamId.message}
						</span>
					)}
				</div> */}
			</div>

			<div className='flex items-center justify-end w-full gap-2'>
				<Button
					type='submit'
					sizes='xs'
					variants={`${isPending ? 'disabled' : 'primary'}`}
					className='mt-4'
					disabled={isPending}
				>
					{isPending ? 'Salvando...' : 'Salvar'}
				</Button>
				<Button
					sizes='xs'
					onClick={handleEditProject}
					variants='danger'
					className='mt-4'
				>
					Cancelar
				</Button>
			</div>
		</form>
	)
}

export { FormEditProject }
