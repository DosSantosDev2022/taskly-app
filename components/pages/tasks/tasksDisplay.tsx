// components/pages/tasks/tasksDisplay.tsx
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTasksByProjectIdServerAction } from '@/actions/task/fetchTasks'; // Sua função que simula a API
import { TaskCard } from './taskCard';
import type { Task } from '@/@types/prismaSchema';


interface TasksDisplayProps {
  projectId?: string | null; // Recebe o ID do projeto, que vem da URL
}

export function TasksDisplay({ projectId }: TasksDisplayProps) {
  const { data: tasks, isLoading, isError, error } = useQuery<Task[], Error>({
    queryKey: ['tasks', projectId],
    queryFn: async () => { // Marcar como async pois a Server Action é async
      if (!projectId) {
        return [];
      }
      // Chama a Server Action
      const fetchedTasks = await fetchTasksByProjectIdServerAction(projectId);
      // Aqui não precisamos mais do .map, pois a Server Action já formatou o status
      return fetchedTasks;
    },
    enabled: !!projectId,
  });

  // Exibição condicional com base nos estados do React Query
  if (isLoading) {
    return (
      <div className="text-center p-8 text-gray-600 dark:text-gray-300">
        <p className="text-lg font-medium">Carregando tarefas do projeto...</p>
        {/* Considere adicionar um spinner ou skeleton loader aqui */}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-red-600 dark:text-red-400">
        <p className="text-lg font-medium">Erro ao carregar tarefas: {error?.message}</p>
      </div>
    );
  }

  // Mensagem inicial se nenhum projeto estiver selecionado ou se não houver tarefas
  if (!projectId || !tasks || tasks.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 dark:text-gray-400">
        <p className="text-lg">Selecione um projeto na barra lateral para ver suas tarefas.</p>
      </div>
    );
  }

  // Filtragem das tarefas pelos seus status
  const todoTasks = tasks?.filter(task => task.status === 'to_do') || []; // Usar 'to_do'
  const inProgressTasks = tasks?.filter(task => task.status === 'in_progress') || []; // Usar 'in_progress'
  const doneTasks = tasks?.filter(task => task.status === 'done') || []; // Usar 'done'


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6">
        Tarefas do Projeto
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna A Fazer */}
        <div className="bg-secondary/20 rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">A Fazer ({todoTasks.length})</h2>
          <div className="space-y-3">
            {todoTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhuma tarefa para fazer.</p>
            ) : (
              todoTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>

        {/* Coluna Em Andamento */}
        <div className="bg-secondary/20 rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Em Andamento ({inProgressTasks.length})</h2>
          <div className="space-y-3">
            {inProgressTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhuma tarefa em andamento.</p>
            ) : (
              inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>

        {/* Coluna Concluído */}
        <div className="bg-secondary/20 rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Concluído ({doneTasks.length})</h2>
          <div className="space-y-3">
            {doneTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhuma tarefa concluída.</p>
            ) : (
              doneTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}