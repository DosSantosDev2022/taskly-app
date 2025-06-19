import {
	SideBar,
	SideBarContent,
	SideBarDropGroup,
	SideBarDropItem,
	SideBarDropList,
	SideBarDropRoot,
	SideBarDropTrigger,
	SideBarHeader,
	SideBarItem,
	SideBarList,
	SideBarLogo,
	SideBarNavigation,
	SideBarRoot,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid'
import { MdSpaceDashboard } from 'react-icons/md'
import { FaUser, FaFolderOpen, FaMoneyBill } from 'react-icons/fa'
import { GrTasks } from 'react-icons/gr'
import { SiGoogledocs } from 'react-icons/si'

const AppSidebar = () => {
	const links = [
		{
			id: uuidv4(),
			url: '/dashboard',
			label: 'Dashboard',
			icon: <MdSpaceDashboard size={20} />,
		},
		{
			id: uuidv4(),
			url: '/clients',
			label: 'Clientes',
			icon: <FaUser size={20} />,
		},
		{
			id: uuidv4(),
			url: '/projects',
			label: 'Projetos',
			icon: <FaFolderOpen size={20} />,
		},
		{
			id: uuidv4(),
			url: '/tasks',
			label: 'Tarefas',
			icon: <GrTasks size={20} />,
		},
		{
			id: uuidv4(),
			url: '/finances',
			label: 'Finanças',
			icon: <FaMoneyBill size={20} />,
		},
		{
			id: uuidv4(),
			url: '/briefings',
			label: 'Briefings',
			icon: <SiGoogledocs size={20} />,
		},
	]

	return (
		<SideBarRoot>
			<SideBar>
				<SideBarHeader trigger>
					<SideBarLogo label='Taskly' /* icon={<Logo />} */ />
				</SideBarHeader>
				<SideBarContent>
					<SideBarNavigation>
						{/* Navegação de links normais  */}
						<SideBarList>
							{links.map((link) => (
								<Link key={link.id} href={link.url}>
									<SideBarItem tooltip={link.label} icon={link.icon}>
										{link.label}
									</SideBarItem>
								</Link>
							))}
						</SideBarList>

						{/* menu dropdows */}
					</SideBarNavigation>
				</SideBarContent>
			</SideBar>
		</SideBarRoot>
	)
}

export { AppSidebar }
