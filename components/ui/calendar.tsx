// @/components/ui/calendar.tsx
'use client';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'; // Usando lucide-react para ícones
import { Button } from '@/components/ui/button'; // Importe seu Button aqui
import { type UseCalendarProps, useCalendar } from '@/hooks/useCalendar';
import { twMerge } from 'tailwind-merge'; // Para combinar classes Tailwind
import { v4 as uuidv4 } from 'uuid'; // Para chaves únicas em listas

// Extende as props do useCalendar para serem as props do Calendar
interface CalendarComponentProps<TMode extends 'single' | 'range'> extends UseCalendarProps<TMode> {
	className?: string; // Prop para classes CSS adicionais no container
}

const Calendar = <TMode extends 'single' | 'range'>({
	value,
	onChange,
	mode,
	className,
}: CalendarComponentProps<TMode>) => {
	const {
		nextMonth,
		prevMonth,
		currentDate,
		dates,
		selectedSingleDate,
		selectedRangeDates,
		handleSelectDate,
		isWithinSelectedRange,
	} = useCalendar({ value, onChange, mode });

	const { startDate, endDate } = selectedRangeDates;

	return (
		<div
			className={twMerge(
				'flex w-64 max-w-64 flex-col items-center justify-center rounded-2xl border border-border p-4 shadow-sm bg-background',
				className // Aplica classes adicionais passadas
			)}
		>
			<div className='mb-2 flex w-full items-center gap-2'>
				<div className='flex w-full items-center justify-between gap-8 rounded-xl border border-border p-1'>
					<Button
						aria-label='Mês anterior'
						variant='ghost'
						size='icon'
						onClick={prevMonth}
					>
						<LuChevronLeft className='h-4 w-4' />
					</Button>
					<span className='capitalize text-xs text-muted-foreground'>
						{format(currentDate, 'MMMM yyyy', { locale: ptBR })} {/* Corrigido 'MMMMÐ' para 'MMMM yyyy' */}
					</span>
					<Button
						aria-label='Próximo mês'
						variant='ghost'
						size='icon'
						onClick={nextMonth}
					>
						<LuChevronRight className='h-4 w-4' />
					</Button>
				</div>
			</div>
			<table className='p-1'>
				<thead className='mb-2'>
					<tr className='flex'>
						{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((dayName) => (
							<td
								key={dayName}
								className='flex w-full items-center justify-center px-1 py-1.5'
							>
								<p className='text-sm font-normal text-muted-foreground'>
									{dayName}
								</p>
							</td>
						))}
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: Math.ceil(dates.length / 7) }).map((_, weekIndex) => (
						<tr key={uuidv4()} className='grid grid-cols-7'>
							{dates.slice(weekIndex * 7, weekIndex * 7 + 7).map((date) => {
								const isCurrentMonth = date.getMonth() === currentDate.getMonth();
								const isToday = isSameDay(date, new Date());

								// Lógica de seleção baseada no modo
								let isSelected = false;
								let isInRange = false;
								let isStart = false;
								let isEnd = false;

								if (mode === 'single') {
									isSelected = selectedSingleDate ? isSameDay(date, selectedSingleDate) : false;
								} else { // mode === 'range'
									isStart = startDate ? isSameDay(date, startDate) : false;
									isEnd = endDate ? isSameDay(date, endDate) : false;
									isInRange = isWithinSelectedRange(date);
									isSelected = isStart || isEnd; // Para range, o início e fim são "selecionados"
								}

								return (
									<td
										key={uuidv4()}
										className='flex h-8 w-8 items-center justify-center'
									>
										<button // Usar <button> para acessibilidade e clique
											type='button' // Importante para não submeter formulários
											onClick={() => handleSelectDate(date)}
											className={twMerge(
												`flex h-full w-full cursor-pointer
                         items-center justify-center rounded-md p-4 text-sm font-normal transition-all duration-200
                         ${isCurrentMonth ? '' : 'opacity-30'}
                         ${isToday ? 'bg-accent text-accent-foreground' : ''}
                         ${isSelected && mode === 'single' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
                         ${(isStart || isEnd) && mode === 'range' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
                         ${isInRange && mode === 'range' && !isStart && !isEnd ? 'bg-accent text-accent-foreground hover:bg-accent-hover' : ''}
                         ${!isSelected && !isInRange && !isToday ? 'hover:bg-accent-hover' : ''}
                         `
											)}
										>
											{date.getDate()}
										</button>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export { Calendar };