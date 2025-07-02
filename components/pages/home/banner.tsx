import { Button } from '@/components/ui'
import { ScrollAnimation } from '@/components/global/scrollAnimation'

const Banner = () => {
	return (
		<ScrollAnimation>
			<div
				className='w-full h-screen md:h-screen flex items-center relative bg-cover bg-center'
				style={{ backgroundImage: `url('/images/banner.jpg')` }}
			>
				<div className='absolute inset-0 bg-black opacity-50' />
				<div className='container mx-auto px-6 md:px-12 relative z-10 flex flex-col md:items-start'>
					<h2 className='text-white font-bold text-3xl sm:text-4xl lg:text-6xl mb-2 md:mb-4 max-w-4xl'>
						Gerencie suas tarefas com facilidade
					</h2>
					<span className='text-muted text-lg sm:text-xl mb-4 md:mb-6'>
						Aumente sua produtividade e organize seu dia a dia.
					</span>
					<Button className='' sizes='sm'>
						Começar agora
					</Button>
				</div>
			</div>
		</ScrollAnimation>
	)
}

export { Banner }
