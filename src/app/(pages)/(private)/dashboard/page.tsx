// src/app/dashboard/page.tsx

import { getDashboardData } from "@/lib/dashboard-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Package, Users, BarChart, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatPrice, getStatusLabelProject, getStatusVariant } from "@/utils";
import { TasksCalendar } from "@/components/pages/dashboard/tasks-calendar";
import { Button } from "@/components/ui";

export default async function DashboardPage() {
	const { stats, recentProjects, upcomingTasks } = await getDashboardData();

	return (
		// Container principal com mais preenchimento (padding)
		<div className="flex-1 space-y-8 p-8 pt-6">
			{/* 1. Header da Página */}
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
				<div className="flex items-center space-x-2">
					<Button>
						<PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Projeto
					</Button>
				</div>
			</div>

			{/* 2. KPIs em um Grid próprio */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
							Total de projetos concluídos
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Projetos em Andamento
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
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total de Clientes
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+{stats.clientCount}</div>
						<p className="text-xs text-muted-foreground">
							Clientes ativos na plataforma
						</p>
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
										<TableHead>Status</TableHead>
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
											<TableCell>
												<Badge variant={getStatusVariant(project.status)}>
													{getStatusLabelProject(project.status)}
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
