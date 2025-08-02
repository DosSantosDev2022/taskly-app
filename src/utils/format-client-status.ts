// utils/formatStatus.ts ou lib/utils.ts (ou onde você centraliza suas funções utilitárias)

import { ClientStatus } from "@prisma/client";

/**
 * Converte o status do cliente (do banco de dados) para um formato legível na UI.
 *
 * @param status O status do cliente vindo do banco de dados ('ACTIVE' | 'INACTIVE').
 * @returns O status formatado para exibição na UI ('Ativo' | 'Inativo' | 'Status Desconhecido').
 */
export const formatClientStatus = (
	status: "ACTIVE" | "INACTIVE", // Adicione 'undefined' ou 'null' se o status puder vir vazio do DB
): "Ativo" | "Inativo" | "Status Desconhecido" => {
	switch (status) {
		case "ACTIVE":
			return "Ativo";
		case "INACTIVE":
			return "Inativo";
		default:
			// Caso receba um valor inesperado, você pode tratar aqui.
			// É uma boa prática para garantir que a UI não quebre.
			return "Status Desconhecido";
	}
};

export function getStatusClientStyles(status: ClientStatus): string {
	switch (
		status // Já recebendo ProjectStatus, então não precisa normalizar novamente
	) {
		case "ACTIVE":
			return "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground";
		case "INACTIVE":
			return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
	}
}
