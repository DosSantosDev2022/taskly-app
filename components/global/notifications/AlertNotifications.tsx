import { Button } from '@/components/ui'
import { LuX } from 'react-icons/lu'
import { IoTimeSharp } from 'react-icons/io5'

interface NotificationMessageProps {
	id: string
	title: string
	content: string
	onClose: () => void
	time: string
}

const AlertNotification = ({
	id,
	title,
	content,
	onClose,
	time,
}: NotificationMessageProps) => {
	return (
		<div
			key={id}
			className='flex items-center space-x-3 w-full min-h-16 rounded-2xl bg-accent/30 p-2'
		>
			{/* Talvez colocar algum icone aqui */}

			<div className='flex flex-col space-y-1 w-full'>
				<div className='flex items-center justify-between w-full p-0.5'>
					<h2 className='text-sm font-semibold'>{title} </h2>
					<div className='flex space-x-1.5'>
						<Button
							onClick={onClose}
							className='rounded-full'
							variants='secondary'
							sizes='icon'
						>
							<LuX size={16} />
						</Button>
					</div>
				</div>
				<div className='flex flex-col gap-1'>
					<p className='text-xs p-0.5 text-muted-foreground line-clamp-3'>
						{content}
					</p>
					<div className='flex w-full items-center space-x-1'>
						<IoTimeSharp size={14} className='text-muted-foreground/80' />
						<span className='text-xs text-muted-foreground'>{time}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export { AlertNotification }
