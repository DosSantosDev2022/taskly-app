import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../styles/globals.css";
import { Header } from "@/components/global";

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
				className={`${poppins.className} bg-background text-foreground dark antialiased`}
			>
				<Header />
				{children}
			</body>
		</html>
	);
}
