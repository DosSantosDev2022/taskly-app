const NotificationMessageSkeleton = () => {
	return (
		<div className='animate-pulse flex items-center space-x-3 w-full h-16 rounded-2xl bg-accent/30 p-2'>
			<div className='w-10 h-10 rounded-full bg-muted' />

			<div className='flex flex-col space-y-2 w-full'>
				<div className='flex items-center justify-between w-full'>
					<div className='h-4 bg-muted rounded w-2/3' />
					<div className='h-3 bg-muted rounded w-12' />
				</div>
				<div className='h-3 bg-muted rounded w-4/5' />
			</div>
		</div>
	)
}

export { NotificationMessageSkeleton }
