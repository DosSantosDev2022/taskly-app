"use client";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
	CircleDollarSign,
	Clipboard,
	File,
	Home,
	Settings,
	User,
} from "lucide-react";
import { NavLinks } from "./nav-links";

const data = {
	links: [
		{
			title: "Dashboard", // Ou "Home"
			url: "/dashboard", // URL para a página inicial
			icon: Home, // Ícone para a página inicial
			items: [], // Dashboard/Home geralmente não tem sub-itens
		},
		{
			title: "Projetos",
			url: "#",
			icon: File,
			items: [
				{
					title: "Meus projetos",
					url: "/projects",
				},
			],
		},
		{
			title: "Clientes",
			url: "#",
			icon: User,
			items: [
				{
					title: "Meus clientes",
					url: "/clients",
				},
			],
		},
		{
			title: "Briefings",
			url: "#",
			icon: Clipboard,
			items: [
				{
					title: "Meus briefings",
					url: "/briefings",
				},
				{
					title: "Gerar contratos",
					url: "/contract",
				},
			],
		},
		{
			title: "Financeiro",
			url: "#",
			icon: CircleDollarSign,
			items: [
				{
					title: "Minhas finanças",
					url: "/finance",
				},
			],
		},
		{
			title: "Configurações",
			url: "/configs",
			icon: Settings,
			items: [],
		},
	],
};

const AppSidebar = () => {
	return (
		<Sidebar
			collapsible="icon"
			className={cn(
				"fixed inset-y-0 left-0 z-50 border-r bg-background overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out",
			)}
		>
			<SidebarHeader className="flex-row items-center">
				<div className="flex aspect-square size-8 bg-accent items-center justify-center border rounded-lg">
					<Clipboard />
				</div>
				<div className="grid flex-1 text-left text-sm leading-tight">
					<span className="truncate font-bold text-xl">Taskly app</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<NavLinks items={data.links} />
			</SidebarContent>
			{/* <SidebarFooter /> */}
		</Sidebar>
	);
};
export { AppSidebar };
