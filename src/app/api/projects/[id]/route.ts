// src/app/api/projects/[id]/route.ts

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * Rota GET para buscar um projeto por ID.
 * Exemplo de uso: /api/projects/clm51q25e0000305s6s19n7m6
 */
export async function GET(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ message: "Usuário não autenticado." },
				{ status: 401 },
			);
		}

		const { id } = params;

		const project = await db.project.findUnique({
			where: { id: id, userId: session.user.id },
			include: {
				user: { select: { name: true, email: true } },
				client: { select: { name: true, email: true } },
				tasks: true,
				comments: true,
			},
		});

		if (!project) {
			return NextResponse.json(
				{ message: "Projeto não encontrado ou acesso negado." },
				{ status: 404 },
			);
		}

		return NextResponse.json(project);
	} catch (error) {
		console.error(`Erro ao buscar projeto com ID ${params.id}:`, error);
		return NextResponse.json(
			{ message: "Não foi possível carregar o projeto." },
			{ status: 500 },
		);
	}
}
