import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar'

interface NotificationMessageProps {
	id: string
	img: string
	fallback: string
	title: string
	content: string
}

const NotificationMessage = ({
	id,
	img,
	fallback,
	title,
	content,
}: NotificationMessageProps) => {
	return (
		<div className='cursor-pointer hover:bg-accent-hover/40 duration-300 transition-colors flex items-center space-x-3 w-full h-16 rounded-2xl bg-accent/30 p-2'>
			<Avatar key={id}>
				<AvatarImage src={img} />
				<AvatarFallback>{fallback}</AvatarFallback>
			</Avatar>

			<div className='flex flex-col space-y-1 w-full'>
				<div className='flex items-center justify-between w-full p-0.5'>
					<h2 className='text-sm font-semibold'>{title} </h2>
					<span className='text-xs text-muted-foreground'>12:01pm</span>
				</div>
				<p className='text-xs max-w-64 p-0.5 text-muted-foreground truncate whitespace-nowrap overflow-hidden'>
					{content}{' '}
				</p>
			</div>
		</div>
	)
}

export { NotificationMessage }
