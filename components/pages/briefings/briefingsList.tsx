'use client'

import { useState, useTransition } from 'react'
import type { BriefingFormValues } from '@/@types/briefingSchema'
import { BriefingDetail } from '@/components/pages/briefings'
import { Button } from '@/components/ui/button'
import { BriefingNotes } from '@/components/pages/briefings'
import { twMerge } from 'tailwind-merge'
import { deleteBriefings } from '@/actions/briefings/briefingsActions'
import { useNotification } from '@/context/notificationContext'
import { MdDelete } from 'react-icons/md'

interface BriefingsListProps {
	briefings: BriefingFormValues[]
}

export function BriefingsList({ briefings }: BriefingsListProps) {
	const [selectedBriefing, setSelectedBriefing] =
		useState<BriefingFormValues | null>(null)

	return (
		<div className='flex flex-1 flex-col lg:flex-row h-full overflow-hidden'>
			{/* Sidebar de Briefings */}
			<aside className='w-full lg:w-72 border-b lg:border-r border-border bg-background p-4 flex flex-col h-full overflow-hidden'>
				<h2 className='text-2xl font-semibold mb-4'>Briefings</h2>
				<div className='flex-1 overflow-y-auto pr-2 scrollbar-custom'>
					{briefings?.length > 0 ? (
						<nav className='space-y-2'>
							{briefings.map((briefing) => (
								<Button
									key={briefing.id}
									variants='ghost'
									className={twMerge(
										'w-full justify-start text-left h-auto py-2 px-3',
										selectedBriefing?.id === briefing.id &&
											'bg-secondary text-secondary-foreground',
									)}
									onClick={() => setSelectedBriefing(briefing)}
								>
									<div className='flex flex-col items-start'>
										<span className='font-medium'>
											{briefing.companyName}
										</span>
									</div>
								</Button>
							))}
						</nav>
					) : (
						<p className='text-sm text-muted-foreground'>
							Nenhum briefing encontrado.
						</p>
					)}
				</div>
			</aside>

			{/* Área de Detalhes do Briefing */}
			<main className='flex-1 p-6 flex flex-col h-full overflow-hidden'>
				{selectedBriefing ? (
					<div className='grid grid-cols-1 lg:grid-cols-6 gap-6 flex-1 overflow-hidden'>
						{/* Detalhes */}
						<div className='lg:col-span-4 flex flex-col h-full overflow-y-auto pr-2 scrollbar-custom'>
							<BriefingDetail briefing={selectedBriefing} />
						</div>

						{/* Notas */}
						<div className='lg:col-span-2 flex flex-col h-full overflow-y-auto pr-2 scrollbar-custom'>
							<BriefingNotes briefingId={selectedBriefing.id || ''} />
						</div>
					</div>
				) : (
					<div className='flex items-center justify-center flex-1 text-muted-foreground'>
						<p>Selecione um briefing na lista para ver os detalhes.</p>
					</div>
				)}
			</main>
		</div>
	)
}
