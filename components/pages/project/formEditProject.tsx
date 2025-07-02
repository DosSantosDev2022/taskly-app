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
	Textarea,
	DatePicker,
	RichTextEditor
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { type ProjectFormData, projectSchema } from '@/@types/zodSchemas'
import { updateProject } from '@/actions/project/updateProject'
import { useNotification } from '@/context/notificationContext'
import type { ProjectWithRelations } from '@/@types/prismaSchema'
import { useClientsQuery } from '@/hooks/useClientsQuery'

interface FormEditProjectProps {
	project: ProjectWithRelations
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

	//hook para buscar a lista de clientes
	const {
		clients,
		isLoading: isLoadingClients,
		isError: isErrorClients,
	} = useClientsQuery()

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
				dueDate: project.dueDate ?? undefined
			})
		}
	}, [project, reset])

	const onSubmit = async (formValues: ProjectFormData) => {
		startTransition(async () => {
			const result = await updateProject(project.id, formValues)

			if (result.success) {
				showNotification('Projeto atualizado com sucesso!', 'success', 'Tudo Certo!')
				handleEditProject()
				handleProjectUpdated()
			} else {
				showNotification('Erro ao atualizar projeto!', 'error', 'Falha!')
			}
		})
	}

	// Adiciona um estado de loading e erro para os clientes
	if (isLoadingClients) {
		return <p className='text-center py-4'>Carregando clientes...</p>
	}

	if (isErrorClients) {
		return (
			<p className='text-danger text-center py-4'>
				Erro ao carregar lista de clientes.
			</p>
		)
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
				<Controller
					name='description'
					control={control}
					render={({ field }) => (
						<RichTextEditor
							content={field.value}
							onChange={field.onChange}
							placeholder='Descreva seu projeto em detalhes...'
							maxCharacters={10000}
						/>
					)}
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
									<SelectItem key={'in_progress'} value='in_progress'>
										Em andamento
									</SelectItem>
									<SelectItem key={'pending'} value='pending'>
										Pendente
									</SelectItem>
									<SelectItem key={'completed'} value='completed'>
										Concluído
									</SelectItem>
									<SelectItem key={'archived'} value='archived'>
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
									value={value}
									onChange={(newDate) => field.onChange(newDate)}
									mode='range'
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
									{/* Mapeia a lista de clientes obtida pelo hook */}
									{clients?.map((client) => (
										<SelectItem key={client.id} value={client.id}>
											{client.name}
										</SelectItem>
									))}
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

				{/* Equipe (descomente quando tiver um hook useTeamsQuery e uma API para buscar teams) */}
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
                  {teams?.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.teamName}
                    </SelectItem>
                  ))}
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
					size='sm'
					variant={`${isPending ? 'link' : 'default'}`}
					className='mt-4'
					disabled={isPending}
				>
					{isPending ? 'Salvando...' : 'Salvar'}
				</Button>
				<Button
					size='sm'
					onClick={handleEditProject}
					variant='destructive'
					className='mt-4'
				>
					Cancelar
				</Button>
			</div>
		</form>
	)
}

export { FormEditProject }
