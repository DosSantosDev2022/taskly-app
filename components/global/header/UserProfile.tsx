'use client'
import { v4 as uuidv4 } from 'uuid'
import { signOut, useSession } from 'next-auth/react'
import {
	Avatar,
	AvatarContainer,
	AvatarFallback,
	AvatarImage,
	AvatarLabel,
	AvatarName,
	AvatarWrapper,
} from '@/components/ui/avatar'
import {
	DropDownContent,
	DropDownIcon,
	DropDownItem,
	DropDownLabel,
	DropDownList,
	DropDownRoot,
	DropDownTrigger,
} from '@/components/ui/dropdown'
import { IoLogOut } from 'react-icons/io5'
import Link from 'next/link'
import { ThemeToggle } from '../themeToggle'
import { FaUser } from 'react-icons/fa'
import { FaFileCircleQuestion, FaGear } from 'react-icons/fa6'
import { BsChatTextFill } from 'react-icons/bs'
import { IoMdHelpCircle } from 'react-icons/io'
import { UserProfileSkeleton } from '../skeletons/userProfileSkeleton'

const UserProfile = () => {
	const { data: session, status } = useSession()
	if (status === 'loading') return <UserProfileSkeleton />
	if (!session?.user) return null

	const user = session.user
	console.log(user)
	const list = [
		{
			id: uuidv4(),
			icon: <FaUser size={20} />,
			label: 'Minha conta',
			url: '/my-account',
		},
		{
			id: uuidv4(),
			icon: <FaGear size={20} />,
			label: 'Configurações',
			url: '/my-config',
		},
		{
			id: uuidv4(),
			icon: <BsChatTextFill size={20} />,
			label: 'Notificações',
			url: '/notifications',
		},
		{
			id: uuidv4(),
			icon: <IoMdHelpCircle size={20} />,
			label: 'Guia  de ajuda',
			url: '/help-guide',
		},
		{
			id: uuidv4(),
			icon: <FaFileCircleQuestion size={20} />,
			label: 'Central de ajuda',
			url: '/help-center',
		},
	]

	const OnSignOutButton = () => {
		signOut({ callbackUrl: '/signIn' }) // redireciona para home
	}

	return (
		<AvatarContainer>
			<DropDownRoot>
				<DropDownTrigger>
					<Avatar>
						<AvatarImage
							src={user.image ?? ''}
							alt={user.name ?? 'Avatar'}
						/>
						<AvatarFallback>
							{user?.name ? user.name.charAt(0).toUpperCase() : '?'}
						</AvatarFallback>
					</Avatar>
				</DropDownTrigger>
				<DropDownContent position='absolute'>
					{/* <DropDownLabel>Minha conta</DropDownLabel> */}
					<DropDownList>
						{list.map((item) => (
							<Link href={item.url} key={item.id}>
								<DropDownItem>
									<DropDownIcon>{item.icon}</DropDownIcon>
									{item.label}
								</DropDownItem>
							</Link>
						))}
						<div className='bg-foreground/10 w-full h-[1px]' />
						<ThemeToggle />
						<div className='bg-foreground/10 w-full h-[1px]' />
						<DropDownItem
							className='text-danger'
							onClick={OnSignOutButton}
						>
							<DropDownIcon>
								<IoLogOut size={24} className='text-danger' />
							</DropDownIcon>
							Sair
						</DropDownItem>
					</DropDownList>
				</DropDownContent>
			</DropDownRoot>
			<AvatarWrapper>
				<AvatarName>{user.name}</AvatarName>
				<AvatarLabel>{user.surname}</AvatarLabel>
			</AvatarWrapper>
		</AvatarContainer>
	)
}

export { UserProfile }
