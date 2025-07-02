'use server'

import { db } from "@/lib/prisma";

// Adicione as includes necessárias para trazer o client, owner, team, tasks e comments
export async function fetchProjectId(projectId: string) {
  // Use Prisma aqui ou sua ORM/lib de acesso a dados
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      client: true,
      owner: true,
      team: true,
      sharedWith: true,
      tasks: { // Adicione os includes de tasks aqui para bater com seu tipo Project
          include: {
            commentsTask: true,
            tags: true,
            subTasks: true,
            owner: true,
            TimeTracking: true,
            project: true,
            team: true
          }
        },
      commentsProject: {
        include: {
          user: true,
          Project: true
        },
      },
    },
  });

  if (!project) {
    throw new Error('Projeto não encontrado');
  }
  return project;
}