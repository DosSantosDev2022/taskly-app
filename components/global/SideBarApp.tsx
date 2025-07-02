'use client' // Necessário para componentes interativos no Next.js

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation' // Para saber qual rota está ativa e destacar o item da sidebar
import { v4 as uuidv4 } from 'uuid'
import { MdSpaceDashboard } from 'react-icons/md'
import { FaUser, FaFolderOpen, FaMoneyBill } from 'react-icons/fa'
import { GrTasks } from 'react-icons/gr'
import { SiGoogledocs } from 'react-icons/si'
import { IoSettingsOutline } from 'react-icons/io5'
import { LuFileSpreadsheet } from 'react-icons/lu'
import { PanelLeftIcon } from 'lucide-react' // Ícone para o SidebarTrigger

// Importe todos os componentes da sua nova biblioteca de sidebar
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar, // Importe o hook useSidebar
} from '@/components/ui/sidebar' // Ajuste o caminho conforme a sua estrutura de pastas

const AppSidebar = () => {
	const pathname = usePathname() // Hook para obter a rota atual
	const { isMobile, toggleSidebar, open } = useSidebar() // Use o hook para acessar o estado da sidebar

	const mainLinks = [
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

	const managementSubLinks = [
		{ id: uuidv4(), url: '/management/users', label: 'Usuários' },
		{ id: uuidv4(), url: '/management/roles', label: 'Cargos' },
		{ id: uuidv4(), url: '/management/permissions', label: 'Permissões' },
	]

	const reportSubLinks = [
		{ id: uuidv4(), url: '/reports/sales', label: 'Vendas' },
		{ id: uuidv4(), url: '/reports/projects-status', label: 'Status de Projetos' },
		{ id: uuidv4(), url: '/reports/finances', label: 'Financeiro' },
	]

	return (

		<Sidebar collapsible="icon"> {/* collapsible="icon" para recolher para apenas ícones */}
			<SidebarHeader className="h-16 flex items-center justify-between px-2">
				{/* Logo/Nome da Aplicação */}
				<div className='flex w-full items-center justify-between'>
					{open && <h1 className="text-2xl font-bold">Taskly</h1>}

					{/* Botão para colapsar/expandir a sidebar (apenas em desktop) */}
					{!isMobile && (
						<SidebarTrigger className="flex-shrink-0" onClick={toggleSidebar}>
							<PanelLeftIcon className="size-4" /> {/* Ícone para o botão de toggle */}
							<span className="sr-only">Toggle Sidebar</span>
						</SidebarTrigger>
					)}
				</div>

				{/* Em mobile, o botão para abrir a sidebar geralmente está no header principal da aplicação, não na própria sidebar. */}
				{/* O SheetContent do Sidebar já tem seu próprio mecanismo de fechamento. */}
			</SidebarHeader>

			<SidebarContent className='p-2'>
				<SidebarMenu>
					{/* Links de navegação principais */}
					{mainLinks.map((link) => (
						<SidebarMenuItem key={link.id}>
							<Link href={link.url} className="w-full">
								<SidebarMenuButton
									isActive={pathname === link.url} // Destaca o link ativo
									tooltip={link.label} // Tooltip aparece quando a sidebar está colapsada
									asChild // Permite que o Button seja renderizado como um link
								>
									<span className="flex items-center gap-2">
										{link.icon}
										<span>{link.label}</span>
									</span>
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>

			<SidebarFooter>
				{/* Rodapé da Sidebar, se necessário */}
				{/* Por exemplo, um link para a documentação ou informações de versão */}
			</SidebarFooter>
		</Sidebar>

	)
}

export { AppSidebar }