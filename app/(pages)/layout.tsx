import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import '@/styles/globals.css'
import { NotificationProvider } from '@/context/notificationContext'
import { ThemeScript } from '@/utils/themeScript'

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700', '800'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Taskly App',
	description: 'A collaborative task management system',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='pt-BR'>
			<body
				className={`${poppins.className} bg-background text-foreground antialiased overflow-hidden`}
			>
				<NotificationProvider>
					<ThemeScript />
					{children}
				</NotificationProvider>
			</body>
		</html>
	)
}
