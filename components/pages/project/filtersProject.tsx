'use client'
import { Indicator } from '@/components/global/indicator'
import { Badge, Button, Input, Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import { DatePicker } from '@/components/ui'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
	DATE_FORMAT,
	useHandleDateChange,
} from '@/hooks/useHandleDateChange'
import { useHandleSearchChange } from '@/hooks/useHandleSearchChange'
import { useHandleStatusChange } from '@/hooks/useStatusChange'
import { translateStatus } from '@/utils/translateStatus'
import { parse } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaCheck, FaFilter } from 'react-icons/fa'
import { LuSearch } from 'react-icons/lu'
import { SiCcleaner } from 'react-icons/si'

const FiltersProject = () => {
	const [statusIsOpen, setStatusIsOpen] = useState(false)
	const searchParams = useSearchParams()
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()
	const availabStatuses = [
		'in_progress',
		'pending',
		'completed',
		'archived',
	]

	const { selectedStatuses, setSelectedStatuses, handleStatusChange } =
		useHandleStatusChange(searchParams.toString())

	const { searchTerm, handleSearchChange, setSearchTerm } =
		useHandleSearchChange(searchParams.toString())

	const { date, handleDateChange, clearDateFilters, setDate } =
		useHandleDateChange(searchParams.toString())

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const search = searchParams.get('search') || ''
		const status = searchParams.get('status')?.split(',') ?? []
		const startdate = searchParams.get('start') || ''
		const endDate = searchParams.get('end') || ''

		const parsedStartDate = startdate
			? parse(startdate, DATE_FORMAT, new Date())
			: null
		const parsedEndDate = endDate
			? parse(endDate, DATE_FORMAT, new Date())
			: null

		setSearchTerm(search)
		setSelectedStatuses(status)
		setDate({ startDate: parsedStartDate, endDate: parsedEndDate })
	}, [searchParams])

	const clearFilters = () => {
		setSearchTerm('')
		clearDateFilters()
		setSelectedStatuses([])
		setIsOpen(false)
		router.push('?')
	}

	return (
		<div className='flex items-center space-x-2'>
			{/* Filter Search */}
			<Input
				className='w-56'
				placeholder='Buscar...'
				value={searchTerm}
				onChange={(e) => handleSearchChange(e.target.value)}
			/>
			{/* <FilterDate /> */}
			<DatePicker
				mode='range'
				value={date}
				onChange={handleDateChange}
				placeholder="Selecione"
			/>
			{/* Popover para Filtro de Status */}
			<TooltipProvider>
				<Popover open={statusIsOpen} onOpenChange={setStatusIsOpen}>
					{selectedStatuses.length > 0 && <Indicator color='secondary' />}
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
									{translateStatus(status)}
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

export { FiltersProject }
