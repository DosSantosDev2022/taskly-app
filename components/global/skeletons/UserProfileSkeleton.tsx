const UserProfileSkeleton = () => {
	return (
		<div className='flex items-center gap-3 animate-pulse'>
			<div className='w-10 h-10 rounded-full bg-muted' />
			<div className='flex flex-col gap-1'>
				<div className='w-24 h-4 rounded-md bg-muted' />
				<div className='w-16 h-3 rounded-md bg-muted/70' />
			</div>
		</div>
	)
}

export { UserProfileSkeleton }
