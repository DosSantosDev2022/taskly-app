'use client'
import { IndicatorBadge } from '@/components/global/indicatorBadge'
import {
	PopoverContent,
	PopoverRoot,
	PopoverTrigger,
} from '@/components/global/popover'
import { Button, Input } from '@/components/ui'
import { DatePicker } from '@/components/ui/datePicker'
import { Tooltip } from '@/components/ui/tooltip'
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
	const searchParams = useSearchParams()
	const [isOpen, setIsOpen] = useState(false)
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
	}

	return (
		<div className='flex items-center space-x-2'>
			{/* Filter Search */}
			<Input
				className='w-56 h-8'
				placeholder='Buscar...'
				icon={<LuSearch />}
				value={searchTerm}
				onChange={(e) => handleSearchChange(e.target.value)}
			/>
			{/* <FilterDate /> */}
			<DatePicker
				variants='secondary'
				sizes='full'
				date={date}
				onChange={handleDateChange}
				range
			/>
			{/* Filter Status */}
			<PopoverRoot isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
				<PopoverTrigger>
					<Button sizes='icon' variants='secondary'>
						<Tooltip content='Status'>
							{selectedStatuses.length > 0 && (
								<IndicatorBadge color='secondary' />
							)}
							<FaFilter size={14} />
						</Tooltip>
					</Button>
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
									{translateStatus(status)}
								</label>
							</div>
						))}
					</div>
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

export { FiltersProject }
