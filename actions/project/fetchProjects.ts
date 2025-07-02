'use server';
import {db} from '@/lib/prisma'; 
import type { ProjectWithRelations } from '@/@types/prismaSchema';
import { Prisma, ProjectStatus } from '@prisma/client';

export type FetchProjectsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  ownerId?: string;
};

// Defina o tipo de retorno da Server Action
export type FetchProjectsResult = {
  projects: ProjectWithRelations[];
  total: number; // Total de projetos (para paginação)
};

export async function fetchProjects({
  page = 1, // Padrão para a primeira página
  pageSize = 10, // Padrão para 10 itens por página
  search,
  status,
  startDate,
  endDate,
  ownerId, // Adicione o ownerId para filtrar por proprietário
}: FetchProjectsParams = {}): Promise<FetchProjectsResult> { // Tipagem do retorno

  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

     // Use Prisma.ProjectWhereInput para tipagem segura
    const where: Prisma.ProjectWhereInput = {
      ownerId: ownerId, // Filtra projetos pertencentes ao ownerId fornecido
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
     // Filtro por status
    if (status) {
    const desiredStatuses = status.split(',').map(s => s.trim());
    const validStatuses: ProjectStatus[] = [];

    for (const s of desiredStatuses) {
      // Verifica se a string existe como uma chave no enum ProjectStatus
      if (Object.values(ProjectStatus).includes(s as ProjectStatus)) {
        validStatuses.push(s as ProjectStatus);
      } else {
        console.warn(`Status inválido '${s}' ignorado.`);
      }
    }

    if (validStatuses.length > 0) {
      where.status = { in: validStatuses };
    }
  }

    // FILTRO POR `dueDate`
    if (startDate || endDate) {
      where.dueDate = {}; // Inicializa o objeto dueDate para filtros gte/lte

      if (startDate) {
        (where.dueDate as Prisma.DateTimeFilter).gte = startDate;
      }
      if (endDate) {
        (where.dueDate as Prisma.DateTimeFilter).lte = endDate;
      }
    }

    // Buscar os projetos com paginação e filtros
    const projects = await db.project.findMany({
      skip,
      take,
      where,
      orderBy: {
        createdAt: 'desc', // Exemplo de ordenação
      },
      include: {
        client: true,
        owner: true,
        team: true,
         commentsProject: { 
          include: {
            user: true,
          },
        },
        tasks: true,
      },
    });

    // Contar o total de projetos para a paginação
    const total = await db.project.count({
      where, // Use os mesmos filtros para a contagem total
    });

    return {
      projects: projects as ProjectWithRelations[],
      total,
    };
  } catch (error) {
    console.error('Erro na Server Action fetchProjects:', error);
    // Lançar um erro para o TanStack Query capturar
    throw new Error('Falha ao carregar a lista de projetos.');
  }
}