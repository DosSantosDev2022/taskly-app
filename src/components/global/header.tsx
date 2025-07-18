// src/components/Header.jsx

import { Search } from "lucide-react";
import {
	Input,
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui";
import { UserAvatar } from "./userAvatar";

export function Header() {
	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-sm">
			<div className="container mx-auto flex items-center justify-between p-4">
				{/* Seção do Logo */}
				<div className="flex items-center">
					<h1 className="text-xl font-bold tracking-tight">Taskly App</h1>
				</div>

				{/* Seção de Navegação */}
				{/* O componente NavigationMenu encapsula a lógica de navegação. */}
				<nav className="hidden md:flex">
					{" "}
					{/* Esconde a navegação em telas pequenas (mobile-first) */}
					<NavigationMenu>
						<NavigationMenuList>
							{/* Item de Navegação: Home */}
							<NavigationMenuItem>
								<NavigationMenuLink
									href="/"
									className={navigationMenuTriggerStyle()}
								>
									Home
								</NavigationMenuLink>
							</NavigationMenuItem>

							{/* Item de Navegação: Projetos */}
							<NavigationMenuItem>
								<NavigationMenuLink
									href="/projects"
									className={navigationMenuTriggerStyle()}
								>
									Projetos
								</NavigationMenuLink>
							</NavigationMenuItem>

							{/* Item de Navegação: Briefings */}
							<NavigationMenuItem>
								<NavigationMenuLink
									href="/briefings"
									className={navigationMenuTriggerStyle()}
								>
									Briefings
								</NavigationMenuLink>
							</NavigationMenuItem>

							{/* Item de Navegação: Configs */}
							<NavigationMenuItem>
								<NavigationMenuLink
									href="/configs"
									className={navigationMenuTriggerStyle()}
								>
									Configurações
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</nav>

				{/* Seção de Busca */}
				<div className="flex items-center gap-4">
					<div className="relative w-full max-w-xs">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Buscar..."
							className="w-full pl-10"
						/>
					</div>
					<UserAvatar />
				</div>
			</div>
		</header>
	);
}
