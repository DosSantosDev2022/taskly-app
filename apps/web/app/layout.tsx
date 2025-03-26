import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './styles/globals.css'

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700', '800'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Taskly App',
	description: 'Gerenncie seus projetos de forma colaborativa',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='pt-BR'>
			<body className={`${poppins}`}>{children}</body>
		</html>
	)
}
