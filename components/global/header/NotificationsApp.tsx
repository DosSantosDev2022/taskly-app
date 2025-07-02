'use client'
import { useState } from 'react'
import { FaBell } from 'react-icons/fa'
import { BsChatTextFill } from 'react-icons/bs'
import { PopoverContent, Popover, PopoverTrigger } from '@/components/ui'
import { AppAlert, MessageNotification } from '@/components/global'
import { useSession } from 'next-auth/react'
import {
	NotificationMessageSkeleton,
	AlertNotificationSkeleton,
} from '../skeletons'

const AlertsAndMessages = () => {
	const { data: session, status } = useSession()
	const [openPopover, setOpenPopover] = useState<
		'messages' | 'notifications' | null
	>(null)

	const handleToggle = (popover: 'messages' | 'notifications') => {
		setOpenPopover((prev) => (prev === popover ? null : popover))
	}

	return (
		<div className='flex items-center space-x-2 text-muted-foreground'>
			<Popover
				open={openPopover === 'messages'}
				onOpenChange={() => handleToggle('messages')}
			>
				<PopoverTrigger className='cursor-pointer' >
					<BsChatTextFill size={20} />
				</PopoverTrigger>
				<PopoverContent className='w-96' align='end' sideOffset={5} collisionPadding={{ right: 16, bottom: 16 }}>
					<div className='p-2 w-full flex items-center gap-1 mb-3'>
						<FaBell className='text-muted-foreground' />
						<span className='text-base font-medium text-muted-foreground'>
							Mensagens recebidas !
						</span>
					</div>
					<div className='space-y-2 max-h-80 overflow-y-auto'>
						<NotificationMessageSkeleton />
						<MessageNotification
							id=''
							img={session?.user.image as string}
							fallback='js'
							title='Titulo da mensagem'
							content='Conteúdo resumido  da mensagem da mensagem da mensagem da mensagem da mensagem '
							time='Time da folha'
						/>
					</div>
				</PopoverContent>
			</Popover>

			<Popover
				open={openPopover === 'notifications'}
				onOpenChange={() => handleToggle('notifications')}
			>
				<PopoverTrigger className='cursor-pointer'>
					<FaBell size={20} />
				</PopoverTrigger>
				<PopoverContent align='end' sideOffset={5} collisionPadding={{ right: 16, bottom: 16 }}>
					<div className='p-2 w-full flex items-center gap-1 mb-3'>
						<FaBell className='text-muted-foreground' />
						<span className='text-base font-medium text-muted-foreground'>
							Notificações recebidas !
						</span>
					</div>
					<div className='space-y-2 max-h-80 overflow-y-auto'>
						<AlertNotificationSkeleton />
						<AppAlert
							id=''
							title='Você recebeu um novo projeto !'
							content='O usuário jhon doe acabou de compartilhar um novo projeto com você,talvez você precise de ajuda'
							onClose={() => alert('fechado !')}
							time='hoje ás 12:30'
						/>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}

export { AlertsAndMessages }
