"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = ({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) => {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Navegação</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					// Determine se o item atual é ativo
					const isActive =
						pathname === item.url ||
						item.items?.some((subItem) => pathname.startsWith(subItem.url));

					// --- Condição para Links com Sub-itens (Collapsible) ---
					if (item.items && item.items.length > 0) {
						return (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={isActive} // Abre o collapsible se qualquer sub-item for ativo
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton
											tooltip={item.title}
											className={
												isActive ? "bg-accent text-accent-foreground" : ""
											}
										>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items.map((subItem) => (
												<SidebarMenuSubItem className="p-1" key={subItem.title}>
													<SidebarMenuSubButton asChild>
														<Link href={subItem.url}>
															<span>{subItem.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						);
					} else {
						// --- Condição para Links Diretos (Sem Collapsible) ---
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									className={isActive ? "bg-accent text-accent-foreground" : ""}
								>
									<Link href={item.url}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					}
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
};

export { NavLinks };
