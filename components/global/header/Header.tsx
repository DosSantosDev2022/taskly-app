import { AlertsAndMessages } from './NotificationsApp'
import { UserProfile } from './UserProfile'


const Header = () => {
	return (
		<header className='col-start-2 row-start-1 flex h-16 w-full items-center justify-end gap-2 border-b border-border px-4 sm:px-8'>
			<div className='p-1 flex items-center space-x-6'>
				<AlertsAndMessages />
				<UserProfile />
			</div>
		</header>
	)
}

export { Header }
