import { Footer, Header } from '@/components/pages/home'

export default function HomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className='overflow-y-scroll overflow-x-hidden scrollbar-custom h-screen'>
			<Header />
			{children}
			<Footer />
		</div>
	)
}
