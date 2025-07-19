// src/app/projects/[id]/_components/WrapperLists.tsx
"use client";

import type {
	Task as PrismaTask,
	Comment as PrismaComment,
} from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AddTask, AddComment } from "@/components/pages";
import { useProjectDetailsStore } from "@/store";
import { getStatusLabel, getStatusStyles } from "@/utils";

interface WrapperListsProps {
	projectId: string;
	tasks: PrismaTask[];
	comments: PrismaComment[];
}

const formatStatus = (status: PrismaTask["status"]) => {
	switch (status) {
		case "PENDING":
			return "PENDENTE";
		case "IN_PROGRESS":
			return "EM_ANDAMENTO";
		case "COMPLETED":
			return "CONCLUÍDA";
		default:
			return status;
	}
};

export function WrapperLists({
	tasks,
	comments,
	projectId,
}: WrapperListsProps) {
	// Use a função do store para selecionar a tarefa/comentário
	const selectTask = useProjectDetailsStore((state) => state.selectTask);
	const selectComment = useProjectDetailsStore((state) => state.selectComment);

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Imagens do Projeto</CardTitle>
				</CardHeader>
				<CardContent className="py-8 text-center text-muted-foreground">
					Esta seção pode ser preenchida com imagens do projeto.
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex border border-border rounded-md items-center justify-between p-3">
						<CardTitle>Tarefas do Projeto</CardTitle>
						<AddTask projectId={projectId} />
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-2 max-h-96 overflow-y-auto scrollbar-custom p-1">
						{tasks && tasks.length > 0 ? (
							tasks.map((task) => (
								<div
									key={task.id}
									className="flex justify-between items-center p-3 border rounded-md cursor-pointer hover:bg-muted"
									onClick={() => selectTask(task)} // Chama a ação do store
								>
									<span className="font-medium">{task.title}</span>
									<span
										className={`
										inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
										${getStatusStyles(formatStatus(task.status))}
										`}
									>
										{getStatusLabel(formatStatus(task.status))}
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

			<Card>
				<CardHeader>
					<div className="flex border border-border rounded-md items-center justify-between p-3">
						<CardTitle>Comentários do Projeto</CardTitle>
						<AddComment projectId={projectId} />
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{comments && comments.length > 0 ? (
							comments.map((comment) => (
								<div
									key={comment.id}
									className="flex justify-between items-center p-3 border rounded-md cursor-pointer hover:bg-muted"
									onClick={() => selectComment(comment)} // Chama a ação do store
								>
									<p className="text-sm text-muted-foreground line-clamp-3">
										{comment.content}
									</p>
								</div>
							))
						) : (
							<p className="text-center text-muted-foreground">
								Nenhum comentário cadastrado.
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
