"use server";
import { ProjectDetails } from "@/@types/project-types";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import type { ProjectStatus, ProjectType } from "@prisma/client";
import { getServerSession } from "next-auth";

/**
 * @typedef {Object} GetProjectsFilters
 * @property {ProjectType} [type] - Tipo de projeto opcional para filtrar.
 * @property {ProjectStatus} [status] - Status do projeto opcional para filtrar.
 * @property {number} [page] - Número da página opcional para paginação. Padrão é 1.
 * @property {number} [pageSize] - Número opcional de projetos por página para paginação. Padrão é 10.
 */

// Interface para os parâmetros de filtro
interface GetProjectsFilters {
	type?: ProjectType;
	status?: ProjectStatus;
	page?: number;
	pageSize?: number;
}

/**
 * Busca uma lista de projetos para o usuário autenticado, com filtragem e paginação opcionais.
 *
 * @param {GetProjectsFilters} [filters] - Um objeto contendo filtros para os projetos.
 * @returns {Promise<{ projects: ProjectDetails[], totalProjects: number, currentPage: number, pageSize: number }>} Um objeto contendo o array de projetos, a contagem total, a página atual e o tamanho da página.
 * @throws {Error} Se o usuário não estiver autenticado ou ocorrer um erro durante o processo de busca.
 */

export async function getProjects(filters?: GetProjectsFilters): Promise<{
	projects: ProjectDetails[]; // Retorna o tipo transformado
	totalProjects: number;
	currentPage: number;
	pageSize: number;
}> {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			console.warn("Tentativa de buscar projetos sem usuário autenticado.");
			return {
				projects: [],
				totalProjects: 0,
				currentPage: filters?.page || 1,
				pageSize: filters?.pageSize || 10,
			};
		}

		const whereClause: any = { userId: session.user.id };
		if (filters?.type) {
			whereClause.type = filters.type;
		}
		if (filters?.status) {
			whereClause.status = filters.status;
		}

		const page = filters?.page && filters.page > 0 ? filters.page : 1;
		const pageSize =
			filters?.pageSize && filters.pageSize > 0 ? filters.pageSize : 10;
		const skip = (page - 1) * pageSize;

		const totalProjects = await db.project.count({ where: whereClause });

		// Busca os projetos com os tipos BRUTOS do Prisma
		const projectsRaw = await db.project.findMany({
			where: whereClause,
			include: {
				user: { select: { name: true, email: true } },
				client: { select: { name: true, email: true } },
				tasks: true,
				comments: true,
			},
			orderBy: { createdAt: "desc" },
			skip: skip,
			take: pageSize,
		});

		// Mapeia cada projeto para o formato esperado pelo Client Component
		const projectsForClient: ProjectDetails[] = projectsRaw.map((project) => ({
			...project,
			// Converte Prisma.Decimal para number usando .toNumber()
			price: project.price,
		}));

		return {
			projects: projectsForClient,
			totalProjects,
			currentPage: page,
			pageSize,
		};
	} catch (error) {
		console.error("Erro ao buscar projetos:", error);
		throw new Error("Não foi possível carregar os projetos.");
	}
}

/**
 * Busca um único projeto pelo seu ID para o usuário autenticado.
 *
 * @param {string} id - O identificador único do projeto a ser buscado.
 * @returns {Promise<ProjectDetails | null>} Uma promessa que resolve para os detalhes do projeto se encontrado e acessível pelo usuário, caso contrário null.
 * @throws {Error} Se o usuário não estiver autenticado ou ocorrer um erro durante o processo de busca.
 */

export async function getProjectById(
	id: string,
): Promise<ProjectDetails | null> {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			console.warn(
				`Tentativa de buscar projeto com ID ${id} sem usuário autenticado.`,
			);
			throw new Error("Usuário não autenticado para buscar este projeto.");
		}

		const projectRaw = await db.project.findUnique({
			where: { id: id, userId: session.user.id },
			include: {
				user: { select: { name: true, email: true } },
				client: { select: { name: true, email: true } },
				tasks: true,
				comments: true,
			},
		});

		if (!projectRaw) {
			console.log(
				`Projeto com ID ${id} não encontrado ou não pertence ao usuário ${session.user.id}.`,
			);
			return null;
		}

		const projectForClient: ProjectDetails = {
			...projectRaw,
			price: projectRaw.price,
		};

		return projectForClient;
	} catch (error) {
		console.error(`Erro ao buscar projeto com ID ${id}:`, error);
		throw new Error("Não foi possível carregar o projeto.");
	}
}
