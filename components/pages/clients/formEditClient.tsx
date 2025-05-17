import { useEffect, useState, useTransition } from 'react'
import { type ClientFormData, clientSchema } from '@/@types/zodSchemas'
import {
	Button,
	Input,
	Label,
	ModalLoading,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui'
import { useStatesECities } from '@/hooks/useStatesECities'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Client } from '@prisma/client'
import { Controller, useForm } from 'react-hook-form'
import { updateClient } from '@/actions/client/updateClient'
import { useNotification } from '@/context/notificationContext'

interface FormEditClientProps {
	client: Client
	handleEditClient: () => void
}

const FormEditClient = ({
	client,
	handleEditClient,
}: FormEditClientProps) => {
	const { showNotification } = useNotification()
	const [isPending, startTransition] = useTransition()
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
		reset,
		formState: { errors },
	} = useForm<ClientFormData>({
		resolver: zodResolver(clientSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			address: '',
			state: '',
			city: '',
			zipcode: '',
		},
	})

	// Popula os campos com os dados do cliente
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (client) {
			reset({
				name: client.name,
				email: client.email || '',
				phone: client.phone || '',
				address: client.address || '',
				state: client.state || '',
				city: client.city || '',
				zipcode: client.zipcode || '',
				status: client.status || 'active',
			})
			setStateSelected(client.state || '') // atualiza estado selecionado para carregar cidades
		}
	}, [client, states, reset, setStateSelected])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (client && cities.length > 0) {
			// apenas reatribui a cidade (não chama reset inteiro)
			reset((prev) => ({
				...prev,
				city: client.city || '',
			}))
		}
	}, [cities])

	const onSubimit = async (formvalues: ClientFormData) => {
		startTransition(async () => {
			const result = await updateClient(client.id, formvalues)

			if (result.success) {
				showNotification('Cliente atualizado com sucesso !', 'success')
				handleEditClient()
			} else {
				showNotification('Erro ao atualizar cliente !', 'error')
			}
		})
	}

	return (
		<form onSubmit={handleSubmit(onSubimit)}>
			<div className='space-y-2'>
				<div className='space-y-4'>
					<div className='grid grid-cols-2 gap-2 w-full'>
						<div className='flex flex-col space-y-2'>
							<Label htmlFor='name'>Nome</Label>
							<Input id='name' {...register('name')} />
							{errors.name && (
								<span className='text-danger text-sm'>
									{errors.name.message}
								</span>
							)}
						</div>
						<div className='flex flex-col space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input id='email' type='email' {...register('email')} />
							{errors.email && (
								<span className='text-danger text-sm'>
									{errors.email.message}
								</span>
							)}
						</div>
					</div>

					<div className='grid grid-cols-2 gap-2 w-full'>
						<div className='flex flex-col gap-1 w-full'>
							<Label htmlFor='phone'>Telefone</Label>
							<Input id='phone' type='text' {...register('phone')} />
							{errors.phone && (
								<span className='text-danger text-sm'>
									{errors.phone.message}
								</span>
							)}
						</div>
						<div className='flex flex-col gap-1 w-full'>
							<Label htmlFor='address'>Endereço</Label>
							<Input id='address' type='text' {...register('address')} />
							{errors.address && (
								<span className='text-danger text-sm'>
									{errors.address.message}
								</span>
							)}
						</div>
					</div>

					<div className='grid grid-cols-3 gap-2 w-full'>
						<div className='flex flex-col gap-1'>
							<Label htmlFor='state'>Estado</Label>
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
							{errors.state && (
								<span className='text-danger text-sm'>
									{errors.state.message}
								</span>
							)}
						</div>

						<div className='flex flex-col gap-1'>
							<Label htmlFor='city'>Cidade</Label>
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
											<SelectValue
												placeholder={
													isLoadingCities
														? 'Carregando...'
														: 'Selecione a cidade'
												}
											/>
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
							{errors.city && (
								<span className='text-danger text-sm'>
									{errors.city.message}
								</span>
							)}
						</div>

						<div className='flex flex-col gap-1 w-full'>
							<Label htmlFor='zipcode'>CEP</Label>
							<Input id='zipcode' type='text' {...register('zipcode')} />
							{errors.zipcode && (
								<span className='text-danger text-sm'>
									{errors.zipcode.message}
								</span>
							)}
						</div>
					</div>

					<div className='flex flex-col gap-1'>
						<Label htmlFor='status' className='text-sm font-medium'>
							Status
						</Label>
						<Controller
							control={control}
							name='status'
							render={({ field }) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className='w-full h-12'>
										<SelectValue placeholder='Selecione o status' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='active'>Ativo</SelectItem>
										<SelectItem value='inactive'>Inativo</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
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
						onClick={handleEditClient}
						variants='danger'
						className='mt-4'
					>
						Cancelar
					</Button>
				</div>
			</div>
		</form>
	)
}

export { FormEditClient }
