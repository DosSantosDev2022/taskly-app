import { format } from 'date-fns'

export const formatDate = (date: Date | string, pattern = 'dd/MM/yyyy') =>
	format(new Date(date), pattern)
