'use client'
import {
	PopoverContent,
	PopoverRoot,
	PopoverTrigger,
} from '@/components/global/popover'
import { Button, Input } from '@/components/ui'
import { DatePicker } from '@/components/ui/datePicker'
import { useState } from 'react'
import { FaCheck, FaFilter } from 'react-icons/fa'
import { LuSearch } from 'react-icons/lu'
import { SiCcleaner } from 'react-icons/si'

const FiltersProject = () => {
	const [searchTerm, setSearchTerm] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [date, setDate] = useState<{
		startDate: Date | null
		endDate: Date | null
	}>({
		startDate: null,
		endDate: null,
	})
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
	const availabStatuses = ['Em andamento', 'Concluído', 'Pendente']

	const clearFilters = () => {
		setSearchTerm('')
		setDate({ startDate: null, endDate: null })
		setSelectedStatuses([])
		setIsOpen(false)
	}

	const handleDateChange = (newDate: {
		startDate: Date | null
		endDate: Date | null
	}) => {
		setDate(newDate)
	}

	const handleStatusChange = (status: string) => {
		if (selectedStatuses.includes(status)) {
			setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
		} else {
			setSelectedStatuses([...selectedStatuses, status])
		}
	}

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
			{/* <FilterDate /> */}
			<DatePicker date={date} onChange={handleDateChange} />
			{/* Filter Status */}
			<PopoverRoot isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
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

export { FiltersProject }
