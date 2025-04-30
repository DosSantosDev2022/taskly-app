'use client'
import { type TaskFormData, taskSchema } from '@/@types/zodSchemas'
import { addTask } from '@/actions/task/addTask'
import {
	TextArea,
	Button,
	ModalRoot,
	ModalTrigger,
	ModalContent,
	ModalHeader,
	ModalTitle,
	ModalClose,
	ModalOverlay,
	Label,
	Input,
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui'
import { DatePicker } from '@/components/ui/datePicker'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaPlus } from 'react-icons/fa'

interface AddTasksProps {
	projectId: string
	ownerId: string
	teamId: string
	onTaskAdded?: () => void
	triggerLabel?: string
	triggerSize?: 'icon' | 'xs' | 'sm' | 'lg' | 'full'
}

const AddTasks = ({
	ownerId,
	projectId,
	teamId,
	onTaskAdded,
	triggerLabel,
	triggerSize,
}: AddTasksProps) => {
	const [open, setOpen] = useState(false)
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<TaskFormData>({
		resolver: zodResolver(taskSchema),
		defaultValues: {},
	})

	const onSubmit = async (data: TaskFormData) => {
		startTransition(async () => {
			try {
				await addTask(data)
				reset()
				if (onTaskAdded) {
					onTaskAdded()
				}
				setOpen(false)
			} catch (error) {
				console.error('Erro ao adicionar nova tarefa', error)
			}
		})
	}

	return (
		<ModalRoot open={open} onOpenChange={setOpen}>
			<ModalTrigger sizes={triggerSize}>
				{triggerLabel}
				<FaPlus size={16} />
			</ModalTrigger>
			<ModalOverlay variant='darkBlur' />
			<ModalContent className='w-xl'>
				<ModalHeader>
					<ModalTitle>Adicione uma nova tarefa</ModalTitle>
					<ModalClose />
				</ModalHeader>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
					<input
						type='hidden'
						value={projectId}
						{...register('projectId')}
					/>
					<input type='hidden' value={ownerId} {...register('ownerId')} />
					<input type='hidden' value={teamId} {...register('teamId')} />
					<div className='space-y-2'>
						<Label>Nome da tarefa</Label>
						<Input placeholder='Nome da tarefa' {...register('title')} />
					</div>
					<div className='flex flex-col space-y-2'>
						<Label>Descrição</Label>
						<TextArea
							placeholder='Descreva a sua tarefa...'
							{...register('description')}
						/>
					</div>
					<div className='grid grid-cols-3 gap-2 p-1'>
						<div className='flex flex-col gap-2'>
							<Label htmlFor='status'>Status</Label>
							<Controller
								control={control}
								name='status'
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<SelectTrigger id='status'>
											<SelectValue placeholder='Selecione' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='to_do'>A fazer</SelectItem>
											<SelectItem value='in_progress'>
												Em andamento
											</SelectItem>
											<SelectItem value='done'>Concluído</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
						</div>
						<div className='flex flex-col gap-2'>
							<Label htmlFor='status'>Prioridade</Label>
							<Controller
								control={control}
								name='priority'
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<SelectTrigger id='priority'>
											<SelectValue placeholder='Selecione' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='low'>Baixa</SelectItem>
											<SelectItem value='medium'>Média</SelectItem>
											<SelectItem value='high'>Alta</SelectItem>
											<SelectItem value='urgent'>Urgente</SelectItem>
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

						<div className='flex flex-col gap-2'>
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
											variants='secondary'
											sizes='full'
											className='h-10'
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

					<Button type='submit' sizes='full'>
						{isPending ? 'Adicionando...' : 'Adicionar tarefa'}
					</Button>
				</form>
			</ModalContent>
		</ModalRoot>
	)
}

export { AddTasks }
