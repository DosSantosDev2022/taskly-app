'use client'
import { format, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { type CalendarProps, useCalendar } from '../../hooks/useCalendar'
import { v4 as uuidv4 } from 'uuid'

const Calendar = ({ value, onChange, range }: CalendarProps) => {
	const {
		nextMonth,
		prevMonth,
		currentDate,
		dates,
		selectedDate,
		startDate,
		endDate,
		handleSelectDate,
		isWithinSelectedRange,
	} = useCalendar({ value, onChange, range })

	return (
		<div className='flex w-64 max-w-64 flex-col items-center justify-center rounded-2xl border border-border p-4 shadow-sm bg-background'>
			<div className='mb-2 flex w-full items-center gap-2'>
				<div className='flex w-full items-center justify-between gap-8 rounded-xl  border border-border p-1'>
					<Button
						aria-label='chevron-left'
						variants='ghost'
						sizes='icon'
						onClick={prevMonth}
					>
						<ChevronLeft />
					</Button>
					<span className='capitalize text-xs text-muted-foreground'>
						{format(currentDate, 'MMMM yyyy', { locale: ptBR })}
					</span>
					<Button
						aria-label='chevron-right'
						variants='ghost'
						sizes='icon'
						onClick={nextMonth}
					>
						<ChevronRight />
					</Button>
				</div>
			</div>
			<table className='p-1'>
				<thead className='mb-2'>
					<tr className='flex'>
						{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(
							(dayName) => (
								<td
									key={dayName}
									className='flex w-full items-center justify-center px-1 py-1.5'
								>
									<p className='text-sm font-normal text-muted-foreground'>
										{dayName}
									</p>
								</td>
							),
						)}
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: Math.ceil(dates.length / 7) }).map(
						(_, weekIndex) => (
							<tr key={uuidv4()} className='grid grid-cols-7'>
								{dates
									.slice(weekIndex * 7, weekIndex * 7 + 7)
									.map((date) => {
										const isCurrentMonth =
											date.getMonth() === currentDate.getMonth()
										const isSelected =
											!range &&
											selectedDate &&
											isSameDay(date, selectedDate)
										const isToday = isSameDay(date, new Date())
										const isInRange =
											range && startDate && endDate
												? isWithinSelectedRange(date)
												: false
										const isStart = startDate && isSameDay(date, startDate)
										const isEnd = endDate && isSameDay(date, endDate)

										return (
											<td
												key={uuidv4()}
												className=' flex h-8 w-8 items-center justify-center'
											>
												<p
													onClick={() => handleSelectDate(date)}
													onKeyUp={(e) => {
														if (e.key === 'Enter' || e.key === ' ') {
															handleSelectDate(date)
														}
													}}
													className={`flex h-full w-full cursor-pointer 
                            items-center justify-center rounded-md p-4 text-sm font-normal transition-all duration-200 hover:bg-accent-hover
                            ${isCurrentMonth ? '' : 'opacity-30'} 
                            ${
															isToday
																? 'bg-accent text-accent-foreground'
																: isSelected
																	? 'bg-accent text-accent-foreground'
																	: isStart || isEnd
																		? 'bg-primary text-primary-foreground'
																		: isInRange
																			? 'bg-accent text-accent-foreground hover:bg-accent-hover'
																			: ''
														}`}
												>
													{date.getDate()}
												</p>
											</td>
										)
									})}
							</tr>
						),
					)}
				</tbody>
			</table>
		</div>
	)
}

export { Calendar }
