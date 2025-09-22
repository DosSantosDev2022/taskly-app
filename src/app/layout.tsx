import { QueryProvider } from "@/providers";
import AuthProvider from "@/providers/auth-provider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "../styles/globals.css";

const poppins = Poppins({
	weight: ["300", "400", "500", "600", "700", "800"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Taskly App",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${poppins.className} bg-background text-foreground dark scrollbar-custom antialiased`}
			>
				<QueryProvider>
					<AuthProvider>
						{children}
						<ToastContainer />
					</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
