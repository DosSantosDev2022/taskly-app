// actions/task/fetchTasks.ts
'use server'; // Marca o arquivo como Server Action

import type { Task } from '@/@types/prismaSchema';
import { db } from '@/lib/prisma'; // Importa a instância do Prisma Client

export async function fetchTasksByProjectIdServerAction(projectId: string): Promise<Task[]> {
  console.log(`[Server Action] Buscando tarefas para o projeto: ${projectId}`);

  try {
    // Validação básica do projectId. Em produção, você pode querer mais robustez.
    if (!projectId) {
      // Se não houver projectId, retorna um array vazio.
      // Ou você pode lançar um erro, dependendo do comportamento desejado.
      return [];
    }

    // Busca as tarefas no banco de dados usando Prisma
    const tasks = await db.task.findMany({
      where: {
        projectId: projectId,
      },
      // Você pode adicionar include aqui para trazer dados relacionados, se necessário.
      // Por exemplo: include: { project: true }
      orderBy: {
        createdAt: 'asc', // Ordena as tarefas, por exemplo, pela data de criação
      },
    });

    // O Prisma retorna o enum como "TO_DO", "IN_PROGRESS", "DONE".
    // Se seu frontend espera "to_do", "in_progress", "done", você pode mapear aqui.
    // Exemplo:
    const formattedTasks = tasks.map(task => ({
      ...task,
      status: task.status.toLowerCase().replace('_', '-') as 'to_do' | 'in_progress' | 'done', // Ajusta o tipo para corresponder ao frontend
    }));

    return formattedTasks as Task[]; // Retorna as tarefas encontradas
  } catch (error) {
    console.error(`Erro ao buscar tarefas para o projeto ${projectId}:`, error);
    // Em produção, você pode lançar um erro mais específico ou tratá-lo de forma diferente.
    // Lançar um erro aqui fará com que o `isError` e `error` do React Query sejam ativados.
    throw new Error('Falha ao buscar tarefas. Por favor, tente novamente.');
  }
}