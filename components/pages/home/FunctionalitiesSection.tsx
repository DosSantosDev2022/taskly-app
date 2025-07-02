import { ScrollAnimation } from '@/components/global/scrollAnimation'
import { LuCheck } from 'react-icons/lu'
import { v4 as uuidv4 } from 'uuid'
const FunctionalitiesSection = () => {
	const featuresList = [
		{
			id: uuidv4(),
			title: 'Organização Intuitiva',
			content:
				'Mantenha suas tarefas sob controle com uma interface fácil de usar e recursos de organização poderosos.',
			icon: <LuCheck size={24} className='text-indigo-600' />, // Exemplo de ícone
		},
		{
			id: uuidv4(),
			title: 'Colaboração Eficaz',
			content:
				'Compartilhe tarefas, delegue responsabilidades e trabalhe em equipe de forma integrada.',
			icon: <LuCheck size={24} className='text-green-500' />, // Outro exemplo de ícone
		},
		{
			id: uuidv4(),
			title: 'Acompanhamento de Progresso',
			content:
				'Visualize o status das suas tarefas e projetos com gráficos e relatórios em tempo real.',
			icon: <LuCheck size={24} className='text-blue-500' />, // Mais um exemplo
		},
		{
			id: uuidv4(),
			title: 'Alertas e Notificações',
			content:
				'Receba lembretes e notificações para nunca perder prazos importantes.',
			icon: <LuCheck size={24} className='text-orange-500' />, // E outro
		},
	]
	return (
		<ScrollAnimation>
			<div className='py-16 md:py-24'>
				<div className='container mx-auto px-6 md:px-12'>
					<div className='text-center mb-10 md:mb-16'>
						<h2 className='text-2xl md:text-4xl font-semibold text-gray-800 mb-4'>
							Maximize sua Produtividade com Taskly
						</h2>
						<p className='text-gray-600 md:text-lg'>
							Descubra um novo nível de organização e eficiência no
							gerenciamento de suas tarefas.
						</p>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
						{featuresList.map((feature) => (
							<div
								key={feature.id}
								className='bg-white rounded-md shadow-md p-6 flex flex-col items-center text-center'
							>
								<div className='w-12 h-12 rounded-full flex items-center justify-center bg-indigo-100 mb-4'>
									{feature.icon}
								</div>
								<h3 className='text-lg font-semibold text-gray-700 mb-2'>
									{feature.title}
								</h3>
								<p className='text-gray-600 text-sm'>{feature.content}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</ScrollAnimation>
	)
}

export { FunctionalitiesSection }
