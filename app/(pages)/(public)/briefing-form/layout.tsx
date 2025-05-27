export default function FormLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <div className='h-screen overflow-y-hidden'>{children}</div>
}
