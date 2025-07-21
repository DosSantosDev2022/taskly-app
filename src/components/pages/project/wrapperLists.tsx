"use client";

import type {
	Task as PrismaTask,
	Comment as PrismaComment,
} from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTask, AddComment } from "@/components/pages";
import { useProjectDetailsStore } from "@/store";
import { getStatusLabel, getStatusStyles } from "@/utils";
import { Button } from "@/components/ui";

// --- Tipagem de Dados ---
/**
 * @interface WrapperListsProps
 * @description Propriedades esperadas pelo componente WrapperLists.
 */
interface WrapperListsProps {
	projectId: string; // ID do projeto atual
	tasks: PrismaTask[]; // Lista de tarefas do Prisma
	comments: PrismaComment[]; // Lista de comentários do Prisma
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
// A função formatStatus foi mantida por ser usada no escopo do componente.
// No entanto, se `getStatusLabel` e `getStatusStyles` já esperam o status bruto do Prisma,
// esta função se torna redundante e pode ser removida. Vou mantê-la como está, mas com a observação.
const formatStatus = (status: PrismaTask["status"]): string => {
	switch (status) {
		case "PENDING":
			return "PENDENTE";
		case "IN_PROGRESS":
			return "EM_ANDAMENTO";
		case "COMPLETED":
			return "CONCLUÍDA";
		default:
			return status; // Retorna o próprio status caso não haja mapeamento
	}
};

/**
 * @component WrapperLists
 * @description Componente que agrupa e exibe as listas de imagens, tarefas e comentários
 * de um projeto específico. Permite adicionar e interagir com itens de cada lista.
 */
export function WrapperLists({
	tasks,
	comments,
	projectId,
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
					<CardTitle className="text-xl font-semibold">
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

			{/* Seção de Tarefas do Projeto */}
			<Card className="rounded-lg shadow-sm">
				<CardHeader>
					<div className="flex flex-col sm:flex-row border border-border rounded-md items-center justify-between p-3 gap-2">
						<CardTitle className="text-xl font-semibold mb-0 sm:mb-0">
							Tarefas do Projeto
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
									<span className="font-medium text-base truncate pr-2">
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
						<CardTitle className="text-xl font-semibold mb-0 sm:mb-0">
							Comentários do Projeto
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
									className="w-full flex flex-col items-start p-3 border rounded-md cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 text-left line-clamp-1"
									aria-label={`Visualizar comentário: ${comment.content.substring(0, 50)}...`}
								>
									<p className="text-sm text-foreground line-clamp-3">
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
