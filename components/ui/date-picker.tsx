// @/components/ui/datePicker.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './button';
import { format } from 'date-fns';
import { Calendar } from './calendar';
import { ptBR } from 'date-fns/locale';
import { FaCalendar } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { type CalendarMode, type DatePickerValue, type RangeDateValue, type SingleDateValue } from '@/hooks/useCalendar';

interface DatePickerProps<TMode extends CalendarMode> {
	value: DatePickerValue<TMode>;
	onChange: (newValue: DatePickerValue<TMode>) => void;
	mode: TMode;
	className?: string;
	placeholder?: string;
}

const DatePicker = <TMode extends CalendarMode>({
	value,
	onChange,
	mode,
	className,
	placeholder = 'Selecione',
}: DatePickerProps<TMode>) => {
	const [isOpen, setIsOpen] = useState(false);
	const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const calendarWrapperRef = useRef<HTMLDivElement | null>(null);

	const openCalendar = useCallback(() => {
		setIsOpen(prev => !prev);
	}, []);

	// Função para determinar a posição do calendário
	const updateCalendarPosition = useCallback(() => {
		if (!buttonRef.current || !calendarWrapperRef.current) return;

		const buttonRect = buttonRef.current.getBoundingClientRect();
		const calendarRect = calendarWrapperRef.current.getBoundingClientRect();
		const spaceBelow = window.innerHeight - buttonRect.bottom;
		const spaceAbove = buttonRect.top;

		if (spaceBelow > calendarRect.height + 20) { // +20px para margem
			setPosition('bottom');
		} else if (spaceAbove > calendarRect.height + 20) {
			setPosition('top');
		} else {
			setPosition('bottom'); // Padrão se não houver espaço suficiente
		}
	}, []);

	// Hook para atualizar a posição do calendário ao abrir
	useEffect(() => {
		if (isOpen) {
			updateCalendarPosition();
			window.addEventListener('resize', updateCalendarPosition);
		} else {
			window.removeEventListener('resize', updateCalendarPosition);
		}
		return () => window.removeEventListener('resize', updateCalendarPosition);
	}, [isOpen, updateCalendarPosition]);

	// Hook para fechar o calendário ao clicar fora
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
				calendarWrapperRef.current && !calendarWrapperRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);


	const handleCalendarChange = (newValue: DatePickerValue<TMode>) => {
		onChange(newValue);
		if (mode === 'single') {
			setIsOpen(false); // Fecha automaticamente ao selecionar data única
		} else {
			// Para range, decide fechar apenas quando ambos startDate e endDate são selecionados
			const rangeVal = newValue as RangeDateValue;
			if (rangeVal.startDate && rangeVal.endDate) {
				setIsOpen(false);
			}
		}
	};

	const displayValue = () => {
		if (mode === 'range') {
			const rangeValue = value as RangeDateValue;
			if (rangeValue.startDate && rangeValue.endDate) {
				return (
					<>
						<span className='text-xs text-muted-foreground'>
							{format(rangeValue.startDate, 'dd/MM/yyyy', { locale: ptBR })}
						</span>
						<span className='text-muted-foreground mx-1'>-</span>
						<span className='text-xs text-muted-foreground'>
							{format(rangeValue.endDate, 'dd/MM/yyyy', { locale: ptBR })}
						</span>
					</>
				);
			} else if (rangeValue.startDate) {
				return (
					<span className='text-xs text-muted-foreground'>
						{format(rangeValue.startDate, 'dd/MM/yyyy', { locale: ptBR })} - ...
					</span>
				);
			}
		} else { // mode === 'single'
			const singleValue = value as SingleDateValue;
			if (singleValue) {
				return (
					<span className='text-xs text-muted-foreground'>
						{format(singleValue, 'dd/MM/yyyy', { locale: ptBR })}
					</span>
				);
			}
		}
		return (
			<span className='flex items-center gap-1 text-sm text-muted-foreground'>
				<FaCalendar className='w-3 h-3' />
				{placeholder}
			</span>
		);
	};

	return (
		<div className={twMerge('relative', className)}>
			<Button
				type='button'
				className='w-full justify-start' // Alinha o texto à esquerda
				onClick={openCalendar}
				variant='outline'
				ref={buttonRef}
			>
				{displayValue()}
			</Button>

			{isOpen && (
				<div
					ref={calendarWrapperRef}
					className={twMerge(
						'absolute right-0 z-50 mt-2',
						position === 'bottom' ? 'top-[100%]' : 'bottom-[100%]',
						'p-1 rounded-md bg-popover text-popover-foreground shadow-md border border-border'
					)}
				>
					<Calendar
						onChange={handleCalendarChange}
						value={value} // Passa o valor original para o Calendar
						mode={mode} // Passa o modo para o Calendar
					/>
				</div>
			)}
		</div>
	);
};

export { DatePicker };