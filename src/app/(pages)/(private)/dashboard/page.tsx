// src/app/dashboard/page.tsx

import { RevenueChart } from "@/components/pages/dashboard/revenue-chart";
import { TasksCalendar } from "@/components/pages/dashboard/tasks-calendar";
import { Progress } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getDashboardData } from "@/lib/dashboard-data";
import {
	formatPrice,
	getProjectStatusLabel,
	getProjectStatusVariant,
} from "@/utils";
import { ClipboardCheck, DollarSign, Package, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
	const {
		stats,
		recentProjects,
		upcomingTasks,
		monthlyRevenue,
		projectsWithProgress,
	} = await getDashboardData();

	return (
		<div className="flex-1 space-y-8 p-8 pt-6">
			{/* 1. Header da Página */}
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
			</div>

			{/* 2. KPIs em um Grid próprio */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{/* Card de Faturamento Total */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Faturamento Total
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatPrice(stats.totalRevenue)}
						</div>
						<p className="text-xs text-muted-foreground">
							De {stats.activeProjectsCount} projetos concluídos
						</p>
					</CardContent>
				</Card>

				{/* Card de Faturamento Médio por Projeto */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Valor Médio do Projeto
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatPrice(stats.averageProjectRevenue)}
						</div>
						<p className="text-xs text-muted-foreground">
							Média de todos os projetos concluídos
						</p>
					</CardContent>
				</Card>

				{/* Card de Projetos em Andamento */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Projetos Ativos
						</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							+{stats.activeProjectsCount}
						</div>
						<p className="text-xs text-muted-foreground">
							Faturamento pendente: {formatPrice(stats.pendingRevenue)}
						</p>
					</CardContent>
				</Card>

				{/* Card de Tarefas */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total de Tarefas
						</CardTitle>
						<ClipboardCheck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.completedTasksCount} /{" "}
							{stats.completedTasksCount + stats.pendingTasksCount}
						</div>
						<p className="text-xs text-muted-foreground">
							Tarefas concluídas / Total
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="lg:col-span-1 flex flex-col gap-8">
				{/* Card de Faturamento Mensal (para um gráfico de barras) */}
				<RevenueChart data={monthlyRevenue} />

				{/* Card de Progresso dos Projetos */}
				<Card className="bg-card/20">
					<CardHeader>
						<CardTitle>Progresso dos Projetos</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{projectsWithProgress.map((project) => (
							<div key={project.id} className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="font-medium text-sm">{project.name}</span>
									<span className="text-sm text-muted-foreground">
										{project.progress}%
									</span>
								</div>
								<Progress value={project.progress} className="h-2" />
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* 3. Grid Principal do Conteúdo (Calendário e Projetos) */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Coluna Principal (Esquerda) - 2/3 da largura em telas grandes */}
				<div className="lg:col-span-2">
					<TasksCalendar tasks={upcomingTasks} />
				</div>

				{/* Coluna Secundária (Direita) - 1/3 da largura em telas grandes */}
				<div className="lg:col-span-1">
					<Card className="bg-card/20">
						<CardHeader>
							<CardTitle>Projetos Recentes</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Projeto</TableHead>
										<TableHead className="text-right">Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentProjects.map((project) => (
										<TableRow key={project.id}>
											<TableCell>
												<div className="font-medium">{project.name}</div>
												<div className="text-sm text-muted-foreground">
													{project.client?.name}
												</div>
											</TableCell>
											<TableCell className="text-right">
												<Badge
													variant={getProjectStatusVariant(project.status)}
												>
													{getProjectStatusLabel(project.status)}
												</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
