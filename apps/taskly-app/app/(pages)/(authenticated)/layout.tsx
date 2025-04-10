import AuthProvider from '@/providers/auth'
import { AppSidebar } from '@/components/global/SideBarApp'
import { Header } from '@/components/global/header/Header'

export default function PagesLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<AuthProvider>
			<div className='flex h-screen w-screen flex-row overflow-hidden'>
				<AppSidebar />
				<div className='flex flex-1 flex-col'>
					<Header />
					<main className='custom-scrollbar min-h-0 flex-1 overflow-auto p-4'>
						{children}
					</main>
				</div>
			</div>
		</AuthProvider>
	)
}
