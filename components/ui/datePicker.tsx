'use client'
import { useState } from 'react'
import { Button } from './button'
import { format } from 'date-fns'
import { Calendar } from './calendar'
import { ptBR } from 'date-fns/locale'
import { FaCalendar } from 'react-icons/fa'

const DatePicker = ({
	date,
	onChange,
}: {
	date: { startDate: Date | null; endDate: Date | null }
	onChange: (newDate: {
		startDate: Date | null
		endDate: Date | null
	}) => void
}) => {
	const [isOpen, setIsOpen] = useState(false)

	const openCalendar = () => {
		setIsOpen(!isOpen)
	}

	const handleChange = (
		newDate:
			| Date
			| { startDate: Date | null; endDate: Date | null }
			| null,
	) => {
		if (
			newDate &&
			typeof newDate === 'object' &&
			'startDate' in newDate &&
			'endDate' in newDate
		) {
			onChange(newDate)
			setIsOpen(false)
		}
	}

	return (
		<div className='relative'>
			<Button sizes='full' onClick={openCalendar} variants='secondary'>
				{date.startDate && date.endDate ? (
					<>
						<span className='text-xs text-muted-foreground'>
							{format(date.startDate, 'dd/MM/yyyy', { locale: ptBR })}
						</span>
						<span className='text-muted-foreground'>-</span>
						<span className='text-xs text-muted-foreground'>
							{format(date.endDate, 'dd/MM/yyyy', { locale: ptBR })}
						</span>
					</>
				) : (
					<span className='flex items-center gap-1 text-sm'>
						<FaCalendar />
						Selecione
					</span>
				)}
			</Button>

			{isOpen && (
				<div className='absolute top-[100%] mt-1  right-0 z-50'>
					<Calendar onChange={handleChange} value={date} range />
				</div>
			)}
		</div>
	)
}

export { DatePicker }
