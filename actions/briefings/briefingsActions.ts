// src/app/actions.ts
'use server';
import { briefingSchema, type BriefingFormValues } from '@/@types/briefingSchema';
import { ZodError } from 'zod';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';


  // ação para salvar um novo briefings
export async function saveBriefing(formData: BriefingFormValues) {
  try {
    const validatedData = briefingSchema.parse(formData);

    // 2. Salvando no Banco de Dados
    await db.briefing.create({
      data: {
        companyName: validatedData.companyName,
        cnpj: validatedData.cnpj,
        projectLead: validatedData.projectLead,
        phoneNumberWhatsapp: validatedData.phoneNumberWhatsapp,
        email: validatedData.email,
        address: validatedData.address,
        instagram: validatedData.instagram,
        facebook: validatedData.facebook,
        linkedin: validatedData.linkedin,
        currentWebsite: validatedData.currentWebsite,
        businessDescription: validatedData.businessDescription,
        mainProductsServices: validatedData.mainProductsServices,
        businessDifferentiator: validatedData.businessDifferentiator,
        targetAudience: validatedData.targetAudience,
        websiteObjectives: validatedData.websiteObjectives,
        otherWebsiteObjective: validatedData.otherWebsiteObjective,
        websiteExpectation: validatedData.websiteExpectation,
        essentialFeatures: validatedData.essentialFeatures || '',
        hasContent: validatedData.hasContent,
        websitePages: validatedData.websitePages,
        otherWebsitePages: validatedData.otherWebsitePages,
        hasLogoIdentity: validatedData.hasLogoIdentity,
        referenceLink1: validatedData.referenceLink1,
        whatLikedAboutLink1: validatedData.whatLikedAboutLink1,
        referenceLink2: validatedData.referenceLink2,
        whatLikedAboutLink2: validatedData.whatLikedAboutLink2,
        referenceLink3: validatedData.referenceLink3,
        whatLikedAboutLink3: validatedData.whatLikedAboutLink3,
        preferredColors: validatedData.preferredColors,
        desiredStyle: validatedData.desiredStyle,
        otherDesiredStyle: validatedData.otherDesiredStyle,
        hasDomain: validatedData.hasDomain,
        hasHosting: validatedData.hasHosting,
        desiredDeadline: validatedData.desiredDeadline,
        hasDefinedBudget: validatedData.hasDefinedBudget,
        budgetRange: validatedData.budgetRange,
        howDidYouHear: validatedData.howDidYouHear,
        otherHowDidYouHear: validatedData.otherHowDidYouHear,
        additionalObservations: validatedData.additionalObservations,
      },
    });
    return { success: true, message: 'Briefing enviado com sucesso!' };
  } catch (error) {
    if (error instanceof ZodError) {
      // Erro de validação Zod
      console.error('Validation error:', error.errors);
      return { success: false, message: 'Dados inválidos.', errors: error.flatten().fieldErrors };
    }
   
    return { success: false, message: 'Ocorreu um erro ao salvar o briefing.' };
  } finally {
    await db.$disconnect();
  }
}

// ação para buscar lista de briefings
export async function getBriefings(): Promise<BriefingFormValues[]> {
  try {
    // Em um ambiente real, você faria:
    const briefings = await db.briefing.findMany({
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
    await db.$disconnect()
  }
}

export async function deleteBriefings (briefingId: string):Promise<{success:boolean, error?: string}> {
   try {
     await db.briefing.delete({
      where : {
        id: briefingId
      }
     })
     revalidatePath('/briefings')
     return {success: true}
   } catch(error) {
     console.error('Erro ao deletar briefing !', error);
     return {success: false, error: 'Ocorreu um erro ao deletar a anotação.'}
   }
}