'use client'
import {
	PopoverContent,
	PopoverRoot,
	PopoverTrigger,
} from '@/components/global/popover'
import { Button, Input, Label } from '@/components/ui'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useStatesECities } from '@/hooks/useStatesECities'
import { useState } from 'react'
import { FaCheck, FaFilter } from 'react-icons/fa'
import { LuSearch } from 'react-icons/lu'
import { SiCcleaner } from 'react-icons/si'

const FiltersClients = () => {
	const [searchTerm, setSearchTerm] = useState('')
	const [statusIsOpen, setStatusIsOpen] = useState(false)
	const [addressIsOpen, setAddressIsOpen] = useState(false)
	const [citySelected, setCitySelected] = useState('')
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
	const {
		cities,
		setStateSelected,
		stateSelected,
		states,
		isLoadingCities,
	} = useStatesECities()

	const availabStatuses = ['Ativo', 'Inativo']

	const clearFilters = () => {
		setSearchTerm('')
		setStateSelected('')
		setCitySelected('')
		setSelectedStatuses([])
		setStatusIsOpen(false)
		setAddressIsOpen(false)
	}

	const handleStatusChange = (status: string) => {
		if (selectedStatuses.includes(status)) {
			setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
		} else {
			setSelectedStatuses([...selectedStatuses, status])
		}
	}

	const isAddressSelected = stateSelected || citySelected

	return (
		<div className='flex items-center space-x-2'>
			{/* Filter Search */}
			<Input
				className='w-56 h-10'
				placeholder='Buscar...'
				icon={<LuSearch />}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			{/* <FilterAddress /> */}
			<PopoverRoot
				isOpen={addressIsOpen}
				onToggle={() => setAddressIsOpen(!addressIsOpen)}
			>
				<PopoverTrigger sizes='xs' variants='secondary'>
					{isAddressSelected && (
						<div className='w-4 h-4 rounded-full bg-primary dark:bg-muted absolute right-3 -top-2' />
					)}
					<FaFilter size={24} />
					Localização
				</PopoverTrigger>
				<PopoverContent alignment='bottom' className='p-4 w-56 mt-1'>
					<div className='flex flex-col gap-4'>
						{/* ESTADO */}
						<div>
							<Label className='text-sm font-medium'>Estado</Label>
							<Select
								onValueChange={(value) => {
									setStateSelected(value)
									setCitySelected('') // limpa cidade quando troca o estado
								}}
								value={stateSelected}
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

						{/* CIDADE */}
						<div>
							<Label className='text-sm font-medium'>Cidade</Label>
							<Select
								onValueChange={(value) => setCitySelected(value)}
								value={citySelected}
								disabled={!stateSelected}
							>
								<SelectTrigger className='w-full'>
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
						</div>
					</div>
				</PopoverContent>
			</PopoverRoot>

			{/* Filter Status */}
			<PopoverRoot
				isOpen={statusIsOpen}
				onToggle={() => setStatusIsOpen(!statusIsOpen)}
			>
				<PopoverTrigger
					className='relative'
					sizes='xs'
					variants='secondary'
				>
					{selectedStatuses.length > 0 && (
						<div className='w-4 h-4 rounded-full bg-primary dark:bg-muted absolute right-3 -top-2' />
					)}
					<FaFilter size={10} />
					Status
				</PopoverTrigger>
				<PopoverContent alignment='bottom' className='p-4 w-56 mt-1'>
					<div>
						{availabStatuses.map((status) => (
							<div
								key={status}
								className='flex items-center mb-2 space-x-3'
							>
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
									className='text-muted-foreground text-sm'
									htmlFor={status}
								>
									{status}
								</label>
							</div>
						))}
					</div>
				</PopoverContent>
			</PopoverRoot>

			<Button sizes='xs' variants='secondary' onClick={clearFilters}>
				<SiCcleaner size={18} />
				Limpar
			</Button>
		</div>
	)
}

export { FiltersClients }
