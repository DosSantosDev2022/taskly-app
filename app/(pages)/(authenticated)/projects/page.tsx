import { PaginationApp } from '@/components/global/pagination'
import { AddProjects } from '@/components/pages/project/addProject'
import { FiltersProject } from '@/components/pages/project/filtersProject'
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui'
import { FaFile } from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'

export default function Projects() {
	const headers = [
		'Nome',
		'Descrição',
		'Proprietário',
		'Time',
		'Data',
		'Status',
	]

	const data = [
		{
			Nome: 'Desenvolvimento de Novo Site',
			Descrição: 'Criar um site moderno e responsivo para a empresa.',
			Proprietário: 'Juliano Santos',
			Time: 'Equipe de Desenvolvimento',
			Data: '14/04/2025',
			Status: 'EM ANDAMENTO',
		},
		{
			Nome: 'Campanha de Marketing Digital',
			Descrição:
				'Planejar e executar uma campanha de marketing para aumentar as vendas.',
			Proprietário: 'Juliano Santos',
			Time: 'Equipe de Desenvolvimento',
			Data: '14/04/2025',
			Status: 'CONCLUIDO',
		},
		{
			Nome: 'Desenvolvimento de Aplicativo Móvel',
			Descrição: 'Criar um aplicativo móvel para iOS e Android.',
			Proprietário: 'Juliano Santos',
			Time: 'Equipe de Desenvolvimento',
			Data: '14/04/2025',
			Status: 'PENDENTE',
		},
		{
			Nome: 'Otimização de Processos Internos',
			Descrição: 'Analisar e otimizar os processos internos da empresa.',
			Proprietário: 'Juliano Santos',
			Time: 'Equipe de Desenvolvimento',
			Data: '14/04/2025',
			Status: 'EM ANDAMENTO',
		},
		{
			Nome: 'Lançamento de Novo Produto',
			Descrição:
				'Planejar e executar o lançamento de um novo produto no mercado.',
			Proprietário: 'Juliano Santos',
			Time: 'Equipe de Desenvolvimento',
			Data: '14/04/2025',
			Status: 'CONCLUIDO',
		},
	]

	const statusColors = {
		'EM ANDAMENTO': 'bg-warning/60',
		CONCLUIDO: 'bg-success/60',
		PENDENTE: 'bg-danger/60',
	}

	return (
		<div className='flex flex-col space-y-3 h-full overflow-hidden'>
			<div className='flex flex-col space-y-3'>
				<div className='flex items-center space-x-3 p-1.5'>
					<FaFile size={28} />
					<h3 className='font-bold text-2xl tracking-wider'>
						Meus Projetos
					</h3>
				</div>

				<div className='flex items-center justify-between p-1.5 space-x-2'>
					<AddProjects />
					{/* Filters */}
					<FiltersProject />
				</div>
			</div>

			<div className='flex-grow'>
				<Table>
					<TableHeader>
						<tr>
							{headers.map((header) => (
								<TableCell className=' font-semibold' key={header}>
									{header}
								</TableCell>
							))}
						</tr>
					</TableHeader>
					<TableBody>
						{data.map((row) => (
							<TableRow key={uuidv4()}>
								{Object.values(row).map((cell, index) => {
									if (headers[index] === 'Status') {
										return (
											<TableCell key={uuidv4()} className={'w-28'}>
												<span
													className={`${statusColors[cell]} flex justify-center items-center w-full text-[11px] font-medium text-accent-foreground dark:text-foreground px-1.5 py-0.5 rounded-2xl`}
												>
													{cell}
												</span>
											</TableCell>
										)
									}
									return <TableCell key={uuidv4()}>{cell}</TableCell>
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className='w-full p-2 mt-1 flex items-center justify-end'>
					<PaginationApp />
				</div>
			</div>
		</div>
	)
}
