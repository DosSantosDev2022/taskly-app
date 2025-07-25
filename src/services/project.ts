import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import type { ProjectStatus, ProjectType } from "@prisma/client";
import { getServerSession } from "next-auth";

// Interface para os parâmetros de filtro
interface GetProjectsFilters {
	type?: ProjectType; // Assumindo que ProjectType é um Enum no Prisma
	status?: ProjectStatus; // Assumindo que ProjectStatus é um Enum no Prisma
	page?: number;
	pageSize?: number;
}

export async function getProjects(filters?: GetProjectsFilters) {
	try {
		// Opcional: Você pode querer filtrar projetos por usuário logado
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			console.warn("Tentativa de buscar projetos sem usuário autenticado.");
			// Retorne um array vazio ou lance um erro, dependendo da sua regra de negócio
			return {
				projects: [],
				totalProjects: 0,
				currentPage: filters?.page || 1,
				pageSize: filters?.pageSize || 10,
			};
		}

		// Objeto 'where' para a consulta do Prisma
		const whereClause: any = {
			userId: session.user.id,
		};

		// Aplica o filtro por tipo, se fornecido
		if (filters?.type) {
			whereClause.type = filters.type;
		}

		// Aplica o filtro por status, se fornecido
		if (filters?.status) {
			whereClause.status = filters.status;
		}

		// Parâmetros de paginação

		const page = filters?.page && filters.page > 0 ? filters.page : 1;
		const pageSize =
			filters?.pageSize && filters.pageSize > 0 ? filters.pageSize : 10;
		const skip = (page - 1) * pageSize;

		const totalProjects = await db.project.count({
			where: whereClause,
		});

		// Busca todos os projetos no banco de dados.
		// Incluímos a relação com o usuário e o cliente para exibir seus nomes, se necessário.
		const projects = await db.project.findMany({
			where: whereClause,
			include: {
				user: {
					select: {
						name: true,
						email: true,
					},
				},
				client: {
					select: {
						name: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc", // Ordena os projetos pelos mais recentes primeiro
			},
			skip: skip,
			take: pageSize,
		});

		/* console.log("Projetos buscados do DB:", projects); */
		return {
			projects,
			totalProjects,
			currentPage: page,
			pageSize,
		};
	} catch (error) {
		console.error("Erro ao buscar projetos:", error);
		// Em caso de erro, retorne um array vazio ou lance o erro para ser tratado no frontend
		throw new Error("Não foi possível carregar os projetos.");
	}
}

// 3. Função para buscar UM projeto pelo ID
// No futuro, esta também será um "Server Action" async com "WHERE id = ..."
export async function getProjectById(id: string) {
	try {
		// Opcional: Garanta que apenas o usuário logado possa buscar seus próprios projetos
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			console.warn(
				`Tentativa de buscar projeto com ID ${id} sem usuário autenticado.`,
			);
			// Você pode lançar um erro ou redirecionar o usuário
			throw new Error("Usuário não autenticado para buscar este projeto.");
		}

		// Busca o projeto pelo ID fornecido e pelo ID do usuário logado
		const project = await db.project.findUnique({
			where: {
				id: id,
				userId: session.user.id, // Garante que o projeto pertence ao usuário logado
			},
			include: {
				user: {
					select: {
						name: true,
						email: true,
					},
				},
				client: {
					select: {
						name: true,
						email: true,
					},
				},
				tasks: true,
				comments: true,
			},
		});

		if (!project) {
			console.log(
				`Projeto com ID ${id} não encontrado ou não pertence ao usuário ${session.user.id}.`,
			);
			return null; // Retorna null se o projeto não for encontrado ou não pertencer ao usuário
		}

		/* console.log(`Projeto com ID ${id} buscado do DB:`, project); */
		return project;
	} catch (error) {
		console.error(`Erro ao buscar projeto com ID ${id}:`, error);
		// Em caso de erro, você pode lançar o erro ou retornar null/undefined
		throw new Error("Não foi possível carregar o projeto.");
	}
}
