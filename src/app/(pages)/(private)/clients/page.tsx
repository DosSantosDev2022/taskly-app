import type { JSX } from "react";
import { Separator } from "@/components/ui/separator";
import { AddClientForm, ClientTable } from "@/components/pages";
import { getClients } from "@/actions/client/getClients";
import { PaginationComponent } from "@/components/global";
import { ClientSearch } from "@/components/pages/clients/clientSearch";

interface ClientPageParams {
	searchParams: {
		page?: string;
		pageSize: string;
		query?: string;
	};
}

export default async function ClientPage({
	searchParams,
}: ClientPageParams): Promise<JSX.Element> {
	const currentPage = Number(searchParams?.page) || 1;
	const pageSize = Number(searchParams?.pageSize) || 10;
	const searchQuery = searchParams?.query || "";

	const result = await getClients(currentPage, pageSize, searchQuery);

	if (!result.success || !result.clients) {
		console.error(
			"Página de Clientes: Falha ao carregar clientes. Mensagem:",
			result.message,
		);
		return (
			<div className="flex-1 space-y-4 p-8 pt-6 mt-20">
				<div className="flex items-center justify-between space-y-2">
					<h1 className="font-bold text-xl">Meus clientes</h1>
				</div>
				<Separator />
				<div className="text-destructive font-medium">
					{result.message ||
						"Ocorreu um erro ao carregar os clientes. Por favor, tente novamente."}
				</div>
				<div className="flex items-center space-x-2 ">
					<AddClientForm />
				</div>
			</div>
		);
	}

	const clients = result.clients;
	const totalClients = result.totalClients || 0; // Garante que é um número
	const totalPages = Math.ceil(totalClients / pageSize);

	return (
		<div className="container mx-auto mt-20 p-4">
			<div className="flex-1 space-y-4 pt-6">
				{/* Cabeçalho da Página */}
				<div className="flex items-center justify-between space-y-2">
					<h1 className="font-bold text-xl">Meus clientes</h1>
					<div className="flex items-center space-x-2 ">
						{/* Input para filtar cliente por busca */}
						<ClientSearch currentQuery={searchQuery} />

						{/* Botão para Adicionar Cliente que abre o modal */}
						<AddClientForm />
					</div>
				</div>

				<Separator />

				{/* Tabela de Clientes */}
				<ClientTable clients={clients} />

				{/* Componente de Paginação */}
				{
					// Só mostra a paginação se houver mais clientes que o tamanho da página
					<div className="flex items-center justify-between mt-4">
						<span className="text-sm text-muted-foreground">
							Total de clientes: {totalClients}
						</span>
						<PaginationComponent
							currentPage={currentPage}
							totalPages={totalPages}
							pageSize={pageSize}
						/>
					</div>
				}
			</div>
		</div>
	);
}
