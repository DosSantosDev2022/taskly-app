import React from 'react'
import { DotSquare } from 'lucide-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

const Pagination = React.forwardRef<
	HTMLElement,
	React.ComponentProps<'nav'>
>(({ className, ...props }, ref) => (
	<nav
		aria-label='pagination'
		className={twMerge(
			'mx-auto flex  w-full justify-center py-2',
			className,
		)}
		{...props}
		ref={ref}
	/>
))

Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
	HTMLUListElement,
	React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
	<ul
		aria-label='pagination-list'
		className={twMerge('flex flex-row items-center gap-1', className)}
		{...props}
		ref={ref}
	/>
))

PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
	<li
		aria-label='pagination-item'
		className={twMerge('flex items-center justify-center', className)}
		{...props}
		ref={ref}
	/>
))

PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
	isActive?: boolean
	radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
} & React.ComponentProps<'button'>

const variantClasses = {
	xs: 'rounded',
	sm: 'rounded-sm',
	md: 'rounded-md',
	lg: 'rounded-lg',
	xl: 'rounded-xl',
	full: 'rounded-full',
}

const PageButton = ({
	className,
	isActive,
	radius = 'lg',
	...props
}: PaginationLinkProps) => {
	return (
		<button
			aria-current={isActive ? 'page' : 'false'}
			className={twMerge(
				variantClasses[radius],
				` flex h-10 w-10 items-center justify-center border border-border p-2 transition-all duration-300 ease-in hover:scale-95
      ${isActive ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'}`,
				className,
			)}
			{...props}
		/>
	)
}

PageButton.displayName = 'PageButton'

const PaginationPrevious = ({
	className,
	...props
}: React.ComponentProps<typeof PageButton>) => (
	<PageButton
		aria-label='go to previous page'
		className={twMerge('cursor-pointer gap-1 pl-2.5', className)}
		{...props}
	>
		<ChevronLeft className='h-4 w-4' />
	</PageButton>
)

PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
	className,
	...props
}: React.ComponentProps<typeof PageButton>) => (
	<PageButton
		aria-label='go to Next page'
		className={twMerge('cursor-pointer gap-1 pr-2.5', className)}
		{...props}
	>
		<ChevronRight className='h-4 w-4' />
	</PageButton>
)

PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
	className,
	...props
}: React.ComponentProps<'span'>) => (
	<span
		aria-label='More pages'
		aria-hidden
		className={twMerge(
			'flex h-9 w-9 items-center justify-center text-foreground',
			className,
		)}
		{...props}
	>
		<DotSquare className='h-4 w-4' />
		<span className='sr-only'>More pages</span>
	</span>
)

PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
	PageButton,
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
}
