"use client";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { User, File, CircleDollarSign, Clipboard } from "lucide-react";
import { NavLinks } from "./navLinks";

const data = {
	links: [
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
