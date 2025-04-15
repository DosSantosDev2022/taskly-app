'use client'

import { useState } from 'react'
import {
	PopoverRoot,
	PopoverTrigger,
	PopoverContent,
} from '@/components/global/popover'
import { FaCheck, FaFilter } from 'react-icons/fa'

const FilterStatus = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

	const availabStatuses: string[] = ['Ativo', 'Inativo']

	const handleStatusChange = (status: string) => {
		if (selectedStatuses.includes(status)) {
			setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
		} else {
			setSelectedStatuses([...selectedStatuses, status])
		}
	}

	return (
		<PopoverRoot isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
			<PopoverTrigger sizes='xs' variants='secondary'>
				<FaFilter size={10} />
				Status
			</PopoverTrigger>
			<PopoverContent alignment='bottom' className='p-4 w-56 mt-1'>
				<div>
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
	)
}

export { FilterStatus }
