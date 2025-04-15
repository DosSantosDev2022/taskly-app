'use client'
import { useState } from 'react'
import { FaBell } from 'react-icons/fa'
import { BsChatTextFill } from 'react-icons/bs'
import { PopoverContent, PopoverRoot, PopoverTrigger } from '../popover'
import { NotificationMessage } from '../notifications/notificationMessages'
import { useSession } from 'next-auth/react'
import {
	NotificationMessageSkeleton,
	AlertNotificationSkeleton,
} from '../skeletons'
import { AlertNotification } from '../notifications/alertNotifications'

const NotificationsApp = () => {
	const { data: session, status } = useSession()
	const [openPopover, setOpenPopover] = useState<
		'messages' | 'notifications' | null
	>(null)

	const handleToggle = (popover: 'messages' | 'notifications') => {
		setOpenPopover((prev) => (prev === popover ? null : popover))
	}

	return (
		<div className='flex items-center space-x-2 text-muted-foreground'>
			<PopoverRoot
				isOpen={openPopover === 'messages'}
				onToggle={() => handleToggle('messages')}
			>
				<PopoverTrigger sizes='icon' variants='ghost'>
					<BsChatTextFill size={20} />
				</PopoverTrigger>
				<PopoverContent className='' alignment='bottom'>
					<div className='p-2 w-full flex items-center gap-1 mb-3'>
						<FaBell className='text-muted-foreground' />
						<span className='text-base font-medium text-muted-foreground'>
							Mensagens recebidas !
						</span>
					</div>
					<div className='space-y-2 max-h-80 overflow-y-auto'>
						<NotificationMessageSkeleton />
						<NotificationMessage
							id=''
							img={session?.user.image as string}
							fallback='js'
							title='Titulo da mensagem'
							content='Conteúdo resumido  da mensagem da mensagem da mensagem da mensagem da mensagem '
						/>
					</div>
				</PopoverContent>
			</PopoverRoot>

			<PopoverRoot
				isOpen={openPopover === 'notifications'}
				onToggle={() => handleToggle('notifications')}
			>
				<PopoverTrigger sizes='icon' variants='ghost'>
					<FaBell size={20} />
				</PopoverTrigger>
				<PopoverContent alignment='bottom'>
					<div className='p-2 w-full flex items-center gap-1 mb-3'>
						<FaBell className='text-muted-foreground' />
						<span className='text-base font-medium text-muted-foreground'>
							Notificações recebidas !
						</span>
					</div>
					<div className='space-y-2 max-h-80 overflow-y-auto'>
						<AlertNotificationSkeleton />
						<AlertNotification
							id=''
							title='Você recebeu um novo projeto !'
							content='O usuário jhon doe acabou de compartilhar um novo projeto com você,talvez você precise de ajuda'
							onClose={() => alert('fechado !')}
							time='hoje ás 12:30'
						/>
					</div>
				</PopoverContent>
			</PopoverRoot>
		</div>
	)
}

export { NotificationsApp }
