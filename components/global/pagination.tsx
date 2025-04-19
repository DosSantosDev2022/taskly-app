'use client'
import { v4 as uuidv4 } from 'uuid'
import Link from 'next/link'
import {
	usePagination,
	ELLIPSIS_LEFT,
	ELLIPSIS_RIGTH,
} from '@/hooks/usePagination'
import { useSearchParams } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

type PaginationAppProps = {
	page: number
	limit: number
	total: number
}

export function Pagination({ page, limit, total }: PaginationAppProps) {
	const { pages, isCurrentPage } = usePagination({ page, limit, total })

	const searchParams = useSearchParams()

	const createLink = (newPage: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', newPage.toString())
		return `?${params.toString()}`
	}

	if (pages.length <= 1) return null

	return (
		<nav className='flex gap-1 flex-wrap'>
			{pages.map((item) => {
				if (item === ELLIPSIS_LEFT || item === ELLIPSIS_RIGTH) {
					return (
						<span
							key={uuidv4()}
							className='px-3 py-1 text-muted-foreground'
						>
							{item}
						</span>
					)
				}
				const isActive = isCurrentPage(Number(item))
				return (
					<Link
						key={item}
						href={isActive ? '#' : createLink(Number(item))}
						className={twMerge(
							'px-3 py-1 rounded-lg border border-border text-base',
							' transition-all duration-500 active:scale-75',
							isCurrentPage(Number(item))
								? 'bg-primary text-primary-foreground font-bold pointer-events-none opacity-60'
								: 'hover:bg-muted',
						)}
					>
						{item}
					</Link>
				)
			})}
		</nav>
	)
}
