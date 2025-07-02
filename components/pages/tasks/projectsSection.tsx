// components/pages/tasks/projectsSection.tsx
'use client'; // Importante: marca este como um Client Component

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Hooks do Next.js para URL
import { ProjectsSidebar, type Project } from '@/components/pages/tasks/projectSideBar';
import { TasksDisplay } from '@/components/pages/tasks/tasksDisplay';
import { ActionTasks } from './actionsTasks';

interface ProjectsSectionProps {
  initialProjects: Project[]; // Recebemos os projetos do Server Component pai
}

export function ProjectsSection({ initialProjects }: ProjectsSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtém o valor do 'projectId' do URL Search Param.
  // Será 'null' se 'projectId' não estiver presente na URL.
  const selectedProjectId = searchParams.get('projectId');

  // Esta função é chamada quando um projeto é clicado na sidebar.
  const handleProjectSelect = (projectId: string) => {
    // Cria uma nova instância de URLSearchParams a partir da URL atual.
    const params = new URLSearchParams(searchParams.toString());
    // Define ou atualiza o 'projectId' no objeto de search params.
    params.set('projectId', projectId);

    // Usa router.push para atualizar a URL. Isso não recarrega a página,
    // mas faz com que o 'TasksDisplay' reaja à mudança do 'projectId' na URL.
    router.push(`?${params.toString()}`);
  };

  return (
    <>

      {/* Sidebar para a lista de projetos */}
      <aside className="w-full md:w-1/4 lg:w-1/5 border-r border-border bg-secondary/10 p-4 overflow-y-auto">
        <ProjectsSidebar
          projects={initialProjects} // Passa a lista de projetos para o sidebar
          onProjectSelect={handleProjectSelect} // Passa a função para atualizar a URL
          selectedProjectId={selectedProjectId} // Passa o ID do projeto atualmente selecionado (da URL)
        />
      </aside>

      {/* Área principal para exibir as tarefas */}
      <main className="flex-1 overflow-y-auto p-4 bg-secondary/20">
        <ActionTasks projectId={selectedProjectId} />
        <TasksDisplay projectId={selectedProjectId} />
      </main>
    </>
  );
}