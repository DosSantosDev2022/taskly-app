// actions/client/list.ts (ou actions/client.ts)
'use server'; // <-- ESSENCIAL: Declara que este arquivo é uma Server Action

import {db} from '@/lib/prisma'; // Importe sua instância do Prisma
import type { Client } from '@/@types/prismaSchema'; // Seu tipo Client

// Defina o tipo para os parâmetros da query de paginação/filtro
// Não precisamos mais de 'baseUrl', 'cache', 'revalidade', pois são para fetch HTTP
export type FetchClientsParams = {
  page?: number;
  pageSize?: number;
  search?: string; // Exemplo de filtro por nome do cliente
  status?: string
  city?: string
  state?:string
  // Adicione outros filtros se necessário
};

// Defina o tipo de retorno da Server Action
// Será mais simples, contendo apenas os dados de sucesso, pois a Server Action lançará erro em caso de falha.
export type FetchClientsResult = {
  clients: Client[];
  total: number; // Total de clientes para paginação
};

export async function fetchClients({
  page = 1,
  pageSize = 10,
  search,
  status,
  city,
  state
  // ... outros filtros
}: FetchClientsParams = {}): Promise<FetchClientsResult> {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Construa o objeto 'where' com base nos filtros
    const where: any = {}; // Use 'any' temporariamente ou defina um tipo mais específico
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive', // Para busca case-insensitive
      };
    }
    // Adicione mais filtros conforme necessário
    if(status) {
      where.status = status
    }

    if(city) {
      where.city = city
    }

    if(state) {
      where.state = state
    }

    // Buscar os clientes com paginação e filtros diretamente com Prisma
    const clients = await db.client.findMany({
      skip,
      take,
      where,
      orderBy: {
        name: 'asc', // Exemplo de ordenação por nome
      },
      include: {
        // Se o seu tipo `Client` em @/@types/prismaSchema.ts inclui `projects`,
        // inclua `projects: true` aqui para que os tipos batam e você possa exibir esses dados se necessário.
        projects: true,
      },
    });

    // Contar o total de clientes com os mesmos filtros
    const total = await db.client.count({
      where,
    });

    return {
      clients: clients as Client[], // Garanta a tipagem correta
      total,
    };
  } catch (error) {
    console.error('Erro na Server Action fetchClients:', error);
    // Lance um erro para o TanStack Query ou o Next.js capturarem e exibirem.
    throw new Error('Falha ao carregar a lista de clientes.');
  }
}