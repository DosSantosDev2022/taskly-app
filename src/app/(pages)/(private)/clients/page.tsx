import { getClients } from "@/actions/client";
import { PaginationComponent } from "@/components/global";
import {
	AddClientForm,
	ClientSearch,
	ClientTable,
} from "@/components/pages/clients";
import { Separator } from "@/components/ui/separator";

/**
 * @description Interface para tipar os search parameters da página de clientes.
 */
interface ClientPageSearchParams {
	page?: string;
	pageSize?: string;
	query?: string;
}

/**
 * @description Interface para tipar as props da página de clientes.
 */
interface ClientPageProps {
	searchParams: Promise<ClientPageSearchParams>;
}

/**
 * @description Componente da página de clientes, responsável por exibir a lista de clientes.
 * @param {ClientPageProps} props - As propriedades da página, incluindo os search parameters.
 * @returns {JSX.Element} O componente de página.
 */

export default async function ClientPage({ searchParams }: ClientPageProps) {
	const resolvedSearchParams = await searchParams;

	const currentPage = Number(resolvedSearchParams?.page) || 1;
	const pageSize = Number(resolvedSearchParams?.pageSize) || 10;
	const searchQuery = resolvedSearchParams?.query || "";

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
		<div className="flex flex-col p-8 min-h-[calc(100vh-theme(spacing.16))]">
			<div className="flex-1 space-y-4 pt-6">
				{/* Cabeçalho da Página */}
				<div className="flex items-center justify-between space-y-2">
					<h1 className="font-bold text-xl">Meus clientes</h1>
					<div className="flex items-center space-x-2 ">
						{/* Input para filtrar cliente por busca */}
						<ClientSearch currentQuery={searchQuery} />

						{/* Botão para Adicionar Cliente que abre o modal */}
						<AddClientForm />
					</div>
				</div>

				<Separator />

				{/* Tabela de Clientes */}
				<ClientTable clients={clients} />
			</div>

			{/* Componente de Paginação */}
			{totalClients > 0 && (
				<div className="flex items-center justify-between mt-4">
					<span className="text-sm text-muted-foreground">
						Total de clientes: {totalClients}
					</span>
					<PaginationComponent totalPages={totalPages} />
				</div>
			)}
		</div>
	);
}
