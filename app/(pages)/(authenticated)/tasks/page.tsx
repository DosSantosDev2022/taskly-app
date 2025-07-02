// app/tasks/page.tsx
// Este é um Server Component. Ele não precisa de 'use client'.
import { fetchProjects } from "@/actions/project/fetchProjects"; // Sua função para buscar projetos
import { ProjectsSection } from "@/components/pages/tasks/projectsSection"; // Nosso Client Component principal

export default async function TasksPage() {
  // Buscando os projetos diretamente no servidor.
  // Isso é ideal para performance, pois os dados já vêm pré-renderizados.
  const { projects } = await fetchProjects();

  return (
    <div className="flex h-screen overflow-hidden">

      <ProjectsSection initialProjects={projects} />
    </div>
  );
}