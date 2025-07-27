import type { Metadata } from "next";
import "../../../styles/globals.css";
import { Header } from "@/components/global";
import { QueryProvider } from "@/providers/QueryProvider";

export const metadata: Metadata = {
	title: "Login - Taskly App",
	description: "",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<QueryProvider>
				<Header />
				{children}
			</QueryProvider>
		</div>
	);
}
