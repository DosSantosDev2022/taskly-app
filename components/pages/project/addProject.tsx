'use client'
import { FaPlus } from 'react-icons/fa'
import {
	Label,
	Input,
	Button,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
	Textarea,
	DatePicker,
	RichTextEditor
} from '@/components/ui'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ProjectFormData, projectSchema } from '@/@types/zodSchemas'
import type { Team } from '@prisma/client'
import { addProject } from '@/actions/project/addProject'
import { useSession } from 'next-auth/react'
import { useNotification } from '@/context/notificationContext'
import { useClientsQuery } from '@/hooks/useClientsQuery'
import { Loader2 } from 'lucide-react'

const AddProjects = () => {
	const { showNotification } = useNotification()
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { data: session, status: sessionStatus } = useSession()
	const ownerId = session?.user?.id
	const [isLoading, setIsLoading] = useState(false)
	const [teams, setTeams] = useState<Team[]>([])

	const {
		clients,
		isLoading: isLoadingClients,
		isError: isErrorClients,
	} = useClientsQuery()

	const initialDefaultValues = {
		name: '',
		description: '',
		dueDate: undefined,
		clientId: '',
		teamId: '',
		status: 'pending' as const, // Definindo 'pending' como default
		ownerId: '', // Será atualizado via useEffect
	};

	const {
		register,
		handleSubmit,
		control,
		reset,
		setValue,
		formState: { errors },
	} = useForm<ProjectFormData>({
		resolver: zodResolver(projectSchema),
		defaultValues: initialDefaultValues,
	})

	const closeRef = useRef<HTMLButtonElement | null>(null)

	// useEffect para resetar o formulário quando o modal é fechado
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Se o modal está fechado (!isDialogOpen), resete o formulário para os valores iniciais.
		// Isso garante que ele estará limpo na próxima vez que for aberto.
		if (!isDialogOpen) {
			reset({
				...initialDefaultValues,
				// Garante que o ownerId seja o mais atual da sessão se disponível,
				// caso contrário, volta para o valor padrão vazio.
				ownerId: session?.user?.id || '',
			});
		}
	}, [isDialogOpen, reset, session?.user?.id]);

	// Opcional: useEffect para setar o ownerId se a sessão carregar depois da montagem do form
	useEffect(() => {
		if (sessionStatus === 'authenticated' && ownerId && control._formValues.ownerId === '') {
			// Apenas define se o ownerId no formulário ainda estiver vazio
			setValue('ownerId', ownerId);
		}
	}, [sessionStatus, ownerId, setValue, control]);

	const onSubmit = async (data: ProjectFormData) => {
		setIsLoading(true)
		const formData = {
			name: data.name,
			description: data.description,
			status: data.status,
			clientId: data.clientId || undefined,
			teamId: data.teamId || undefined,
			dueDate: data.dueDate ? new Date(data.dueDate) : null,
			ownerId,
		}
		const result = await addProject(formData)

		if (result.success) {
			showNotification('Projeto cadastrado com sucesso !', 'success')
			reset()
			setIsDialogOpen(false)
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
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button>
					Adicionar <FaPlus className='ml-2' /> {/* Ícone com margem */}
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-4xl'>
				<DialogHeader>
					<DialogTitle>Cadastrar Projeto</DialogTitle>
					<DialogDescription className='sr-only'>
						Preencha os campos para cadastrar um novo projeto.
					</DialogDescription>
					<DialogClose ref={closeRef} />
				</DialogHeader>

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
								<span className='text-destructive text-sm'>
									{errors.name.message}
								</span>
							)}
						</div>

						{/* Descrição */}
						<div>
							<Label htmlFor='description'>Descrição</Label>
							<Controller
								name='description'
								control={control}
								render={({ field }) => (
									<RichTextEditor
										content={field.value}
										onChange={(newContent) => {
											field.onChange(newContent || '');
										}}
										placeholder='Descreva seu projeto em detalhes...'
										maxCharacters={10000}
									/>
								)}
							/>
							{errors.description && (
								<span className='text-destructive text-sm'>
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
									<span className='text-destructive text-sm'>
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
									<span className='text-destructive text-sm'>
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
												<SelectValue />
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
									<span className='text-destructive text-sm'>
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

										return (
											<DatePicker
												mode='single'
												value={field.value || undefined}
												onChange={(newDate) => field.onChange(newDate)}
											/>
										);
									}}
								/>
								{errors.dueDate && (
									<p className='text-destructive text-sm'>
										{errors.dueDate.message}
									</p>
								)}
							</div>
						</div>
					</div>
					<DialogFooter className='p-2 pb-4 pt-2 flex justify-end'>
						<Button variant='default' size='default' type='submit'>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{isLoading ? 'Cadastrando...' : 'Cadastrar'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export { AddProjects }
