'use client'

import { useState } from 'react'
import type { ClientWithRelations } from '@/@types/prismaSchema'
import { formatDate } from '@/utils/formatDate'
import { DetailRow } from '@/components/pages/clients/detailRow'
import {
	Badge,
	Button,
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogDescription
} from '@/components/ui'
import { FormEditClient } from './formEditClient'
import { MdEdit } from 'react-icons/md'

interface ViewDetailsClientProps {
	client: ClientWithRelations
}


const ViewDetailsClient = ({ client }: ViewDetailsClientProps) => {
	const [isEditable, setIsEditable] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false) // Estado para controlar o Dialog

	const handleEditClient = () => setIsEditable((prev) => !prev)

	const statusClient = client?.status === 'active' ? 'Ativo' : 'Inativo'

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger className='p-1 hover:bg-accent cursor-pointer'>
				<span>Detalhes</span>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Detalhes do Cliente</DialogTitle>
					<DialogDescription className='sr-only'>
						Visualização dos detalhes e opção de edição do cliente.
					</DialogDescription>
					<DialogClose />
				</DialogHeader>

				{client ? (
					isEditable ? (
						<FormEditClient
							handleEditClient={handleEditClient}
							client={client}
						/>
					) : (
						<div className='space-y-6'>
							<div className='border border-border rounded-lg p-4 bg-muted/10 space-y-2'>
								<div className='flex items-center justify-between w-full'>
									<h2 className='text-lg font-semibold tracking-tight text-foreground mb-2'>
										Bio
									</h2>
									<Button
										variant='ghost'
										size='icon'
										onClick={handleEditClient}
									>
										<MdEdit />
										<span className='sr-only'>Editar cliente</span>
									</Button>
								</div>

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
						</div>
					)
				) : (
					<p className='text-destructive'>Cliente não encontrado.</p>
				)}
			</DialogContent>
		</Dialog>
	)
}

export { ViewDetailsClient }