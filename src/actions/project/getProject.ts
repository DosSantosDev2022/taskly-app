// src/actions/project/getProjects.ts
"use server";

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma"; // Seu cliente Prisma simples
// Importe os tipos brutos do Prisma, pois você vai transformá-los.
import type { ProjectStatus, ProjectType, Task, Comment } from "@prisma/client";
import { getServerSession } from "next-auth";

// --- Tipo ProjectForClient: Reflete o formato que você VAI ENVIAR ---
// "price" é um number, "deadlineDate", "createdAt", "updatedAt" são Dates
export type ProjectForClient = {
	id: string;
	name: string;
	description: string | null;
	type: ProjectType;
	status: ProjectStatus;
	userId: string;
	price: number; // <-- Explicitamente NUMBER aqui
	deadlineDate: Date | null; // <-- Explicitamente Date aqui
	createdAt: Date; // <-- Explicitamente Date aqui
	updatedAt: Date; // <-- Explicitamente Date aqui
	clientId: string | null;
	contractUrl: string | null;
	contractFileName: string | null;
	user?: { name: string | null; email: string | null } | null;
	client?: { name: string | null; email: string | null } | null;
	tasks?: Task[];
	comments?: Comment[];
};

// Interface para os parâmetros de filtro (mantém-se igual)
interface GetProjectsFilters {
	type?: ProjectType;
	status?: ProjectStatus;
	page?: number;
	pageSize?: number;
}

export async function getProjects(filters?: GetProjectsFilters): Promise<{
	projects: ProjectForClient[]; // Retorna o tipo transformado
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

		// --- TRANSFORMAÇÃO MANUAL AQUI ---
		// Mapeia cada projeto para o formato esperado pelo Client Component
		const projectsForClient: ProjectForClient[] = projectsRaw.map(
			(project) => ({
				...project,
				// Converte Prisma.Decimal para number usando .toNumber()
				price: project.price.toNumber(),
				// Datas já são Date, não precisam de transformação extra aqui
				// Se elas fossem string e você quisesse Date, usaria new Date(project.dateString)
				// Mas o log mostra que já são Date, então tá ok!
			}),
		);

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

export async function getProjectById(
	id: string,
): Promise<ProjectForClient | null> {
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

		// --- TRANSFORMAÇÃO MANUAL PARA UM ÚNICO PROJETO ---
		const projectForClient: ProjectForClient = {
			...projectRaw,
			price: projectRaw.price.toNumber(),
		};

		return projectForClient;
	} catch (error) {
		console.error(`Erro ao buscar projeto com ID ${id}:`, error);
		throw new Error("Não foi possível carregar o projeto.");
	}
}
