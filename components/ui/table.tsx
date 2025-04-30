import { v4 as uuidv4 } from 'uuid'
import React, { type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const Table = React.forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement>
>(({ ...props }, ref) => (
	<div className='w-full overflow-auto p-1 max-h-[412px] scrollbar-custom overflow-y-auto rounded-t-xl'>
		<table
			{...props}
			ref={ref}
			className='w-full border border-border shadow-md'
		/>
	</div>
))

Table.displayName = 'Table'

const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead
		{...props}
		ref={ref}
		className={twMerge(' bg-secondary z-10 h-12', className)}
	/>
))

TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody
		{...props}
		ref={ref}
		className={twMerge('[&_tr:last-child]:border-0', className)}
	/>
))

TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={twMerge(
			'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
			className,
		)}
		{...props}
	/>
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
	<tr
		ref={ref}
		className={twMerge(
			'border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
			className,
		)}
		{...props}
	/>
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={twMerge(
			'h-12 max-w-36 min-w-full px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
			className,
		)}
		{...props}
	/>
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td
		ref={ref}
		className={twMerge(
			'p-2 text-xs text-muted-foreground font-light overflow-hidden text-ellipsis',
			'whitespace-nowrap max-w-36 w-32 align-middle [&:has([role=checkbox])]:pr-0',
			className,
		)}
		{...props}
	/>
))
TableCell.displayName = 'TableCell'

export {
	Table,
	TableHeader,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
}
