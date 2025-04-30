'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaCheck, FaFilter, FaMapMarkerAlt } from 'react-icons/fa'
import { LuSearch } from 'react-icons/lu'
import { SiCcleaner } from 'react-icons/si'
import {
	PopoverRoot,
	PopoverTrigger,
	PopoverContent,
} from '@/components/global/popover'
import { Button, Input, Label } from '@/components/ui'
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select'
import { useHandleStatusChange } from '@/hooks/useStatusChange'
import { useHandleSearchChange } from '@/hooks/useHandleSearchChange'
import { useHandleLocationChange } from '@/hooks/useHandleLocationChange'
import { Tooltip } from '@/components/ui/tooltip'
import { IndicatorBadge } from '@/components/global/indicatorBadge'

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
				className='w-56  h-8'
				placeholder='Buscar...'
				icon={<LuSearch />}
				value={searchTerm}
				onChange={(e) => handleSearchChange(e.target.value)}
			/>

			<PopoverRoot
				isOpen={addressIsOpen}
				onToggle={() => setAddressIsOpen(!addressIsOpen)}
			>
				{stateSelected.length > 0 && <IndicatorBadge color='secondary' />}
				<Tooltip content='Localização'>
					<PopoverTrigger>
						<Button sizes='icon' variants='secondary'>
							<FaMapMarkerAlt />
						</Button>
					</PopoverTrigger>
				</Tooltip>

				<PopoverContent alignment='bottom' className='p-4 w-56 mt-1'>
					<div className='flex flex-col gap-4'>
						<div>
							<Label className='text-sm font-medium'>Estado</Label>
							<Select
								value={stateSelected}
								onValueChange={handleStateChange}
							>
								<SelectTrigger className='w-full'>
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
								<SelectTrigger className='w-full'>
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
			</PopoverRoot>
			<PopoverRoot
				isOpen={statusIsOpen}
				onToggle={() => setStatusIsOpen(!statusIsOpen)}
			>
				<Tooltip content='Status'>
					<PopoverTrigger>
						<Button sizes='icon' variants='secondary' className='relative'>
							{selectedStatuses.length > 0 && (
								<IndicatorBadge color='secondary' />
							)}
							<FaFilter />
						</Button>
					</PopoverTrigger>
				</Tooltip>

				<PopoverContent alignment='bottom' className='p-4 w-56 mt-1'>
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
			</PopoverRoot>
			<Tooltip position='top-end' content='Limpar filtros'>
				<Button sizes='icon' variants='secondary' onClick={clearFilters}>
					<SiCcleaner />
				</Button>
			</Tooltip>
		</div>
	)
}

export { FiltersClients }
