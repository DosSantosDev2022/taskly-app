'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, parse } from 'date-fns'

type DateRange = {
	startDate: Date | null
	endDate: Date | null
}

export const DATE_FORMAT = 'yyyy-MM-dd'

export function useHandleDateChange(searchParamsString: string) {
	const router = useRouter()

	const [date, setDate] = useState<DateRange>({
		startDate: null,
		endDate: null,
	})

	const handleDateChange = (newDate: DateRange) => {
		setDate(newDate)
		const params = new URLSearchParams(searchParamsString)

    if (newDate.startDate) {
      // Formatar para o formato ISO 8601
      params.set('start', format(newDate.startDate, DATE_FORMAT))
    } else {
      params.delete('start')
    }

		if (newDate.endDate) {
      // Formatar para o formato ISO 8601
      params.set('end', format(newDate.endDate, DATE_FORMAT))
    } else {
      params.delete('end')
    }

		router.push(`?${params.toString()}`)
	}

	const clearDateFilters = () => {
		setDate({ startDate: null, endDate: null })
		const params = new URLSearchParams(searchParamsString)
		params.delete('start')
		params.delete('end')
		router.push(`?${params.toString()}`)
	}

	useEffect(() => {
		const params = new URLSearchParams(searchParamsString)
		const startParam = params.get('start')
		const endParam = params.get('end')

		const parsedStart = startParam
      ? parse(startParam, DATE_FORMAT, new Date())
      : null
    const parsedEnd = endParam
      ? parse(endParam, DATE_FORMAT, new Date())
      : null

		setDate({
			startDate: parsedStart,
			endDate: parsedEnd,
		})
	}, [searchParamsString])

	return {
		date,
		handleDateChange,
		clearDateFilters,
		setDate,
	}
}
