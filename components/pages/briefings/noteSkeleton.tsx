const NoteSkeleton = () => {
	return (
		<div className='bg-primary/10 p-3 rounded-md border border-border text-sm shadow-xs animate-pulse'>
			<div className='h-4 bg-gray-300 rounded w-3/4 mb-2' />
			<div className='h-4 bg-gray-300 rounded w-2/3 mb-2' />
			<div className='h-4 bg-gray-300 rounded w-1/2' />

			<div className='h-3 bg-gray-300 rounded w-1/4 mt-3' />
		</div>
	)
}

export { NoteSkeleton }
