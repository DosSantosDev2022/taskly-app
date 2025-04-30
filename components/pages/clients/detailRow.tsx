// components/DetailRow.tsx
type DetailRowProps = {
	label: string
	value: React.ReactNode
}

const DetailRow = ({ label, value }: DetailRowProps) => (
	<div>
		<strong className='font-bold'>{label}</strong>{' '}
		<span className='text-foreground'>{value}</span>
	</div>
)

export { DetailRow }
