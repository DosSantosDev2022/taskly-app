import { NotificationsApp } from './notificationsApp'
import { UserProfile } from './userProfile'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui'

const Header = () => {
	return (
		<header className='col-start-2 row-start-1 flex h-16 w-full items-center justify-between gap-2 border-b border-border px-4 sm:px-6'>
			<div className='w-sm'>
				<Input
					className='h-10'
					icon={<Search size={18} />}
					placeholder='Buscar...'
				/>
			</div>
			<div className=' p-1 flex items-center space-x-6'>
				<NotificationsApp />
				<UserProfile />
			</div>
		</header>
	)
}

export { Header }
