import { PaginationApp } from '@/components/global/pagination'
import { AddClients } from '@/components/pages/clients/addClients'
import { FilterDate, FilterSearch } from '@/components/global/filters'
import { Table } from '@/components/ui'
import { FaUser } from 'react-icons/fa'
import { FilterAddress } from '@/components/global/filters/filteradress'
import { ActionTable } from '@/components/global/actionsTable'
import { FilterStatus } from '@/components/global/filters/filterStatus'

export default function Clients() {
	const headers = [
		'Nome',
		'Projeto',
		'Email',
		'Telefone',
		'Endereço',
		'Cidade',
		'Estado',
		'Status',
		'Ação',
	]
	const data = [
		{
			Nome: 'João Alves Silva',
			Projeto: 'Projeto de teste dev',
			Email: 'joao.silva@email.com',
			Telefone: '(11) 91234-5678',
			Endereço: 'Av. Paulista, 1000',
			City: 'São Paulo',
			State: 'SP',
			Status: 'Ativo',
			Ação: <ActionTable id='1' path='clients' />,
		},
		{
			Nome: 'Maria Paula Rodrigues',
			Projeto: 'Projeto de teste dev',
			Email: 'maria.oliveira@email.com',
			Telefone: '(21) 99876-5432',
			Endereço: 'Rua das Laranjeiras, 250',
			City: 'Rio de Janeiro',
			state: 'RJ',
			Status: 'Inativo',
			Ação: <ActionTable id='2' path='clients' />,
		},
		{
			Nome: 'Ana Maria Clara',
			Projeto: 'Projeto de teste dev',
			Email: 'ana.martins@email.com',
			Telefone: '(21) 99654-3210',
			Endereço: 'Av. Atlântica, 500',
			City: 'Rio de Janeiro',
			state: 'RJ',
			Status: 'Inativo',
			Ação: <ActionTable id='3' path='clients' />,
		},
		{
			Nome: 'Carlos Alberto Coelho',
			Projeto: 'Projeto de teste dev',
			Email: 'carlos.souza@email.com',
			Telefone: '(31) 98765-4321',
			Endereço: 'Rua da Bahia, 150',
			City: 'Belo Horizonte',
			State: 'MG',
			Status: 'Ativo',
			Ação: <ActionTable id='4' path='clients' />,
		},
		{
			Nome: 'Carlos Alberto Coelho',
			Projeto: 'Projeto de teste dev',
			Email: 'carlos.souza@email.com',
			Telefone: '(31) 98765-4321',
			Endereço: 'Rua da Bahia, 150',
			City: 'Belo Horizonte',
			State: 'MG',
			Status: 'Ativo',
			Ação: <ActionTable id='5' path='clients' />,
		},
		{
			Nome: 'Carlos Alberto Coelho',
			Projeto: 'Projeto de teste dev',
			Email: 'carlos.souza@email.com',
			Telefone: '(31) 98765-4321',
			Endereço: 'Rua da Bahia, 150',
			City: 'Belo Horizonte',
			State: 'MG',
			Status: 'Ativo',
			Ação: <ActionTable id='6' path='clients' />,
		},
		{
			Nome: 'Carlos Alberto Coelho',
			Projeto: 'Projeto de teste dev',
			Email: 'carlos.souza@email.com',
			Telefone: '(31) 98765-4321',
			Endereço: 'Rua da Bahia, 150',
			City: 'Belo Horizonte',
			State: 'MG',
			Status: 'Ativo',
			Ação: <ActionTable id='7' path='clients' />,
		},
		{
			Nome: 'Carlos Alberto Coelho',
			Projeto: 'Projeto de teste dev',
			Email: 'carlos.souza@email.com',
			Telefone: '(31) 98765-4321',
			Endereço: 'Rua da Bahia, 150',
			City: 'Belo Horizonte',
			State: 'MG',
			Status: 'Ativo',
			Ação: <ActionTable id='8' path='clients' />,
		},
		{
			Nome: 'Carlos Alberto Coelho',
			Projeto: 'Projeto de teste dev',
			Email: 'carlos.souza@email.com',
			Telefone: '(31) 98765-4321',
			Endereço: 'Rua da Bahia, 150',
			City: 'Belo Horizonte',
			State: 'MG',
			Status: 'Ativo',
			Ação: <ActionTable id='9' path='clients' />,
		},
		{
			Nome: 'Carlos Alberto Coelho',
			Projeto: 'Projeto de teste dev',
			Email: 'carlos.souza@email.com',
			Telefone: '(31) 98765-4321',
			Endereço: 'Rua da Bahia, 150',
			City: 'Belo Horizonte',
			State: 'MG',
			Status: 'Ativo',
			Ação: <ActionTable id='10' path='clients' />,
		},
		{
			Nome: 'Carlos Alberto Coelho',
			Projeto: 'Projeto de teste dev',
			Email: 'carlos.souza@email.com',
			Telefone: '(31) 98765-4321',
			Endereço: 'Rua da Bahia, 150',
			City: 'Belo Horizonte',
			State: 'MG',
			Status: 'Ativo',
			Ação: <ActionTable id='11' path='clients' />,
		},
		{
			Nome: 'Carlos Alberto Coelho',
			Projeto: 'Projeto de teste dev',
			Email: 'carlos.souza@email.com',
			Telefone: '(31) 98765-4321',
			Endereço: 'Rua da Bahia, 150',
			City: 'Belo Horizonte',
			State: 'MG',
			Status: 'Ativo',
			Ação: <ActionTable id='12' path='clients' />,
		},
	]

	return (
		<div className='flex flex-col space-y-3 h-full overflow-hidden'>
			<div className='flex flex-col space-y-3'>
				<div className='flex items-center space-x-3 p-1.5'>
					<FaUser size={28} />
					<h3 className='font-bold text-2xl tracking-wider'>
						Meus Clientes
					</h3>
				</div>
				<div className='flex items-center justify-between p-1.5 space-x-2'>
					<AddClients />
					<div className='flex items-center space-x-2'>
						{/* Filters */}
						<FilterSearch />
						{/* <FilterDate /> */}
						<FilterAddress />
						{/* Filter Status */}
						<FilterStatus />
					</div>
				</div>
			</div>

			<div className='flex-grow'>
				<Table headers={headers} data={data} />
				<div className='w-full p-2 mt-1 flex items-center justify-end'>
					<PaginationApp />
				</div>
			</div>
		</div>
	)
}
