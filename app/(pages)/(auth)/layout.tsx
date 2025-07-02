import type { ReactNode } from 'react'

export default function LoginLayout({
	children,
}: { children: ReactNode }) {
	return (
		<div className='h-screen flex'>
			<div className='grid grid-cols-12 p-4  w-full'>
				<div className='flex  flex-col items-center justify-center space-y-3.5 col-span-4 md:col-span-6 p-6 md:p-12 bg-linear-to-r from-primary-hover to-primary rounded-l-3xl'>
					<div className='flex items-center w-full flex-col space-y-4'>
						<h1 className='lg:text-9xl md:text-7xl text-6xl font-bold text-primary-foreground'>
							Taskly
						</h1>
						<span className='text-muted lg:text-xl text-base text-center'>
							Gerencie seus projetos de forma colaborativa.
						</span>
					</div>

					<div className='p-2 flex  items-center justify-center flex-col w-full text-primary-foreground'>
						<h2 className='font-bold lg:text-4xl text-2xl'>
							Bem vindo de volta !
						</h2>
						<span className='text-sm text-muted'>
							Acesse a sua conta agora mesmo !
						</span>
					</div>
				</div>
				<div className='col-span-8 md:col-span-6 flex items-center justify-center w-full'>
					{children}
				</div>
			</div>
		</div>
	)
}
