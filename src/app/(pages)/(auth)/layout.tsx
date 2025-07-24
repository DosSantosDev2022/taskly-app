import type { Metadata } from "next";
import "../../../styles/globals.css";

export const metadata: Metadata = {
	title: "Login - Taskly App",
	description: "",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div>{children}</div>;
}
