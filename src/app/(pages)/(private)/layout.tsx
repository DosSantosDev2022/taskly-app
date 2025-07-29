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
					<AppSidebar />
					<SidebarInset>
						<Header />
						<main className="flex-1 overflow-y-auto">{children}</main>
					</SidebarInset>
				</QueryProvider>
			</SidebarProvider>
		</div>
	);
}
