import { v4 as uuidv4 } from 'uuid'
import React, { type ReactNode } from 'react'

interface TableProps {
	children: ReactNode
}

const Table = ({ children }: TableProps) => {
	return (
		<div className='w-full overflow-x-auto'>
			<div className='max-h-[412px] scrollbar-custom overflow-y-auto'>
				<table className='w-full border border-border rounded-t-xl shadow-md'>
					{children}
				</table>
			</div>
		</div>
	)
}

interface TableHeaderProps {
	children: ReactNode
}

const TableHeader = ({ children }: TableHeaderProps) => {
	return (
		<thead className='sticky top-0 bg-secondary z-10'>{children}</thead>
	)
}

interface TableBodyProps {
	children: ReactNode
}

const TableBody = ({ children }: TableBodyProps) => {
	return <tbody>{children}</tbody>
}

interface TableRowProps {
	children: ReactNode
	className?: string
}

const TableRow = ({ children, className }: TableRowProps) => {
	return (
		<tr
			key={uuidv4()}
			className={`border-b border-border hover:bg-muted-hover/40 ${className}`}
		>
			{children}
		</tr>
	)
}

interface TableCellProps {
	children: ReactNode
	className?: string
}

const TableCell = ({ children, className }: TableCellProps) => {
	return (
		<td
			key={uuidv4()}
			className={`p-2 text-xs text-muted-foreground font-light align-middle [&:has([role=checkbox])]:pr-0 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] ${className}`}
		>
			{children}
		</td>
	)
}

export { Table, TableHeader, TableBody, TableRow, TableCell }
