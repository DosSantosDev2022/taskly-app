"use client";

import type {
	Task as PrismaTask,
	Comment as PrismaComment,
} from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTask, AddComment } from "@/components/pages";
import { useProjectDetailsStore } from "@/store";
import {
	formatDate,
	formatStatus,
	getStatusLabel,
	getStatusStyles,
} from "@/utils";
import { Button, Progress } from "@/components/ui";
import { ClipboardList, Image, MessageCircleMore } from "lucide-react";

// --- Tipagem de Dados ---
/**
 * @interface WrapperListsProps
 * @description Propriedades esperadas pelo componente WrapperLists.
 */
interface WrapperListsProps {
	projectId: string; // ID do projeto atual
	tasks: PrismaTask[]; // Lista de tarefas do Prisma
	comments: PrismaComment[]; // Lista de comentários do Prisma
	projectProgress: number;
}

// --- Funções Utilitárias Locais (se necessário, podem ser movidas para 'utils') ---
/**
 * @function formatStatus
 * @description Converte o status da tarefa do formato do Prisma para um formato legível/usável.
 * @param {PrismaTask["status"]} status - O status da tarefa do Prisma.
 * @returns {string} O status formatado.
 * @deprecated Considerar mover esta lógica para `getStatusLabel` e `getStatusStyles` diretamente
 * se as funções utilitárias já estiverem lidando com os valores brutos do Prisma.
 */

/**
 * @component WrapperLists
 * @description Componente que agrupa e exibe as listas de imagens, tarefas e comentários
 * de um projeto específico. Permite adicionar e interagir com itens de cada lista.
 */
export function WrapperLists({
	tasks,
	comments,
	projectId,
	projectProgress,
}: WrapperListsProps) {
	// --- Estados e Funções do Zustand Store ---
	// Seleciona as ações `selectTask` e `selectComment` do store Zustand.
	// Essas ações são usadas para definir a tarefa ou comentário selecionado no estado global,
	// geralmente para exibição em um modal de detalhes/edição.
	const selectTask = useProjectDetailsStore((state) => state.selectTask);
	const selectComment = useProjectDetailsStore((state) => state.selectComment);

	// --- Renderização do Componente ---
	return (
		// biome-ignore lint/a11y/useAriaPropsSupportedByRole: <explanation>
		<div className="space-y-4" aria-label="Seções de detalhes do projeto">
			{/* Seção de Imagens do Projeto */}
			<Card className="rounded-lg shadow-sm">
				<CardHeader>
					<CardTitle className="flex items-center gap-1 text-xl font-semibold">
						<Image />
						Imagens do Projeto
					</CardTitle>
				</CardHeader>
				<CardContent className="py-8 text-center text-muted-foreground">
					<p>
						Esta seção pode ser preenchida com imagens e arquivos do projeto.
					</p>
					{/* Futuramente, adicione um componente de upload/galeria de imagens aqui */}
				</CardContent>
			</Card>

			<Card>
				{/* Barra de Progresso do Projeto */}
				<div className="p-4">
					<span className="font-bold text-foreground mr-2 text-base">
						Progresso:
					</span>
					<Progress
						className="h-5 bg-gray-200 dark:bg-gray-700 [&>div]:bg-green-500" // Adicionado cores para a barra de progresso
						value={projectProgress}
						showValue={true} // Assume que `Progress` suporta esta prop para mostrar o valor em porcentagem
						aria-label={`Progresso do projeto: ${projectProgress}%`} // Acessibilidade
					/>
				</div>
			</Card>

			{/* Seção de Tarefas do Projeto */}
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
					{/** biome-ignore lint/a11y/useAriaPropsSupportedByRole: <explanation> */}
					<div
						className="space-y-2 max-h-96 overflow-y-auto scrollbar-custom p-1"
						aria-label="Lista de tarefas do projeto"
					>
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
									{/** biome-ignore lint/a11y/useAriaPropsSupportedByRole: <explanation> */}
									<span
										className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${getStatusStyles(formatStatus(task.status))}
                    `}
										aria-label={`Status: ${getStatusLabel(formatStatus(task.status))}`}
									>
										{getStatusLabel(formatStatus(task.status))}
									</span>
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

			{/* Seção de Comentários do Projeto */}
			<Card className="rounded-lg shadow-sm">
				<CardHeader>
					<div className="flex flex-col sm:flex-row border border-border rounded-md items-center justify-between p-3 gap-2">
						<CardTitle className="flex items-center gap-1 text-xl font-semibold mb-0 sm:mb-0">
							<MessageCircleMore />
							Comentários
						</CardTitle>
						<AddComment projectId={projectId} />
					</div>
				</CardHeader>
				<CardContent className="pt-4">
					{/** biome-ignore lint/a11y/useAriaPropsSupportedByRole: <explanation> */}
					<div
						className="space-y-2 max-h-96 overflow-y-auto scrollbar-custom p-1"
						aria-label="Lista de comentários do projeto"
					>
						{comments && comments.length > 0 ? (
							comments.map((comment) => (
								<Button
									key={comment.id}
									variant={"ghost"}
									onClick={() => selectComment(comment)}
									className="w-full h-14 flex flex-col items-center border rounded-md cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 text-left line-clamp-1"
									aria-label={`Visualizar comentário: ${comment.content.substring(0, 50)}...`}
								>
									<span className="text-xs font-light text-muted-foreground">
										<span className="text-bold text-foreground">
											Comentado em:
										</span>{" "}
										{formatDate(comment.createdAt)}
									</span>
									<p className="text-sm text-muted-foreground truncate line-clamp-2">
										{comment.content}
									</p>
								</Button>
							))
						) : (
							<p className="text-center text-muted-foreground py-4">
								Nenhum comentário cadastrado para este projeto.
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
