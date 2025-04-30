import { db } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_reques:Request, {params}: {params: {id : string}}) {
   const {id} = params
   
   if(!id) {
    return NextResponse.json({error: 'id do projeto não fornecido, verifique !'})
   }

   const project = await db.project.findUnique({
    where: { id },
    include: {
      team: true,
      client: true,
      comments: {
        include: {
          user: true,       // (Opcional: para pegar informações de quem comentou)
          Project: true,    // (Opcional: para garantir a referência ao projeto)
        }
      },
      owner: true,
      sharedWith: true,
      tasks: {
        include: {
          comments: true,
          tags: true,
          subTasks: true,
          owner: true,
          TimeTracking: true,
          project: true,
          team: true,
        }
      }
    }
  })

   if(!project) {
    throw new Error ('Erro ao buscar projeto, verifique !')
   }

   return NextResponse.json(project)
}