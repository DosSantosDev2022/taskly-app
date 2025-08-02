import { AppSidebar, Header } from "@/components/global";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { QueryProvider } from "@/providers";
import type { Metadata } from "next";
import "../../../styles/globals.css";

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
