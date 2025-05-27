// src/app/actions.ts
'use server';

import { PrismaClient } from '@prisma/client';
import { briefingSchema, type BriefingFormValues } from '@/@types/briefingSchema';
import { ZodError } from 'zod';

const prisma = new PrismaClient();

export async function saveBriefing(formData: BriefingFormValues) {
  try {
    // 1. Validação dos dados com Zod
    // Usamos o schema Zod diretamente aqui para garantir que os dados recebidos
    // pela Server Action estão no formato esperado antes de interagir com o DB.
    const validatedData = briefingSchema.parse(formData);

    // 2. Salvando no Banco de Dados
    const briefing = await prisma.briefing.create({
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
        additionalObservations: validatedData.additionalObservations
      },
    });

    console.log('Briefing saved:', briefing);
    return { success: true, message: 'Briefing enviado com sucesso!' };
  } catch (error) {
    if (error instanceof ZodError) {
      // Erro de validação Zod
      console.error('Validation error:', error.errors);
      return { success: false, message: 'Dados inválidos.', errors: error.flatten().fieldErrors };
    }
    // Outros erros (ex: erro de banco de dados)
    console.error('Failed to save briefing:', error);
    return { success: false, message: 'Ocorreu um erro ao salvar o briefing.' };
  } finally {
    await prisma.$disconnect(); // Boas práticas: desconectar o Prisma no final
  }
}