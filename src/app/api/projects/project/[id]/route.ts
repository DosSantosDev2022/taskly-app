// src/app/api/projects/[id]/route.ts
import { ProjectDetails } from "@/@types/project-types";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Define a interface para o projeto, garantindo consistência
interface ProjectForClient extends Omit<ProjectDetails, "price"> {
	price: number;
}

/**
 * Rota GET para buscar um projeto por ID.
 * Exemplo de uso: GET /api/projects/clm5y8y6u0000y1n7c1q0g4o
 */
export async function GET(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const authHeader = request.headers.get("Authorization");
		const token = authHeader?.split(" ")[1];
		const session = await getServerSession(authOptions);
		// ✅ Valide se o token (que agora é o ID do usuário) existe
		if (!token) {
			return NextResponse.json(
				{ message: "Token de autenticação não fornecido." },
				{ status: 401 },
			);
		}

		const projectId = params.id;
		if (!projectId) {
			return NextResponse.json(
				{ message: "ID do projeto não fornecido." },
				{ status: 400 },
			);
		}

		const projectRaw = await db.project.findUnique({
			where: { id: projectId, userId: token },
			include: {
				user: { select: { name: true, email: true } },
				client: { select: { name: true, email: true } },
				tasks: true,
				comments: true,
			},
		});

		if (!projectRaw) {
			return NextResponse.json(
				{ message: "Projeto não encontrado ou acesso negado." },
				{ status: 404 },
			);
		}

		// Transforma o tipo Prisma.Decimal para number antes de enviar para o cliente
		const projectForClient: ProjectForClient = {
			...projectRaw,
			price: projectRaw.price.toNumber(),
		};

		return NextResponse.json(projectForClient, { status: 200 });
	} catch (error) {
		console.error("Erro ao buscar projeto na API:", error);
		return NextResponse.json(
			{ message: "Erro interno do servidor." },
			{ status: 500 },
		);
	}
}
