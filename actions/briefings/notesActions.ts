// app/actions/notes.ts
'use server'

import { db } from '@/lib/prisma' // Certifique-se de que seu client Prisma está configurado
import { revalidatePath } from 'next/cache'

// Definindo a interface para o tipo Note para ser usada no frontend
export interface Note {
  id: string
  createdAt: Date
  content: string
  briefingId: string
}

/**
 * Adiciona uma nova anotação a um briefing específico.
 * @param briefingId O ID do briefing ao qual a anotação será adicionada.
 * @param content O conteúdo da anotação.
 * @returns A anotação criada ou null em caso de erro.
 */
export async function addNote(briefingId: string, content: string): Promise<Note | null> {
  try {
    const newNote = await db.note.create({
      data: {
        briefingId,
        content,
      },
    })
    // Revalida o path para garantir que o cache seja atualizado e as anotações apareçam imediatamente
    revalidatePath(`/briefings/${briefingId}`) // Ajuste o path conforme sua rota
    return newNote
  } catch (error) {
    console.error('Erro ao adicionar anotação:', error)
    return null
  }
}

/**
 * Busca todas as anotações para um briefing específico.
 * @param briefingId O ID do briefing.
 * @returns Um array de anotações.
 */
export async function getNotesByBriefingId(briefingId: string): Promise<Note[]> {
  try {
    const notes = await db.note.findMany({
      where: {
        briefingId,
      },
      orderBy: {
        createdAt: 'asc', // Ordena as anotações por data de criação
      },
    })
    return notes
  } catch (error) {
    console.error('Erro ao buscar anotações:', error)
    return []
  }
}

/**  
 * Deleta as anotações de um briefing específico
 * @param briefingId O ID do briefing ao qual a anotação pertence
 * @param noteId  noteId O ID da anotação a ser deletada.
 * @returns Um objeto indicando sucesso ou erro.
*/

export async function deleteNote(briefingId:string, noteId: string): Promise<{success:boolean, error?: string}> {
   try {
      await db.note.delete({
        where: {
          id: noteId,
          briefingId: briefingId
        }
      })

      revalidatePath(`/briefings/${briefingId}`)
      return {success: true}
   } catch(error) {
     console.error(`Erro ao deletar anotação ${noteId} bo briefing ${briefingId}`)
     return {success: false, error: 'Ocorreu um erro ao deletar a anotação.'}
   }
}