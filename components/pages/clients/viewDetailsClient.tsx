'use client'

import { useEffect, useState } from 'react'
import { GrView } from 'react-icons/gr'
import type { ClientWithProjects } from '@/@types/dataTypes'
import { formatDate } from '@/utils/formatDate'
import { DetailRow } from '@/components/pages/clients/detailRow'
import {
	Badge,
	Button,
	ModalClose,
	ModalContent,
	ModalHeader,
	ModalLoading,
	ModalOverlay,
	ModalRoot,
	ModalTitle,
	ModalTrigger,
} from '@/components/ui'
import { FormEditClient } from './formEditClient'

const ViewDetailsClient = ({ id }: { id: string }) => {
	const [isEditable, setIsEditable] = useState(false)
	const [client, setClient] = useState<ClientWithProjects | null>(null)
	const [loading, setLoading] = useState(true)

	const handleEditClient = () => {
		setIsEditable((prev) => !prev)
	}

	useEffect(() => {
		const getClient = async () => {
			try {
				const res = await fetch(`/api/clients/${id}`)
				if (!res.ok) throw new Error('Erro ao buscar cliente')
				const data = await res.json()
				setClient(data)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}

		getClient()
	}, [id])

	const statusClient = client?.status === 'active' ? 'Ativo' : 'Inativo'

	return (
		<ModalRoot>
			<ModalTrigger className='text-sm h-8' sizes='icon' variants='link'>
				<GrView size={24} />
			</ModalTrigger>
			<ModalOverlay variant='dark' />
			<ModalContent>
				<ModalHeader>
					<ModalTitle>Detalhes do cliente</ModalTitle>
					<ModalClose />
				</ModalHeader>

				{loading ? (
					<ModalLoading />
				) : client ? (
					isEditable ? (
						<div>
							{/* Aqui entraria o formulário de edição */}
							<FormEditClient
								handleEditClient={handleEditClient}
								client={client}
							/>
						</div>
					) : (
						<div className='space-y-2'>
							<div className='border p-2 grid grid-cols-2 gap-1'>
								<div className='space-y-2'>
									<DetailRow label='Nome:' value={client.name} />
									<DetailRow label='Email:' value={client.email} />
									<DetailRow label='Telefone:' value={client.phone} />
								</div>
								<div className='space-y-2'>
									<DetailRow label='Endereço:' value={client.address} />
									<DetailRow label='Estado:' value={client.state} />
									<DetailRow label='Cidade:' value={client.city} />
									<DetailRow label='CEP:' value={client.zipcode} />
								</div>
							</div>

							<div className='border p-2.5 flex w-full justify-between items-center'>
								<DetailRow
									label='Status:'
									value={<Badge>{statusClient}</Badge>}
								/>
								<DetailRow
									label='Cadastro:'
									value={formatDate(client.createdAt)}
								/>
							</div>

							<div className='border p-2 space-y-2'>
								<h2 className='text-lg font-semibold leading-none tracking-tight text-foreground sm:text-xl'>
									Projetos
								</h2>
								<ul className='border p-2'>
									{client.projects.map((project) => (
										<li key={project.id}>{project.name}</li>
									))}
								</ul>
							</div>

							<div className='w-full flex items-center justify-end'>
								<Button sizes='xs' onClick={handleEditClient}>
									Editar
								</Button>
							</div>
						</div>
					)
				) : (
					<p>Cliente não encontrado.</p>
				)}
			</ModalContent>
		</ModalRoot>
	)
}

export { ViewDetailsClient }
