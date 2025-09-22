// src/lib/dashboard-data.ts

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { ProjectStatus } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function getDashboardData() {
	const session = await getServerSession(authOptions);
	const userId = session?.user.id;

	if (!userId) {
		throw new Error("Usuário não autenticado.");
	}

	// Busca os projetos e clientes em paralelo para mais performance
	const [projects, clientCount, upcomingTasks] = await Promise.all([
		db.project.findMany({
			where: { userId },
			include: {
				tasks: true, // Inclui as tarefas para calcular o progresso
				client: true, // Inclui o cliente para mostrar o nome
			},
			orderBy: {
				updatedAt: "desc",
			},
		}),
		db.client.count({
			where: { userId },
		}),
		db.task.findMany({
			where: {
				userId,
				dueDate: {
					not: null, // Apenas tarefas que têm uma data de vencimento
				},
			},
			orderBy: {
				dueDate: "asc",
			},
		}),
	]);

	// --- Processamento dos Dados ---

	// 1. Cálculos dos KPIs
	const totalRevenue = projects
		.filter((p) => p.status === ProjectStatus.COMPLETED)
		.reduce((sum, p) => sum + p.price, 0);

	const pendingRevenue = projects
		.filter((p) => p.status === ProjectStatus.IN_PROGRESS)
		.reduce((sum, p) => sum + p.price, 0);

	const activeProjectsCount = projects.filter(
		(p) => p.status === ProjectStatus.IN_PROGRESS,
	).length;

	// 2. Projetos Recentes (vamos pegar os 5 mais recentes)
	const recentProjects = projects.slice(0, 5);

	return {
		stats: {
			totalRevenue,
			pendingRevenue,
			activeProjectsCount,
			clientCount,
		},
		recentProjects,
		upcomingTasks,
	};
}
