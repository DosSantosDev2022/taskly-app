'use client'

import { DatePicker } from '@/components/ui/datePicker'
import { useState } from 'react'

const FilterDate = () => {
	const [date, setDate] = useState<{
		startDate: Date | null
		endDate: Date | null
	}>({
		startDate: null,
		endDate: null,
	})

	const handleDateChange = (newDate: {
		startDate: Date | null
		endDate: Date | null
	}) => {
		setDate(newDate)
	}
	return <DatePicker date={date} onChange={handleDateChange} />
}

export { FilterDate }
