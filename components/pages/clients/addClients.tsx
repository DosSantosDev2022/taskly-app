'use client'
import { FaPlus } from 'react-icons/fa'
import { LuX } from 'react-icons/lu'
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
} from '@/components/ui'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useStatesECities } from '@/hooks/useStatesECities'
import { useNotification } from '@/context/notificationContext'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addClient } from '@/actions/client/addClient'
import { useRef } from 'react'

const clientSchema = z.object({
	name: z.string().min(1, 'Nome é obrigatório'),
	email: z.string().email('E-mail inválido').optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
	zipcode: z.string().optional(),
	state: z.string().optional(),
	city: z.string().optional(),
	status: z.enum(['active', 'inactive']).optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

const AddClients = () => {
	const { showNotification } = useNotification()
	const {
		cities,
		setStateSelected,
		stateSelected,
		states,
		isLoadingCities,
	} = useStatesECities()

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<ClientFormData>({
		resolver: zodResolver(clientSchema),
	})

	const closeRef = useRef<HTMLButtonElement | null>(null)

	const onSubmit = async (data: ClientFormData) => {
		const response = await addClient(data)

		if (response.success) {
			showNotification('Cliente cadastrado com sucesso !', 'success')
			closeRef.current?.click() // Fecha o modal
		} else {
			console.error('Erro:', response.errors || response.message)
			// Exibe erro no toast ou algo do tipo
		}
	}
	return (
		<ModalRoot>
			<ModalTrigger>
				Adicionar <FaPlus />
			</ModalTrigger>
			<ModalOverlay variant='dark' />
			<ModalContent>
				<ModalHeader>
					<ModalTitle>Cadastrar cliente</ModalTitle>
					<ModalClose ref={closeRef}>
						<LuX />
					</ModalClose>
				</ModalHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-4 px-4 py-2 max-h-[512px] overflow-y-auto scrollbar-custom'
				>
					<div className='grid grid-cols-2 gap-2  p-1.5'>
						{/* Nome (obrigatório) */}
						<div className='flex flex-col gap-1 w-full'>
							<Label htmlFor='name' className='text-sm font-medium'>
								Nome *
							</Label>
							<Input
								type='text'
								id='name'
								required
								className='w-full'
								placeholder='Nome do cliente'
								{...register('name')}
							/>
							{errors.name && (
								<span className='text-danger text-sm'>
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
							/>
							{errors.email && (
								<span className='text-danger text-sm'>
									{errors.email.message}
								</span>
							)}
						</div>
					</div>

					<div className='grid grid-cols-2 gap-2 p-1.5 '>
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
							/>
							{errors.phone && (
								<span className='text-danger text-sm'>
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
							/>
							{errors.address && (
								<span className='text-danger text-sm'>
									{errors.address.message}
								</span>
							)}
						</div>
					</div>

					<div className='grid grid-cols-3 gap-2 p-1.5'>
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
							/>
							{errors.zipcode && (
								<span className='text-danger text-sm'>
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
										value={field.value}
									>
										<SelectTrigger className='w-full h-12'>
											<SelectValue placeholder='Selecione o estado' />
										</SelectTrigger>
										<SelectContent>
											{states.map((state) => (
												<SelectItem key={state.id} value={state.sigla}>
													{state.nome}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
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
										value={field.value}
										disabled={!stateSelected}
									>
										<SelectTrigger className='w-full h-12'>
											{isLoadingCities ? (
												<SelectValue placeholder='Carregando...' />
											) : (
												<SelectValue placeholder='Seleciona a cidade' />
											)}
										</SelectTrigger>
										<SelectContent>
											{cities.map((city) => (
												<SelectItem key={city.id} value={city.nome}>
													{city.nome}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</div>
					</div>

					{/* Status (select com enum) */}
					<div className='flex flex-col gap-1 p-1.5'>
						<Label htmlFor='status' className='text-sm font-medium'>
							Status
						</Label>
						<Controller
							control={control}
							name='status'
							render={({ field }) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className='w-full'>
										<SelectValue placeholder='Selecione o estado' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='active'>Ativo</SelectItem>
										<SelectItem value='inactive'>Inativo</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<ModalFooter className='px-4 pb-4 pt-2 flex justify-end'>
						<Button variants='primary' sizes='full' type='submit'>
							Cadastrar
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</ModalRoot>
	)
}

export { AddClients }
