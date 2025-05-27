'use server'; // <-- ESSENCIAL: Declara que este arquivo é uma Server Action

import {db} from '@/lib/prisma'; // Importe sua instância do Prisma
import type { Project } from '@/@types/prismaSchema'; // Seu tipo Project

// Defina o tipo para os parâmetros da query de paginação
// Remova baseUrl, cache, revalidate, pois são para fetch HTTP
export type FetchProjectsParams = {
  page?: number;
  pageSize?: number;
  // Adicione outros filtros que você usa na sua paginação
  search?: string;
  status?: string;
  // etc.
};

// Defina o tipo de retorno da Server Action
export type FetchProjectsResult = {
  projects: Project[];
  total: number; // Total de projetos (para paginação)
};

export async function fetchProjects({
  page = 1, // Padrão para a primeira página
  pageSize = 10, // Padrão para 10 itens por página
  search,
  status,
  // ... outros filtros
}: FetchProjectsParams = {}): Promise<FetchProjectsResult> { // Tipagem do retorno

  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Construa o objeto 'where' com base nos filtros
    const where: any = {}; // Use 'any' temporariamente ou defina um tipo mais específico para 'where'
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status; // Assumindo que ProjectStatus é um enum ou string
    }
    // Adicione mais filtros conforme necessário

    // Buscar os projetos com paginação e filtros
    const projects = await db.project.findMany({
      skip,
      take,
      where,
      orderBy: {
        createdAt: 'desc', // Exemplo de ordenação
      },
      include: {
        // Inclua as relações que seu frontend precisa para a tabela
        // Exemplo: client, owner, team
        client: true,
        owner: true,
        team: true,
        // Não inclua tudo aqui se a tabela não precisar; inclua apenas o necessário para performance.
        // Se a tabela só mostra nome e status, não precisa de tasks, comments, etc.
      },
    });

    // Contar o total de projetos para a paginação
    const total = await db.project.count({
      where, // Use os mesmos filtros para a contagem total
    });

    return {
      projects: projects as Project[],
      total,
    };
  } catch (error) {
    console.error('Erro na Server Action fetchProjects:', error);
    // Lançar um erro para o TanStack Query capturar
    throw new Error('Falha ao carregar a lista de projetos.');
  }
}