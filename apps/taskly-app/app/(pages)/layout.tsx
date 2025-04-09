import AuthProvider from '@/providers/auth'

export default function PagesLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<AuthProvider>
			<div className=''>{children}</div>
		</AuthProvider>
	)
}
