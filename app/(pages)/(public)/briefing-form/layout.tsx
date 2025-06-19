export default function FormLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className='min-h-screen flex items-center justify-center lg:py-12 py-6 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-4xl w-full space-y-8 lg:p-8 shadow-lg rounded-lg'>
				{children}
			</div>
		</div>
	)
}
