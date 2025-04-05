import {
	add,
	endOfMonth,
	endOfWeek,
	isBefore,
	isWithinInterval,
	startOfMonth,
	startOfWeek,
	sub,
} from 'date-fns'
import { useEffect, useState } from 'react'

export interface CalendarProps {
	value: Date | { startDate: Date | null; endDate: Date | null } | null
	onChange: (
		date: Date | { startDate: Date | null; endDate: Date | null },
	) => void
	range?: boolean
}

const useCalendar = ({ value, onChange, range }: CalendarProps) => {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [endDate, setEndDate] = useState<Date | null>(null)

	useEffect(() => {
		if (range && value && 'startDate' in value && 'endDate' in value) {
			setStartDate(value.startDate as Date)
			setEndDate(value.endDate)
		}
	}, [value, range])

	const nextMonth = () => setCurrentDate(add(currentDate, { months: 1 }))
	const prevMonth = () => setCurrentDate(sub(currentDate, { months: 1 }))

	const startOfCurrentMonth = startOfMonth(currentDate)
	const endOfCurrentMonth = endOfMonth(currentDate)

	const startDateOfMonth = startOfWeek(startOfCurrentMonth, {
		weekStartsOn: 0,
	})
	const endDateOfMonth = endOfWeek(endOfCurrentMonth, { weekStartsOn: 0 })

	const dates: Date[] = []
	let day = startDateOfMonth

	while (day <= endDateOfMonth) {
		dates.push(day)
		day = add(day, { days: 1 })
	}

	const handleSelectDate = (date: Date) => {
		if (range) {
			if (!startDate || (startDate && endDate)) {
				// Se não há startDate ou o intervalo já foi completo, apenas define o startDate
				setStartDate(date)
				setEndDate(null) // Reseta o endDate para começar um novo intervalo
				onChange({ startDate: date, endDate: null }) // Passa startDate com endDate como null
			} else if (startDate && !endDate) {
				// Se existe startDate mas não endDate
				if (isBefore(date, startDate)) {
					// Se a data selecionada é antes do startDate, inverte as datas
					setStartDate(date)
					setEndDate(startDate)
					onChange({ startDate: date, endDate: startDate })
				} else {
					// Caso contrário, define a data como endDate
					setEndDate(date)
					onChange({ startDate, endDate: date })
				}
			}
		} else {
			// Caso não seja intervalo, apenas seleciona a data
			setStartDate(null) // Reseta os valores de range para evitar interferência
			setEndDate(null)
			setSelectedDate(date)
			onChange(date)
		}
	}

	const isWithinSelectedRange = (date: Date) =>
		startDate && endDate
			? isWithinInterval(date, { start: startDate, end: endDate })
			: false

	return {
		currentDate,
		nextMonth,
		prevMonth,
		dates,
		selectedDate,
		startDate,
		endDate,
		handleSelectDate,
		isWithinSelectedRange,
	}
}

export { useCalendar }
