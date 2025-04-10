const AlertNotificationSkeleton = () => {
	return (
		<div className='animate-pulse flex items-center space-x-3 w-full min-h-16 rounded-2xl bg-accent/30 p-2'>
			{/* Ícone opcional */}
			<div className='flex flex-col space-y-1 w-full'>
				<div className='flex items-center justify-between w-full p-0.5'>
					<div className='h-4 bg-muted rounded w-2/3' />
					<div className='h-8 w-8 rounded-full bg-muted' />
				</div>
				<div className='flex flex-col gap-1'>
					<div className='h-3 bg-muted rounded w-full' />
					<div className='h-3 bg-muted rounded w-4/5' />
					<div className='h-3 bg-muted rounded w-1/2' />
					<div className='h-3 bg-muted rounded w-24' />
				</div>
			</div>
		</div>
	)
}

export { AlertNotificationSkeleton }
