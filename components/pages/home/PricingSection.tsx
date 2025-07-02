import { ScrollAnimation } from '@/components/global/scrollAnimation'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { LuCheck } from 'react-icons/lu'

const PricingSection = () => {
	const pricingPlans = [
		{
			id: uuidv4(),
			name: 'Básico',
			price: 'Grátis',
			description: 'Ideal para começar e organizar suas tarefas pessoais.',
			features: [
				'Até 5 projetos',
				'Gerenciamento básico de tarefas',
				'Lista de tarefas',
				'Colaboração limitada (2 usuários)',
			],
			cta: 'Começar Grátis',
			isPopular: false,
		},
		{
			id: uuidv4(),
			name: 'Pro',
			price: 'R$9.99',
			description:
				'Para equipes e usuários que precisam de mais recursos.',
			features: [
				'Projetos ilimitados',
				'Gerenciamento avançado de tarefas',
				'Gráficos de progresso',
				'Colaboração completa (até 10 usuários)',
				'Integrações com outras ferramentas',
			],
			cta: 'Experimentar 14 Dias Grátis',
			isPopular: true,
		},
		{
			id: uuidv4(),
			name: 'Business',
			price: 'R$29.99',
			description: 'Solução completa para empresas de todos os tamanhos.',
			features: [
				'Todos os recursos do Pro',
				'Controles de administrador',
				'Relatórios personalizados',
				'Suporte prioritário',
				'Colaboração para equipes grandes (até 50 usuários)',
			],
			cta: 'Fale Conosco',
			isPopular: false,
		},
	]

	return (
		<ScrollAnimation>
			<div className='bg-background py-16 md:py-24'>
				<div className='container mx-auto px-6 md:px-12 text-center'>
					<h2 className='text-2xl md:text-4xl font-semibold text-gray-800 mb-8'>
						Escolha o Plano Perfeito para Você
					</h2>
					<p className='text-muted-foreground md:text-lg mb-12'>
						Nossos planos flexíveis se adaptam às suas necessidades e
						orçamento.
					</p>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{pricingPlans.map((plan) => (
							<div
								key={plan.id}
								className={`rounded-md shadow-md p-8 flex flex-col ${
									plan.isPopular ? 'border-2 border-primary' : ''
								}`}
							>
								{plan.isPopular && (
									<span className='bg-indigo-500 text-white text-sm py-1 px-3 rounded-full absolute'>
										Popular
									</span>
								)}
								<h3 className='text-xl font-semibold text-muted-foreground mb-4'>
									{plan.name}
								</h3>
								<div className='text-4xl font-bold text-primary mb-4'>
									{plan.price === 'Grátis'
										? plan.price
										: `${plan.price}/mês`}
								</div>
								<p className='text-muted-foreground mb-6'>
									{plan.description}
								</p>
								<ul className='mb-8'>
									{plan.features.map((feature) => (
										<li
											key={uuidv4()}
											className='flex items-center text-muted-foreground mb-2'
										>
											<LuCheck size={20} className='text-success mr-2' />
											{feature}
										</li>
									))}
								</ul>
								<Button className='w-full' sizes='lg'>
									{plan.cta}
								</Button>
							</div>
						))}
					</div>
					<p className='mt-8 text-muted-foreground/80'>
						*Impostos podem ser aplicados. Veja os detalhes completos dos
						planos.
					</p>
				</div>
			</div>
		</ScrollAnimation>
	)
}

export { PricingSection }
