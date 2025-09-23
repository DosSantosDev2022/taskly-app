// src/app/api/projects/route.ts

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import type { ProjectStatus, ProjectType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * Rota GET para buscar projetos com filtros e paginação.
 * Exemplo de uso: /api/projects?status=IN_PROGRESS&page=2
 */
export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ message: "Usuário não autenticado." },
				{ status: 401 },
			);
		}

		// Extrai os parâmetros da URL
		const { searchParams } = new URL(request.url);
		const filters = {
			type: searchParams.get("type") as ProjectType | null,
			status: searchParams.get("status") as ProjectStatus | null,
			page: searchParams.get("page") || "1",
			pageSize: searchParams.get("pageSize") || "10",
		};

		const page = parseInt(filters.page, 10);
		const pageSize = parseInt(filters.pageSize, 10);
		const skip = (page - 1) * pageSize;

		// Constrói a cláusula WHERE com base nos filtros
		const whereClause: any = { userId: session.user.id };
		if (filters.type) {
			whereClause.type = filters.type;
		}
		if (filters.status) {
			whereClause.status = filters.status;
		}

		// Usa `db.$transaction` para executar as duas queries em paralelo
		const [projects, totalProjects] = await db.$transaction([
			db.project.findMany({
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
			}),
			db.project.count({ where: whereClause }),
		]);

		// Retorna a resposta JSON
		return NextResponse.json({
			projects,
			totalProjects,
			currentPage: page,
			pageSize,
		});
	} catch (error) {
		console.error("Erro ao buscar projetos:", error);
		return NextResponse.json(
			{ message: "Não foi possível carregar os projetos." },
			{ status: 500 },
		);
	}
}
