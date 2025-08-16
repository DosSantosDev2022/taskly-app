// app/api/projects/route.ts
import type { ProjectDetails } from "@/@types/project-types";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import type { ProjectStatus, ProjectType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const type = searchParams.get("type") as ProjectType | null;
		const status = searchParams.get("status") as ProjectStatus | null;
		const page = parseInt(searchParams.get("page") || "1", 10);
		const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

		const whereClause: any = { userId: session.user.id };
		if (type) {
			whereClause.type = type;
		}
		if (status) {
			whereClause.status = status;
		}

		const skip = (page - 1) * pageSize;

		const totalProjects = await db.project.count({ where: whereClause });

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

		const projectsForClient: ProjectDetails[] = projectsRaw.map((project) => ({
			...project,
			price: project.price.toNumber(),
		}));

		return NextResponse.json({
			projects: projectsForClient,
			totalProjects,
			currentPage: page,
			pageSize,
		});
	} catch (error) {
		console.error("Erro ao buscar projetos na API Route:", error);
		return NextResponse.json(
			{ message: "Não foi possível carregar os projetos." },
			{ status: 500 },
		);
	}
}
