import { UserAvatar } from "@/components/global";
import { Input } from "@/components/ui";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";

const Header = () => {
	return (
		<header className="sticky top-0 w-full z-50 border-b bg-background/95 backdrop-blur-sm">
			<div className="flex h-16 items-center border justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex-shrink-0">
					<SidebarTrigger />
				</div>

				<div className="flex flex-1 items-center justify-end gap-4 min-w-0">
					<div className="relative flex-grow flex-shrink max-w-xs ">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Buscar..."
							className="w-full pl-10"
						/>
					</div>
					<div className="flex-shrink-0">
						<UserAvatar />
					</div>
				</div>
			</div>
		</header>
	);
};

export { Header };
