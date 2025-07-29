import type { Metadata } from "next";
import "../../../styles/globals.css";
import { Header } from "@/components/global";
import { QueryProvider } from "@/providers/QueryProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/global/sideBar/appSideBar";

export const metadata: Metadata = {
	title: "Taskly App",
	description: "",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-screen">
			<SidebarProvider>
				<QueryProvider>
					{/* A AppSidebar (que provavelmente é o <Sidebar />) precisa ser renderizada */}
					<AppSidebar />

					{/* O SidebarInset vai encapsular todo o conteúdo que deve se ajustar à Sidebar */}
					<SidebarInset>
						{/* Seu Header: agora ele não precisa mais calcular a largura/posição da sidebar */}
						{/* Ele só precisa ser fixo no topo e ter z-index. A largura total é do SidebarInset. */}
						<Header />

						{/* O main (seu conteúdo principal) ainda precisa de um padding-top */}
						{/* para compensar a altura do Header fixo. */}
						<main className="flex-1 overflow-y-auto">{children}</main>
					</SidebarInset>
				</QueryProvider>
			</SidebarProvider>
		</div>
	);
}
