// components/DetailRow.tsx
type DetailRowProps = {
	label: string
	value: React.ReactNode
}

const DetailRow = ({ label, value }: DetailRowProps) => (
	<p>
		<strong className='font-bold'>{label}</strong>{' '}
		<span className='text-foreground'>{value}</span>
	</p>
)

export { DetailRow }
