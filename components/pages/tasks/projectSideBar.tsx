// components/pages/tasks/projectSideBar.tsx
'use client';

import { Button } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import React, { type ChangeEvent, useState } from 'react';

// Definindo o tipo para um Projeto (se ainda não estiver em um types.ts separado)
export interface Project {
  id: string;
  name: string;
}

interface ProjectsSidebarProps {
  projects: Project[]; // Recebe a lista de projetos (agora vindo do componente pai)
  onProjectSelect?: (projectId: string) => void;
  selectedProjectId?: string | null;
}

export function ProjectsSidebar({ projects, onProjectSelect, selectedProjectId }: ProjectsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Lógica de filtragem dos projetos com base no searchTerm
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const myTeam = [
    { id: '1', name: 'Alice', img: 'https://via.placeholder.com/40' },
    { id: '2', name: 'Bob', img: 'https://via.placeholder.com/40' },
    { id: '3', name: 'Charlie', img: 'https://via.placeholder.com/40' },
    { id: '4', name: 'Diana', img: 'https://via.placeholder.com/40' },
    { id: '5', name: 'Eve', img: 'https://via.placeholder.com/40' },

  ]

  return (
    <nav className="space-y-2">
      <h2 className="text-xl font-semibold text-foreground mb-4">Meus Projetos</h2>
      <div className="mb-4">
        <Input
          placeholder='Buscar projeto...'
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>

      <div className='max-h-[calc(100vh-200px)] overflow-y-auto'>
        <ul className='space-y-1.5' >
          {filteredProjects.length === 0 ? (
            <li className="p-2 text-muted-foreground text-sm">Nenhum projeto encontrado.</li>
          ) : (
            filteredProjects.map((project) => (
              <li key={project.id}>
                <Button
                  sizes='xs'
                  variants={`${selectedProjectId === project.id
                    ? 'primary' // Estilo para projeto selecionado
                    : 'secondary' // Estilo padrão
                    }`}
                  onClick={() => onProjectSelect?.(project.id)} // Dispara a função para atualizar a URL
                  className="w-full text-left p-2 rounded-md transition-colors duration-200 truncate line-clamp-1"
                >
                  {project.name}
                </Button>
              </li>
            ))
          )}
        </ul>
      </div>



      <div className='mt-4 max-h-[calc(100vh-200px)] overflow-y-auto border'>
        <h2 className="text-xl font-semibold text-foreground mb-4">Minha equipe</h2>
        {/* lista com os integrantes da equipe referente ao projeto */}
        {myTeam.map((member) => (
          <div key={member.id} className='flex items-center gap-2 p-2 hover:bg-secondary/20 rounded-md transition-colors duration-200'>
            <Avatar>
              <AvatarImage src={member.img} alt={member.name} />
              <AvatarFallback />
            </Avatar>
            <span className='text-sm font-medium'>{member.name}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}