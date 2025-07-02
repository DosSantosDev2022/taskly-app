'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaCheck, FaFilter, FaMapMarkerAlt } from 'react-icons/fa'
import { SiCcleaner } from 'react-icons/si'

import {
	Input,
	Label,
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
	Popover,
	PopoverTrigger,
	PopoverContent,
	Button,
	Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui'
import { useHandleStatusChange } from '@/hooks/useStatusChange'
import { useHandleSearchChange } from '@/hooks/useHandleSearchChange'
import { useHandleLocationChange } from '@/hooks/useHandleLocationChange'
import { Indicator } from '@/components/global/indicator'

const FiltersClients = () => {
	const [statusIsOpen, setStatusIsOpen] = useState(false)
	const [addressIsOpen, setAddressIsOpen] = useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()
	const availabStatuses = ['active', 'inactive']

	const { selectedStatuses, setSelectedStatuses, handleStatusChange } =
		useHandleStatusChange(searchParams.toString())

	const { searchTerm, handleSearchChange, setSearchTerm } =
		useHandleSearchChange(searchParams.toString())

	const {
		states,
		stateSelected,
		citySelected,
		cities,
		isLoadingCities,
		handleStateChange,
		handleCityChange,
		setStateSelected,
		setCitySelected,
	} = useHandleLocationChange(searchParams.toString())

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const search = searchParams.get('search') || ''
		const state = searchParams.get('state') || ''
		const city = searchParams.get('city') || ''
		const status = searchParams.get('status')?.split(',') ?? []
		setSearchTerm(search)
		setStateSelected(state)
		setCitySelected(city)
		setSelectedStatuses(status)
	}, [searchParams])

	const clearFilters = () => {
		setSearchTerm('')
		setStateSelected('')
		setCitySelected('')
		setSelectedStatuses([])
		setStatusIsOpen(false)
		setAddressIsOpen(false)

		router.push('?')
	}

	return (
		<div className='flex items-center space-x-2'>
			<Input
				className='w-56'
				placeholder='Buscar...'
				value={searchTerm}
				onChange={(e) => handleSearchChange(e.target.value)}
			/>
			{/* Popover para Filtro de Localização */}
			<TooltipProvider>
				<Popover open={addressIsOpen} onOpenChange={setAddressIsOpen}>
					{stateSelected.length > 0 && <Indicator color='secondary' />}
					<Tooltip>
						<TooltipTrigger asChild>
							<PopoverTrigger asChild>
								<Button variant="ghost" size="icon">
									<FaMapMarkerAlt />
									<span className="sr-only">Filtrar por localização</span>
								</Button>
							</PopoverTrigger>
						</TooltipTrigger>
						<TooltipContent>
							<p>Localização</p>
						</TooltipContent>
					</Tooltip>

					<PopoverContent className='p-4 w-56 mt-1' align='end' sideOffset={5} collisionPadding={{ right: 16, bottom: 16 }}>
						<div className='flex flex-col gap-4'>
							<div>
								<Label className='text-sm font-medium'>Estado</Label>
								<Select
									value={stateSelected}
									onValueChange={handleStateChange}
								>
									<SelectTrigger className='w-full h-9'>
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
							</div>
							<div>
								<Label className='text-sm font-medium'>Cidade</Label>
								<Select
									value={citySelected}
									onValueChange={handleCityChange}
									disabled={!stateSelected}
								>
									<SelectTrigger className='w-full h-9'>
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
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</TooltipProvider>

			{/* Popover para Filtro de Status */}
			<TooltipProvider>
				<Popover open={statusIsOpen} onOpenChange={setStatusIsOpen}>
					{stateSelected.length > 0 && <Indicator color='secondary' />}
					<Tooltip>
						<TooltipTrigger asChild>
							<PopoverTrigger asChild>
								<Button variant="ghost" size="icon">
									<FaFilter />
									<span className="sr-only">Filtrar por status</span> {/* Acessibilidade */}
								</Button>
							</PopoverTrigger>
						</TooltipTrigger>
						<TooltipContent>
							<p>Filtrar por Status</p> {/* Texto mais descritivo */}
						</TooltipContent>
					</Tooltip>

					<PopoverContent className='p-4 w-32 mt-1' align='end' sideOffset={5} collisionPadding={{ right: 16, bottom: 16 }}>
						{availabStatuses.map((status) => (
							<div key={status} className='flex items-center mb-2 space-x-3'>
								<label className='flex items-center cursor-pointer relative'>
									<input
										type='checkbox'
										id={status}
										checked={selectedStatuses.includes(status)}
										onChange={() => handleStatusChange(status)}
										className='peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-border checked:bg-primary checked:border-primary-foreground'
									/>
									<FaCheck className='absolute w-3 h-3 text-primary-foreground opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none' />
								</label>
								<label
									htmlFor={status}
									className='text-muted-foreground text-sm'
								>
									{status === 'active' ? 'Ativo' : 'Inativo'}
								</label>
							</div>
						))}
					</PopoverContent>
				</Popover>
			</TooltipProvider>
			{/* Botão para Limpar Filtros (com Tooltip) */}
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" onClick={clearFilters}> {/* Use Button aqui também */}
							<SiCcleaner />
							<span className="sr-only">Limpar todos os filtros</span> {/* Acessibilidade */}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Limpar filtros</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	)
}

export { FiltersClients }
