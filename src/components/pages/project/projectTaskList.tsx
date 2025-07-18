// src/app/projects/[id]/_components/ProjectTaskList.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { AddTask } from "@/components/pages"; // Importe o modal de adição de tarefas
import type { Task as PrismaTask } from "@prisma/client";

// Definição dos tipos para o frontend
type SelectedTask = {
	id: string;
	title: string;
	status: string;
	description: string | null;
};

interface ProjectTaskListProps {
	tasks: PrismaTask[];
	onSelectTask: (task: SelectedTask) => void; // Callback para o pai
}

const formatStatus = (status: PrismaTask["status"]) => {
	switch (status) {
		case "PENDING":
			return "Pendente";
		case "IN_PROGRESS":
			return "Em Andamento";
		case "COMPLETED":
			return "Concluída";
		default:
			return status;
	}
};

export function ProjectTaskList({ tasks, onSelectTask }: ProjectTaskListProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex border border-border rounded-md items-center justify-between p-3">
					<CardTitle>Tarefas do Projeto</CardTitle>
					<AddTask />
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{tasks.length > 0 ? (
						tasks.map((task) => (
							<div
								key={task.id}
								className="flex justify-between items-center p-3 border rounded-md cursor-pointer hover:bg-muted"
								onClick={() =>
									onSelectTask({
										id: task.id,
										title: task.title,
										status: formatStatus(task.status),
										description: task.description,
									})
								}
							>
								<span className="font-medium">{task.title}</span>
								<span className="text-sm text-muted-foreground">
									{formatStatus(task.status)}
								</span>
							</div>
						))
					) : (
						<p className="text-center text-muted-foreground">
							Nenhuma tarefa cadastrada.
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
