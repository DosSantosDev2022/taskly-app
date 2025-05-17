'use client'

import { useState } from 'react'
import { GrView } from 'react-icons/gr'
import type { Client } from '@/@types/prismaSchema'
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

interface ViewDetailsClientProps {
	client: Client
}

const ViewDetailsClient = ({ client }: ViewDetailsClientProps) => {
	const [isEditable, setIsEditable] = useState(false)

	const handleEditClient = () => setIsEditable((prev) => !prev)

	const statusClient = client?.status === 'active' ? 'Ativo' : 'Inativo'

	return (
		<ModalRoot>
			<ModalTrigger className='text-sm h-8' sizes='icon' variants='link'>
				<GrView size={20} className='text-muted-foreground' />
			</ModalTrigger>
			<ModalOverlay variant='dark' />
			<ModalContent className='max-w-2xl p-4'>
				<ModalHeader>
					<ModalTitle>Detalhes do Cliente</ModalTitle>
					<ModalClose sizes='icon' icon />
				</ModalHeader>

				{client ? (
					isEditable ? (
						<FormEditClient
							handleEditClient={handleEditClient}
							client={client}
						/>
					) : (
						<div className='space-y-6'>
							<div className='border border-border rounded-lg p-4 bg-muted/10 space-y-2'>
								<h2 className='text-lg font-semibold tracking-tight text-foreground mb-2'>
									Bio
								</h2>
								<DetailRow label='Nome:' value={client.name} />
								<DetailRow label='Email:' value={client.email} />
								<DetailRow label='Telefone:' value={client.phone} />
								<DetailRow label='Endereço:' value={client.address} />
								<DetailRow label='Estado:' value={client.state} />
								<DetailRow label='Cidade:' value={client.city} />
								<DetailRow label='CEP:' value={client.zipcode} />
							</div>

							<div className='border border-border rounded-lg p-4 bg-muted/10 space-y-2'>
								<h2 className='text-lg font-semibold tracking-tight text-foreground mb-2'>
									Infos
								</h2>
								<DetailRow
									label='Status:'
									value={<Badge>{statusClient}</Badge>}
								/>
								<DetailRow
									label='Cadastro:'
									value={formatDate(client.createdAt)}
								/>
							</div>

							<div className='border border-border rounded-lg p-4 bg-muted/10'>
								<h2 className='text-lg font-semibold tracking-tight text-foreground mb-2'>
									Projetos
								</h2>
								<ul className='list-disc list-inside space-y-1'>
									{client.projects.length ? (
										client.projects.map((project) => (
											<li key={project.id}>{project.name}</li>
										))
									) : (
										<p className='text-muted-foreground'>
											Nenhum projeto encontrado.
										</p>
									)}
								</ul>
							</div>

							<div className='flex justify-end'>
								<Button sizes='xs' onClick={handleEditClient}>
									Editar
								</Button>
							</div>
						</div>
					)
				) : (
					<p className='text-destructive'>Cliente não encontrado.</p>
				)}
			</ModalContent>
		</ModalRoot>
	)
}

export { ViewDetailsClient }
