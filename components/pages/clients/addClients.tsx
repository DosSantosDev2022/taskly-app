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
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui'
import { useStatesECities } from '@/hooks/useStatesECities'
import { useNotification } from '@/context/notificationContext'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addClient } from '@/actions/client/addClient'
import { useEffect, useState } from 'react' // Importe useEffect
import { type ClientFormData, clientSchema } from '@/@types/zodSchemas'
import { Loader2 } from 'lucide-react'

const initialDefaultValues: ClientFormData = {
	name: '',
	email: '',
	phone: '',
	address: '',
	zipcode: '',
	state: '',
	city: '',
	status: 'active',
};


const AddClients = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const { showNotification } = useNotification()
	const {
		cities,
		setStateSelected,
		stateSelected,
		states,
		isLoadingCities,
		resetStatesAndCities
	} = useStatesECities()

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<ClientFormData>({
		resolver: zodResolver(clientSchema),
		defaultValues: initialDefaultValues, // Setamos os valores padrão aqui
	})

	// useEffect para resetar o formulário quando o modal é fechado
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!isDialogOpen) {
			// Reseta o formulário para os valores padrão quando o dialog é fechado
			reset(initialDefaultValues);
			resetStatesAndCities()

			if (setStateSelected) {
				setStateSelected(''); // Limpa o estado selecionado, o que deve limpar as cidades
			}
		}
	}, [isDialogOpen, reset, setStateSelected]);

	const onSubmit = async (data: ClientFormData) => {
		setIsLoading(true)
		const response = await addClient(data)

		if (response.success) {
			showNotification('Cliente cadastrado com sucesso!', 'success')
			setIsDialogOpen(false) // Ao fechar, o useEffect acima fará o reset
		} else {
			console.error('Erro:', response.errors || response.message)
			showNotification('Erro ao cadastrar cliente!', 'error')
		}

		setIsLoading(false)
	}

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button size='sm' className='flex items-center gap-2'>
					Adicionar <FaPlus />
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Cadastrar cliente</DialogTitle>
					<DialogDescription className='sr-only'>
						Preencha os campos abaixo para cadastrar um novo cliente.
					</DialogDescription>
					<DialogClose />
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='space-y-4 p-2 flex flex-col gap-4 max-h-[512px] overflow-y-auto scrollbar-custom'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>

							<div className='flex flex-col gap-1 w-full'>
								<Label htmlFor='name' className='text-sm font-medium'>
									Nome *
								</Label>
								<Input
									type='text'
									id='name'
									className='w-full'
									placeholder='Nome do cliente'
									{...register('name')}
									disabled={isLoading}
								/>
								{errors.name && (
									<span className='text-destructive text-sm'>
										{errors.name.message}
									</span>
								)}
							</div>

							{/* Email */}
							<div className='flex flex-col gap-1 w-full'>
								<Label htmlFor='email' className='text-sm font-medium'>
									Email
								</Label>
								<Input
									type='email'
									id='email'
									className='w-full'
									placeholder='cliente@email.com'
									{...register('email')}
									disabled={isLoading}
								/>
								{errors.email && (
									<span className='text-destructive text-sm'>
										{errors.email.message}
									</span>
								)}
							</div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
							{/* Telefone */}
							<div className='flex flex-col gap-1'>
								<Label htmlFor='phone' className='text-sm font-medium'>
									Telefone
								</Label>
								<Input
									type='text'
									id='phone'
									placeholder='(99) 99999-9999'
									{...register('phone')}
									disabled={isLoading}
								/>
								{errors.phone && (
									<span className='text-destructive text-sm'>
										{errors.phone.message}
									</span>
								)}
							</div>

							{/* Endereço */}
							<div className='flex flex-col gap-1'>
								<Label htmlFor='address' className='text-sm font-medium'>
									Endereço
								</Label>
								<Input
									type='text'
									id='address'
									placeholder='Rua, número, bairro...'
									{...register('address')}
									disabled={isLoading}
								/>
								{errors.address && (
									<span className='text-destructive text-sm'>
										{errors.address.message}
									</span>
								)}
							</div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-2'> {/* Responsividade para 3 colunas */}
							{/* CEP */}
							<div className='flex flex-col gap-1'>
								<Label htmlFor='zipcode' className='text-sm font-medium'>
									CEP
								</Label>
								<Input
									type='text'
									id='zipcode'
									placeholder='00000-000'
									{...register('zipcode')}
									disabled={isLoading}
								/>
								{errors.zipcode && (
									<span className='text-destructive text-sm'>
										{errors.zipcode.message}
									</span>
								)}
							</div>

							{/* Estado */}
							<div className='flex flex-col gap-1'>
								<Label htmlFor='state' className='text-sm font-medium'>
									Estado
								</Label>
								<Controller
									control={control}
									name='state'
									render={({ field }) => (
										<Select
											onValueChange={(value) => {
												field.onChange(value)
												setStateSelected(value)
											}}
											value={field.value || ''}
											disabled={isLoading}
										>
											<SelectTrigger className='w-full h-9'>
												<SelectValue placeholder='Selecione o estado' />
											</SelectTrigger>
											<SelectContent>
												{states.length === 0 ? (
													<SelectItem value="Carregando estados..." disabled>Carregando estados...</SelectItem>
												) : (
													states.map((state) => (
														<SelectItem key={state.id} value={state.sigla}>
															{state.nome}
														</SelectItem>
													))
												)}
											</SelectContent>
										</Select>
									)}
								/>
								{errors.state && (
									<span className='text-destructive text-sm'>
										{errors.state.message}
									</span>
								)}
							</div>

							{/* Cidade */}
							<div className='flex flex-col gap-1'>
								<Label htmlFor='city' className='text-sm font-medium'>
									Cidade
								</Label>
								<Controller
									control={control}
									name='city'
									render={({ field }) => (
										<Select
											onValueChange={field.onChange}
											value={field.value || ''}
											disabled={isLoading || !stateSelected || isLoadingCities}
										>
											<SelectTrigger className='w-full h-9'>
												{isLoadingCities ? (
													<SelectValue placeholder='Carregando cidades...' />
												) : (
													<SelectValue placeholder='Selecione a cidade' />
												)}
											</SelectTrigger>
											<SelectContent>
												{isLoadingCities ? (
													<SelectItem value="Carregando cidades..." disabled>Carregando...</SelectItem>
												) : cities.length === 0 && stateSelected ? (
													<SelectItem value="Carregando cidades..." disabled>Nenhuma cidade encontrada para o estado</SelectItem>
												) : cities.length === 0 && !stateSelected ? (
													<SelectItem value="Carregando cidades..." disabled>Selecione um estado primeiro</SelectItem>
												) : (
													cities.map((city) => (
														<SelectItem key={city.id} value={city.nome}>
															{city.nome}
														</SelectItem>
													))
												)}
											</SelectContent>
										</Select>
									)}
								/>
								{errors.city && (
									<span className='text-destructive text-sm'>
										{errors.city.message}
									</span>
								)}
							</div>
						</div>

						{/* Status (select com enum) */}
						<div className='flex flex-col gap-1'>
							<Label htmlFor='status' className='text-sm font-medium'>
								Status
							</Label>
							<Controller
								control={control}
								name='status'
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										value={field.value}
										disabled={isLoading}
									>
										<SelectTrigger className='w-full'>
											<SelectValue placeholder='Selecione o status' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='active'>Ativo</SelectItem>
											<SelectItem value='inactive'>Inativo</SelectItem>
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
					</div>

					<DialogFooter className='p-2 pb-4 pt-2 flex justify-end'>
						<Button variant='default' size='default' type='submit' disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{isLoading ? 'Cadastrando...' : 'Cadastrar'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export { AddClients }