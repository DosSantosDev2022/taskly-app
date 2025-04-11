import { ScrollAnimation } from '@/components/global/scrollAnimation'
import { v4 as uuidv4 } from 'uuid'
import {
	FaChartBar,
	FaProjectDiagram,
	FaPalette,
	FaMobileAlt,
	FaVideo,
	FaMoneyBillWave,
} from 'react-icons/fa'

const AdditionalFeaturesSection = () => {
	const additionalFeatures = [
		{
			id: uuidv4(),
			title: 'Visualizações de Projeto Flexíveis',
			description:
				'Visualize suas tarefas da maneira que funciona melhor para você. Alterne entre listas, quadros Kanban e diagramas de Gantt para um acompanhamento completo.',
			icon: (
				<FaProjectDiagram size={48} className='text-indigo-500 mb-4' />
			),
		},
		{
			id: uuidv4(),
			title: 'Relatórios e Insights Poderosos',
			description:
				'Obtenha insights valiosos sobre a produtividade da sua equipe e o progresso dos projetos com relatórios detalhados e gráficos intuitivos.',
			icon: <FaChartBar size={48} className='text-green-500 mb-4' />,
		},
		{
			id: uuidv4(),
			title: 'Reuniões por Chamada de Vídeo Integradas',
			description:
				'Facilite a colaboração em tempo real com reuniões por chamada de vídeo diretamente na plataforma. Conecte-se com sua equipe para discussões rápidas, planejamentos e alinhamentos visuais.',
			icon: <FaVideo size={48} className='text-blue-500 mb-4' />,
		},
		{
			id: uuidv4(),
			title: 'Personalização e Temas',
			description:
				'Adapte o Taskly ao seu estilo. Escolha entre diversos temas e personalize as configurações para criar um ambiente de trabalho que você realmente goste.',
			icon: <FaPalette size={48} className='text-purple-500 mb-4' />,
		},
		{
			id: uuidv4(),
			title: 'Acesso Multiplataforma',
			description:
				'Gerencie suas tarefas de onde estiver. O Taskly é totalmente responsivo e funciona perfeitamente em desktops, tablets e dispositivos móveis.',
			icon: <FaMobileAlt size={48} className='text-blue-500 mb-4' />,
		},
		{
			id: uuidv4(),
			title: 'Controle Financeiro de Projetos',
			description:
				'Gerencie orçamentos, acompanhe gastos e visualize a saúde financeira dos seus projetos diretamente no Taskly. Mantenha suas finanças organizadas e evite surpresas.',
			icon: <FaMoneyBillWave size={48} className='text-green-600 mb-4' />,
		},
		// Adicione mais recursos conforme necessário
	]

	return (
		<ScrollAnimation>
			<div className='bg-gray-100 py-16 md:py-24'>
				<div className='container mx-auto px-6 md:px-12 text-center'>
					<h2 className='text-2xl md:text-4xl font-semibold text-gray-800 mb-8'>
						Recursos Poderosos para Turbinar sua Produtividade
					</h2>
					<p className='text-muted-foreground md:text-lg mb-12'>
						Descubra as funcionalidades avançadas que tornam o Taskly a
						solução completa para o gerenciamento de suas tarefas e
						projetos.
					</p>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{additionalFeatures.map((feature) => (
							<div
								key={feature.id}
								className='bg-background rounded-md shadow-md p-8 flex flex-col items-center'
							>
								<div className='w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 text-muted-foreground mb-4'>
									{feature.icon}
								</div>
								<h3 className='text-xl font-semibold text-muted-foreground mb-2'>
									{feature.title}
								</h3>
								<p className='text-muted-foreground/90 text-center'>
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</ScrollAnimation>
	)
}

export { AdditionalFeaturesSection }
