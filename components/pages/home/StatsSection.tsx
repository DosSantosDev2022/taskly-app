import { ScrollAnimation } from '@/components/global/scrollAnimation'
import { v4 as uuidv4 } from 'uuid'
import {
	FaCheckCircle,
	FaTasks,
	FaUsers,
	FaChartLine,
} from 'react-icons/fa' // Importe ícones relevantes

export default function StatsSection() {
	const stats = [
		{
			id: uuidv4(),
			value: '10,000+',
			label: 'Usuários Ativos',
			icon: <FaUsers size={48} className='text-indigo-500 mb-2' />,
		},
		{
			id: uuidv4(),
			value: '50,000+',
			label: 'Tarefas Concluídas Mensalmente',
			icon: <FaTasks size={48} className='text-green-500 mb-2' />,
		},
		{
			id: uuidv4(),
			value: '99.9%',
			label: 'Satisfação do Cliente',
			icon: <FaCheckCircle size={48} className='text-blue-500 mb-2' />,
		},
		{
			id: uuidv4(),
			value: '30%',
			label: 'Aumento Médio de Produtividade',
			icon: <FaChartLine size={48} className='text-orange-500 mb-2' />,
		},
	]

	return (
		<ScrollAnimation>
			<div className='bg-secondary/30 py-16 md:py-24'>
				<div className='container mx-auto px-6 md:px-12 text-center'>
					<h2 className='text-2xl md:text-4xl font-semibold text-gray-800 mb-8'>
						Nossos Números Falam por Si
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
						{stats.map((stat) => (
							<div
								key={stat.id}
								className='bg-background rounded-md shadow-md p-8 flex flex-col items-center justify-center'
							>
								{stat.icon}
								<div className='font-bold text-3xl md:text-4xl text-primary mb-2'>
									{stat.value}
								</div>
								<p className='text-muted-foreground md:text-lg'>
									{stat.label}
								</p>
							</div>
						))}
					</div>
					<p className='mt-8 text-muted-foreground'>
						*Baseado em dados internos e pesquisas com nossos usuários.
					</p>
				</div>
			</div>
		</ScrollAnimation>
	)
}

export { StatsSection }
