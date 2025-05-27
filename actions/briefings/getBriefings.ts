// app/actions/getBriefings.ts
'use server'

import type { BriefingFormValues } from '@/@types/briefingSchema'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getBriefings(): Promise<BriefingFormValues[]> {
  try {
    // Em um ambiente real, você faria:
    const briefings = await prisma.briefing.findMany({
      orderBy: {
        createdAt: 'desc', // Ou outro campo para ordenar
      },
    })
    return briefings as BriefingFormValues[] // Casting para o tipo Briefing
  } catch (error) {
    console.error('Erro ao buscar briefings:', error)
    // Em produção, você pode querer lançar um erro ou retornar um array vazio
    return []
  } finally {
    await prisma.$disconnect()
  }
}