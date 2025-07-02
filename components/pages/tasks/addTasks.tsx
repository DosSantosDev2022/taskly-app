'use client'
import { type TaskFormData, taskSchema } from '@/@types/zodSchemas'
import { addTask } from '@/actions/task/addTask'
import {
	Button,
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
	Label,
	Input,
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	DatePicker,
	Textarea
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaPlus } from 'react-icons/fa'

interface AddTasksProps {
	projectId?: string
	ownerId?: string
	teamId?: string
	onTaskAdded?: () => void
	triggerLabel?: string
}

const AddTasks = ({
	ownerId,
	projectId,
	teamId,
	onTaskAdded,
	triggerLabel,
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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={'ghost'} size='icon'>
					<FaPlus />
				</Button>
			</DialogTrigger>

			<DialogContent >
				<DialogHeader>
					<DialogTitle>Adicione uma nova tarefa</DialogTitle>
					<DialogClose />
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
					<input
						type='hidden'
						value={projectId}
						{...register('projectId')}
					/>
					<input type='hidden' value={ownerId} {...register('ownerId')} />
					<input type='hidden' value={teamId} {...register('teamId')} />
					<div className='flex flex-col space-y-2'>
						<Label>Nome da tarefa</Label>
						<Input placeholder='Nome da tarefa' {...register('title')} />
					</div>
					<div className='flex flex-col space-y-2'>
						<Label>Descrição</Label>
						<Textarea
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
									return (
										<DatePicker
											mode='single'
											value={field.value || undefined}
											onChange={(newDate) => field.onChange(newDate)}
											placeholder="Selecione"
											className="w-full"
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

					<div className='flex justify-end mt-4'>
						<Button type='submit' size='default'>
							{isPending ? 'Adicionando...' : 'Adicionar tarefa'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export { AddTasks }
