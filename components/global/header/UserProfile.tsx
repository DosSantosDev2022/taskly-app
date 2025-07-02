'use client'
import { v4 as uuidv4 } from 'uuid'
import { signOut, useSession } from 'next-auth/react'
import {

	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator, // Para a linha divisória
	DropdownMenuTrigger,
	DropdownMenuGroup, // Para agrupar itens (opcional, mas boa prática)
} from '@/components/ui' // Importe os componentes do shadcn/ui
import { IoLogOut } from 'react-icons/io5'
import Link from 'next/link'
import { ThemeToggle } from '../themeToggle'
import { FaUser } from 'react-icons/fa'
import { FaFileCircleQuestion, FaGear } from 'react-icons/fa6'
import { BsChatTextFill } from 'react-icons/bs'
import { IoMdHelpCircle } from 'react-icons/io'
import { UserProfileSkeleton } from '../skeletons/userProfileSkeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const UserProfile = () => {
	const { data: session, status } = useSession()
	if (status === 'loading') return <UserProfileSkeleton />
	if (!session?.user) return null

	const user = session.user

	const menuItems = [
		{
			id: uuidv4(),
			icon: <FaUser size={16} />,
			label: 'Minha conta',
			url: '/my-account',
		},
		{
			id: uuidv4(),
			icon: <FaGear size={16} />,
			label: 'Configurações',
			url: '/my-config',
		},
		{
			id: uuidv4(),
			icon: <BsChatTextFill size={16} />,
			label: 'Notificações',
			url: '/notifications',
		},
		{
			id: uuidv4(),
			icon: <IoMdHelpCircle size={16} />,
			label: 'Guia de ajuda',
			url: '/help-guide',
		},
		{
			id: uuidv4(),
			icon: <FaFileCircleQuestion size={16} />,
			label: 'Central de ajuda',
			url: '/help-center',
		},
	]

	const OnSignOutButton = () => {
		signOut({ callbackUrl: '/signIn' }) // redireciona para home
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className='cursor-pointer' asChild>
					<Avatar>
						<AvatarImage src={user.image ?? ''} />
						<AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : '?'}</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='end' sideOffset={5} collisionPadding={{ right: 16, bottom: 16 }}>
					<DropdownMenuLabel>
						{user.name}
						{user.email && <span className='block text-xs text-muted-foreground'>{user.email}</span>}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						{menuItems.map((item) => (

							<DropdownMenuItem key={item.id} asChild className='cursor-pointer'>
								<Link href={item.url} className='flex items-center gap-2 w-full'>
									{item.icon}
									<span>{item.label}</span>
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>

					<DropdownMenuSeparator />
					<DropdownMenuItem className='flex w-full items-center justify-between cursor-default'>
						<ThemeToggle />
					</DropdownMenuItem>
					<DropdownMenuSeparator />

					<DropdownMenuItem
						variant='destructive'
						onClick={OnSignOutButton}
					>
						<IoLogOut size={16} />
						<span>Sair</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}

export { UserProfile }