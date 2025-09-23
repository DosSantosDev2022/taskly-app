// src/lib/dashboard-data.ts

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { ProjectStatus, TaskStatus } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function getDashboardData() {
	const session = await getServerSession(authOptions);
	const userId = session?.user.id;

	if (!userId) {
		throw new Error("Usuário não autenticado.");
	}

	// Busca os projetos, clientes e tarefas em paralelo para mais performance
	const [projects, clientCount, upcomingTasks, tasks] = await Promise.all([
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
		db.task.findMany({
			where: { userId },
		}),
	]);

	// --- Processamento dos Dados ---

	// 1. Cálculos dos KPIs
	const completedProjects = projects.filter(
		(p) => p.status === ProjectStatus.COMPLETED,
	);
	const totalRevenue = completedProjects.reduce((sum, p) => sum + p.price, 0);

	const pendingProjects = projects.filter(
		(p) => p.status === ProjectStatus.IN_PROGRESS,
	);
	const pendingRevenue = pendingProjects.reduce((sum, p) => sum + p.price, 0);

	const activeProjectsCount = pendingProjects.length;

	const averageProjectRevenue =
		completedProjects.length > 0 ? totalRevenue / completedProjects.length : 0;

	const completedTasksCount = tasks.filter(
		(t) => t.status === TaskStatus.COMPLETED,
	).length;
	const pendingTasksCount = tasks.filter(
		(t) => t.status !== TaskStatus.COMPLETED,
	).length;

	// 2. Projetos Recentes (vamos pegar os 5 mais recentes)
	const recentProjects = projects.slice(0, 5);

	const completedProjectsWithCompletionDate = projects.filter(
		(p) => p.status === ProjectStatus.COMPLETED && p.completionDate,
	);

	// 1 Faturamento por mês (últimos 6 meses)

	const monthlyRevenue = Array(6)
		.fill(0)
		.map((_, i) => {
			const date = new Date();
			date.setMonth(date.getMonth() - i);
			const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
			const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

			const revenue = completedProjectsWithCompletionDate
				.filter(
					(p) =>
						p.completionDate &&
						p.completionDate >= startOfMonth &&
						p.completionDate <= endOfMonth,
				)
				.reduce((sum, p) => sum + p.price, 0);

			const monthName = startOfMonth.toLocaleString("pt-BR", {
				month: "short",
			});

			return {
				name: monthName,
				total: revenue,
			};
		})
		.reverse();

	// 3. Progresso dos projetos em andamento
	const projectsWithProgress = pendingProjects.map((project) => {
		const totalTasks = project.tasks.length;
		const completedTasks = project.tasks.filter(
			(task) => task.status === TaskStatus.COMPLETED,
		).length;
		const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

		return {
			id: project.id,
			name: project.name,
			progress: Math.round(progress), // Arredondamos para um número inteiro
		};
	});

	return {
		stats: {
			totalRevenue,
			pendingRevenue,
			activeProjectsCount,
			clientCount,
			averageProjectRevenue,
			completedTasksCount,
			pendingTasksCount,
		},
		recentProjects,
		upcomingTasks,
		monthlyRevenue,
		projectsWithProgress,
	};
}
