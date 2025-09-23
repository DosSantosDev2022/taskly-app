// src/components/pages/project/ProjectTasksList.tsx
"use client";

import { AddTask } from "@/components/pages/project";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectDetailsStore } from "@/store";
import { getTaskStatusLabel, getTaskStatusVariant } from "@/utils";
import type { Task as PrismaTask } from "@prisma/client";
import { ClipboardList } from "lucide-react";

interface ProjectTasksListProps {
	projectId: string;
	tasks: PrismaTask[];
}

const TasksList = ({ projectId, tasks }: ProjectTasksListProps) => {
	const selectTask = useProjectDetailsStore((state) => state.selectTask);

	return (
		<Card className="rounded-lg shadow-sm">
			<CardHeader>
				<div className="flex flex-col sm:flex-row border border-border rounded-md items-center justify-between p-3 gap-2">
					<CardTitle className="flex items-center gap-1 text-xl font-semibold mb-0 sm:mb-0">
						<ClipboardList />
						Tarefas
					</CardTitle>
					<AddTask projectId={projectId} />
				</div>
			</CardHeader>
			<CardContent className="pt-4">
				<div className="space-y-2 max-h-96 overflow-y-auto scrollbar-custom p-1">
					{tasks && tasks.length > 0 ? (
						tasks.map((task) => (
							<Button
								key={task.id}
								variant={"ghost"}
								onClick={() => selectTask(task)}
								className="w-full flex justify-between items-center p-3 border rounded-md cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1"
								aria-label={`Editar tarefa: ${task.title}`}
							>
								<span className="font-light text-sm truncate pr-2 text-muted-foreground">
									{task.title}
								</span>
								<Badge variant={getTaskStatusVariant(task.status)}>
									{getTaskStatusLabel(task.status)}
								</Badge>
							</Button>
						))
					) : (
						<p className="text-center text-muted-foreground py-4">
							Nenhuma tarefa cadastrada para este projeto.
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export { TasksList };
