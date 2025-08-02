"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState, useTransition, type JSX } from "react";

// Assumindo que você terá um tipo Client do Prisma
import { deleteClient } from "@/actions/client";
import { ConfirmationDialog } from "@/components/global";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { Button } from "@/components/ui/button";
import type { Client } from "@prisma/client";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { EditClientForm } from "./edit-client-form";
import { StatusButtonClient } from "./status-button-client";

interface ClientTableProps {
	clients: Client[];
}

const ClientTable = ({ clients }: ClientTableProps): JSX.Element => {
	// --- Estados Locais e Transições ---
	const [isDeleting, startDeleteTransition] = useTransition(); // Estado para gerenciar a transição de exclusão
	const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Estado para controlar a visibilidade do diálogo de confirmação
	const [showEditModal, setShowEditModal] = useState(false); // Estado para controlar a visibilidade do modal de edição

	// Armazena o ID do cliente selecionado para exclusão
	const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
	// Armazena o nome do cliente selecionado para exibir no diálogo
	const [selectedClientName, setSelectedClientName] = useState<string | null>(
		null,
	);

	const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

	// --- Handlers de Ações ---

	/**
	 * @function handleInitiateDelete
	 * @description Abre o diálogo de confirmação para deletar o cliente.
	 * @param {string} clientId O ID do cliente a ser deletado.
	 * @param {string} clientName O nome do cliente a ser deletado.
	 */
	const handleInitiateDelete = (clientId: string, clientName: string) => {
		setSelectedClientId(clientId); // Armazena o ID
		setSelectedClientName(clientName); // Armazena o nome
		setShowConfirmDialog(true);
	};

	/**
	 * @function handleConfirmDelete
	 * @description Executa a ação de deletar o cliente após a confirmação.
	 * Exibe toasts de sucesso/erro e aciona o callback de exclusão.
	 */
	const handleConfirmDelete = async () => {
		if (!selectedClientId) {
			// Garante que há um ID para deletar
			toast.error("Nenhum cliente selecionado para exclusão.", {
				autoClose: 3000,
				theme: "dark",
			});
			setShowConfirmDialog(false); // Fecha o diálogo
			return;
		}

		setShowConfirmDialog(false); // Fecha o diálogo de confirmação
		startDeleteTransition(async () => {
			const formData = new FormData();
			formData.append("clientId", selectedClientId); // Usa o ID armazenado no estado

			const result = await deleteClient(formData); // Chama a Server Action de exclusão

			if (result.success) {
				toast.success(`Cliente "${selectedClientName}" deletado com sucesso!`, {
					// Usa o nome armazenado
					autoClose: 3000,
					theme: "dark",
				});
				//  Limpa o ID e o nome selecionados após a exclusão bem-sucedida
				setSelectedClientId(null);
				setSelectedClientName(null);
			} else {
				console.error("Erro ao deletar cliente:", result.errors);
				toast.error(result.message || "Erro ao deletar cliente!", {
					autoClose: 3000,
					theme: "dark",
				});
			}
		});
	};

	/**
	 * @function handleCancelDelete
	 * @description Cancela a operação de exclusão, fechando o diálogo de confirmação.
	 */
	const handleCancelDelete = () => {
		setShowConfirmDialog(false);
	};

	/**
	 * @function handleInitiateEdit
	 * @description Prepara e abre o modal de edição para um cliente específico.
	 * @param {Client} clientToEdit O objeto Cliente completo a ser editado.
	 */
	const handleInitiateEdit = (client: Client) => {
		setClientToEdit(client); // Armazena o objeto cliente completo
		setShowEditModal(true);
	};

	/**
	 * @function handleCloseEditModal
	 * @description Fecha o modal de edição do comentário.
	 */
	const handleCloseEditModal = () => {
		setShowEditModal(false);
		setClientToEdit(null);
	};

	return (
		<div className="rounded-md border overflow-x-auto max-h-[560px] scrollbar-custom ">
			<Table className="min-w-full">
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Telefone</TableHead>
						<TableHead className="text-center">Status</TableHead>
						<TableHead className="text-center w-[100px]">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{clients.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={6}
								className="h-24 text-center text-muted-foreground"
							>
								Nenhum cliente encontrado.
							</TableCell>
						</TableRow>
					) : (
						clients.map((client) => (
							<TableRow key={client.id}>
								<TableCell>{client.name}</TableCell>
								<TableCell>{client.email}</TableCell>
								<TableCell>{client.phone || "N/A"}</TableCell>
								<TableCell className="text-center">
									{/* Exemplo de badge para status - adapte se seu cliente tiver um campo status */}
									<StatusButtonClient
										clientId={client.id}
										currentStatus={client.status}
									/>
								</TableCell>
								<TableCell className="text-right flex justify-end gap-2">
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												aria-label={`Editar cliente ${client.name}`}
												onClick={() => handleInitiateEdit(client)}
											>
												<Edit className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Editar</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												disabled={isDeleting}
												variant="ghost"
												size="icon"
												aria-label={`Deletar cliente ${client.name}`}
												onClick={() =>
													handleInitiateDelete(client.id, client.name)
												}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Deletar</TooltipContent>
									</Tooltip>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{/* Diálogo de confirmação para exclusão */}
			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				title="Deletar Cliente"
				description={
					selectedClientName
						? `Tem certeza que deseja deletar o cliente "${selectedClientName}"? Esta ação não pode ser desfeita e o cliente será removido permanentemente.`
						: "Tem certeza que deseja deletar este cliente? Esta ação não pode ser desfeita e o cliente será removido permanentemente."
				}
				confirmText="Sim, Deletar"
				cancelText="Não, Cancelar"
			/>

			{/* Modal de edição do comentário */}
			{showEditModal && clientToEdit && (
				<EditClientForm
					isOpen={showEditModal}
					onClose={handleCloseEditModal}
					client={clientToEdit}
				/>
			)}
		</div>
	);
};
export { ClientTable };
