"use server";

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import type { Client, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

/**
 * @interface GetClientsResponse
 * @description Define a estrutura de resposta para a Server Action de busca de clientes.
 * @property {boolean} success - Indica se a operação foi bem-sucedida.
 * @property {string} [message] - Mensagem descritiva do resultado da operação (sucesso ou erro).
 * @property {Client[]} [clients] - Array de objetos Client em caso de sucesso.
 * @property {number} [totalClients] - O número total de clientes (para paginação).
 * @property {number} [currentPage] - A página atual retornada.
 * @property {number} [pageSize] - O tamanho da página utilizado.
 * @property {string} [currentQuery] - A string de busca utilizada.
 */
interface GetClientsResponse {
	success: boolean;
	message?: string;
	clients?: Client[];
	totalClients?: number;
	currentPage?: number;
	pageSize?: number;
	currentQuery?: string;
}

/**
 * @function getClients
 * @description Busca clientes com suporte a paginação.
 * @param {number} [page=1] - O número da página a ser buscada (padrão: 1).
 * @param {number} [pageSize=10] - O número de clientes por página (padrão: 10).
 * @returns {Promise<GetClientsResponse>} A resposta contendo os clientes, total, página e tamanho.
 */

export async function getClients(
	page: number = 1,
	pageSize: number = 10,
	query: string = "",
): Promise<GetClientsResponse> {
	// Obtém a sessão do usuário autenticado
	const session = await getServerSession(authOptions);
	const userId = session?.user.id;
	// Verifica se o usuário está autenticado
	if (!userId) {
		console.error(
			"Server Action: Usuário não autenticado para buscar clientes.",
		);
		return {
			success: false,
			message: "Usuário não autenticado para buscar clientes.",
		};
	}

	// Garante que page e pageSize são números positivos
	const validatedPage = Math.max(1, page);
	const validatedPageSize = Math.max(1, Math.min(100, pageSize));
	// Calcula o número de registros a pular com base na página e no tamanho da página
	const skip = (validatedPage - 1) * validatedPageSize;
	// Inicializa as condições de busca

	// Condições de busca para o Prisma
	let searchConditions = {};

	if (query) {
		searchConditions = {
			OR: [
				{
					name: {
						contains: query,
					},
				},
				{
					email: {
						contains: query,
					},
				},
			],
		};
	}
	// Busca os clientes no banco de dados com as condições e paginação
	try {
		const totalClients = await db.client.count({
			where: {
				userId: userId,
				...searchConditions,
			},
		});
		// Busca os clientes com paginação e ordenação
		const clients = await db.client.findMany({
			orderBy: {
				createdAt: "desc", // Ordenar por criação para ver os mais novos primeiro
			},
			where: {
				userId: userId,
				...searchConditions,
			}, // Filtra clientes pelo usuário logado
			skip: skip,
			take: validatedPageSize,
		});

		// Retorna a resposta com os clientes e informações de paginação
		return {
			success: true,
			clients: clients,
			totalClients: totalClients,
			currentPage: validatedPage,
			pageSize: validatedPageSize,
			currentQuery: query,
		};
	} catch (error) {
		console.error("Server Action: Erro ao buscar clientes:", error);
		return {
			success: false,
			message: "Ocorreu um erro ao buscar os clientes.",
		};
	}
}
