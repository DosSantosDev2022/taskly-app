import { v4 as uuidv4 } from 'uuid'

interface TableProps {
	headers: string[]
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: Record<string, any>[]
}

const Table = ({ headers, data }: TableProps) => {
	return (
		<div className='w-full overflow-x-auto'>
			<div className='max-h-[412px] scrollbar-custom overflow-y-auto'>
				<table className='w-full border border-border rounded-t-xl shadow-md'>
					<thead className='sticky top-0 bg-secondary z-10'>
						<tr>
							{headers.map((header) => (
								<th
									key={header}
									className='h-12 px-2 border-b border-border text-left text-xs font-medium text-secondary-foreground uppercase tracking-wider'
								>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((row) => (
							<tr
								key={uuidv4()}
								className='border-b border-border hover:bg-muted-hover/40'
							>
								{Object.values(row).map((cell) => (
									<td
										key={uuidv4()}
										className='p-2 text-sm text-muted-foreground font-light align-middle [&:has([role=checkbox])]:pr-0'
									>
										{cell}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export { Table }
