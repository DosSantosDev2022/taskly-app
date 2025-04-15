'use client'
import { usePagination } from '@/hooks/usePagination'
import { Button } from '../ui'
import { v4 as uuidv4 } from 'uuid'
import { useState } from 'react'

interface PaginationProps {
	currentPage: number
	totalItems: number
	itemsPerPage: number
	onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalItems,
	itemsPerPage,
	onPageChange,
}) => {
	const { isCurrentPage, pages } = usePagination({
		page: currentPage,
		limit: itemsPerPage,
		total: totalItems,
	})

	return (
		<nav aria-label='Pagination' className='flex justify-center'>
			<ul className='flex list-none p-0'>
				{pages.map((page) => (
					<li key={uuidv4()} className='mx-1'>
						{typeof page === 'number' ? (
							<Button
								variants='ghost'
								sizes='icon'
								onClick={() => onPageChange(page)}
								className={`${
									isCurrentPage(page) ? 'bg-primary text-white' : ''
								}`}
							>
								{page}
							</Button>
						) : (
							<span className='px-3 py-1 text-gray-600'>{page}</span>
						)}
					</li>
				))}
			</ul>
		</nav>
	)
}

const PaginationApp = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const totalItems = 100
	const itemsPerPage = 10

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		// Aqui você pode buscar os dados para a nova página
		console.log(`Página alterada para: ${page}`)
	}
	return (
		<Pagination
			currentPage={currentPage}
			itemsPerPage={itemsPerPage}
			onPageChange={handlePageChange}
			totalItems={totalItems}
		/>
	)
}

export { PaginationApp }
