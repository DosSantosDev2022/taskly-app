'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './button'
import { format } from 'date-fns'
import { Calendar } from './calendar'
import { ptBR } from 'date-fns/locale'
import { FaCalendar } from 'react-icons/fa'
import { twMerge } from 'tailwind-merge'

const DatePicker = ({
	date,
	onChange,
	range,
	sizes,
	className,
	variants,
}: {
	date: { startDate: Date | null; endDate: Date | null }
	onChange: (newDate: {
		startDate: Date | null
		endDate: Date | null
	}) => void
	range?: boolean
	sizes?: 'xs' | 'sm' | 'lg' | 'icon' | 'full'
	variants?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent'
	className?: string
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [position, setPosition] = useState<'top' | 'bottom'>('bottom')
	const buttonRef = useRef<HTMLButtonElement | null>(null)
	const calendarRef = useRef<HTMLDivElement | null>(null)

	const openCalendar = () => {
		setIsOpen(!isOpen)
	}

	// Função para alterar a posição do calendário (top ou bottom)
	const updateCalendarPosition = () => {
		if (!buttonRef.current || !calendarRef.current) return

		const buttonRect = buttonRef.current.getBoundingClientRect()
		const calendarRect = calendarRef.current.getBoundingClientRect()
		const spaceBelow = window.innerHeight - buttonRect.bottom
		const spaceAbove = buttonRect.top

		// Ajusta a posição dependendo do espaço disponível
		if (spaceBelow > calendarRect.height) {
			setPosition('bottom') // Espaço suficiente abaixo
		} else if (spaceAbove > calendarRect.height) {
			setPosition('top') // Espaço suficiente acima
		} else {
			setPosition('bottom') // Padrão para baixo se não houver espaço
		}
	}

	// Atualiza a posição sempre que o calendário for aberto ou o botão for reposicionado
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (isOpen) {
			updateCalendarPosition()
		}
	}, [isOpen])

	// Função de callback do calendário
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
			<Button
				type='button'
				sizes={sizes}
				className={twMerge('h-8', className)}
				onClick={openCalendar}
				variants={variants}
				ref={buttonRef} // Ref para o botão
			>
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
				<div
					ref={calendarRef} // Ref para o calendário
					className={twMerge(
						'absolute mt-1 right-0 z-50',
						position === 'bottom' ? 'top-[100%]' : 'bottom-[100%]',
					)}
				>
					<Calendar onChange={handleChange} value={date} range={range} />
				</div>
			)}
		</div>
	)
}

export { DatePicker }
