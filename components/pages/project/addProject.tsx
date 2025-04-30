'use client'
import { FaPlus } from 'react-icons/fa'
import {
	ModalRoot,
	ModalTrigger,
	ModalContent,
	ModalClose,
	ModalDescription,
	ModalFooter,
	ModalOverlay,
	ModalHeader,
	ModalTitle,
	Label,
	Input,
	Button,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	ModalLoading,
	TextArea,
} from '@/components/ui'
import { useEffect, useRef, useState } from 'react'
import { LuX } from 'react-icons/lu'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ProjectFormData, projectSchema } from '@/@types/zodSchemas'
import type { Client, Team } from '@prisma/client'
import { addProject } from '@/actions/project/addProject'
import { useSession } from 'next-auth/react'
import { useNotification } from '@/context/notificationContext'
import { DatePicker } from '@/components/ui/datePicker'

const AddProjects = ({ clients }: { clients: Client[] }) => {
	const { showNotification } = useNotification()
	const { data: session } = useSession()
	const ownerId = session?.user?.id
	const [isLoading, setIsLoading] = useState(false)
	const [teams, setTeams] = useState<Team[]>([])
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<ProjectFormData>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			ownerId: ownerId || '',
		},
	})

	const closeRef = useRef<HTMLButtonElement | null>(null)

	const onSubmit = async (data: ProjectFormData) => {
		setIsLoading(true)
		const formData = {
			name: data.name,
			description: data.description,
			status: data.status,
			clientId: data.clientId || undefined,
			teamId: data.teamId || undefined,
			dueDate: data.dueDate,
			ownerId,
		}
		const result = await addProject(formData)

		if (result.success) {
			closeRef.current?.click()
			showNotification('Projeto cadastrado com sucesso !', 'success')
			reset()
		} else {
			console.error(result.errors || result.message)
			showNotification('Erro ao cadastrar projeto !', 'error')
		}
		setIsLoading(false)
	}
	useEffect(() => {
		console.log('Erros de validação:', errors)
	}, [errors])
	return (
		<ModalRoot>
			<ModalTrigger sizes='xs'>
				Adicionar <FaPlus />
			</ModalTrigger>
			<ModalOverlay variant='dark' />
			<ModalContent>
				{isLoading && <ModalLoading />}
				<ModalHeader>
					<ModalTitle>Cadastrar Projeto</ModalTitle>
					<ModalClose ref={closeRef}>
						<LuX />
					</ModalClose>
				</ModalHeader>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='p-2 flex flex-col gap-4 max-h-[512px] overflow-y-auto scrollbar-custom'>
						{/* Nome */}
						<div>
							<Label htmlFor='name'>Nome do Projeto</Label>
							<Input
								placeholder='Digite o nome do projeto'
								id='name'
								{...register('name')}
							/>
							{errors.name && (
								<span className='text-danger text-sm'>
									{errors.name.message}
								</span>
							)}
						</div>

						{/* Descrição */}
						<div>
							<Label htmlFor='description'>Descrição</Label>
							<TextArea
								placeholder='Descreva o seu projeto...'
								id='description'
								{...register('description')}
							/>
							{errors.description && (
								<span className='text-danger text-sm'>
									{errors.description.message}
								</span>
							)}
						</div>

						<div className='grid grid-cols-2 gap-2'>
							{/* Cliente */}
							<div>
								<Label htmlFor='clientId'>Cliente</Label>
								<Controller
									control={control}
									name='clientId'
									render={({ field }) => (
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger id='clientId'>
												<SelectValue placeholder='Selecione um cliente' />
											</SelectTrigger>
											<SelectContent>
												{clients.map((client) => (
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

							{/* Equipe */}
							<div>
								<Label htmlFor='teamName'>Equipe</Label>
								<Controller
									control={control}
									name='teamId'
									render={({ field }) => (
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger id='teamId'>
												<SelectValue placeholder='Selecione uma equipe' />
											</SelectTrigger>
											<SelectContent>
												{teams.map((team) => (
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
							</div>
						</div>

						<div className='grid grid-cols-2 gap-2'>
							{/* Status */}
							<div>
								<Label htmlFor='status'>Status</Label>
								<Controller
									control={control}
									name='status'
									render={({ field }) => (
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Selecione o status' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='in_progress'>
													Em andamento
												</SelectItem>
												<SelectItem value='pending'>Pendente</SelectItem>
												<SelectItem value='completed'>
													Concluído
												</SelectItem>
												<SelectItem value='archived'>Arquivado</SelectItem>
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
												onChange={(newDate) =>
													field.onChange(newDate.startDate)
												}
												range
												sizes='full'
												className='h-10'
												variants='accent'
											/>
										)
									}}
								/>
								{errors.dueDate && (
									<p className='text-danger text-sm'>
										{errors.dueDate.message}
									</p>
								)}
							</div>
						</div>
					</div>
					<ModalFooter className='p-2 pb-4 pt-2 flex justify-end'>
						<Button variants='primary' sizes='full' type='submit'>
							Cadastrar
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</ModalRoot>
	)
}

export { AddProjects }
