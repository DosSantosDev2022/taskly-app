// src/schemas/briefingSchema.ts
import { z } from 'zod';

export const noteSchema = z.object({
  id: z.string().optional(), // Gerado pelo Prisma
  createdAt: z.date().optional(), // Gerado pelo Prisma
  content: z.string().min(1, 'Note content cannot be empty.'),
  briefingId: z.string().uuid(), // ID do briefing ao qual esta nota pertence
});

export type NoteFormValues = z.infer<typeof noteSchema>;

export const briefingSchema = z.object({
  // 1. Company Information
  id: z.string().optional(),
  companyName: z.string().min(1, 'Company name is required.'),
  cnpj: z.string().optional().or(z.literal('')), // Optional
  projectLead: z.string().min(1, 'Project lead is required.'),
  phoneNumberWhatsapp: z.string().min(1, 'Phone/WhatsApp number is required.'),
  email: z.string().email('Invalid email address.').min(1, 'Email is required.'),
  address: z.string().optional().or(z.literal('')), // Making optional as per Prisma
  instagram: z.string().url('Invalid URL.').optional().or(z.literal('')),
  facebook: z.string().url('Invalid URL.').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL.').optional().or(z.literal('')),
  currentWebsite: z.string().url('Invalid URL.').optional().or(z.literal('')),

  // 2. About the Business
  businessDescription: z.string().min(1, 'Business description is required.'),
  mainProductsServices: z.string().min(1, 'Main products/services are required.'),
  businessDifferentiator: z.string().min(1, 'Business differentiator is required.'),
  targetAudience: z.string().min(1, 'Target audience is required.'),
  websiteObjectives: z.array(z.enum(['Vender produtos (e-commerce)', 'Captar leads', 'Divulgar serviços', 'Ter presença online', 'Outro'])),
  otherWebsiteObjective: z.string().optional(), // Conditional field for "Outro"

  // 3. Website Goal
  websiteExpectation: z.string().min(1, 'Website expectation is required.'),
  essentialFeatures: z.string().optional().or(z.literal('')), // Making optional as per original Zod, adjust if needed

  // 4. Website Content
  hasContent: z.enum(['Sim', 'Não', 'Em desenvolvimento'], { required_error: 'Content status is required.' }),
  websitePages: z.array(z.enum(['Home', 'Sobre a empresa', 'Serviços', 'Portfólio', 'Depoimentos', 'Contato', 'Blog', 'E-commerce / Loja virtual', 'Outra(s)'])),
  otherWebsitePages: z.string().optional(), // Conditional field for "Outra(s)"
  hasLogoIdentity: z.enum(['Sim', 'Não', 'Deseja que seja desenvolvido junto com o site'], { required_error: 'Logo/identity status is required.' }),

  // 5. References and Inspirations
  referenceLink1: z.string().url('Invalid URL.').optional().or(z.literal('')),
  whatLikedAboutLink1: z.string().optional().or(z.literal('')),
  referenceLink2: z.string().url('Invalid URL.').optional().or(z.literal('')),
  whatLikedAboutLink2: z.string().optional().or(z.literal('')),
  referenceLink3: z.string().url('Invalid URL.').optional().or(z.literal('')),
  whatLikedAboutLink3: z.string().optional().or(z.literal('')),
  preferredColors: z.string().optional().or(z.literal('')),
  desiredStyle: z.array(z.enum(['Moderno', 'Clássico', 'Minimalista', 'Colorido', 'Elegante', 'Outro'])),
  otherDesiredStyle: z.string().optional(), // Conditional field for "Outro"

  // 6. Hosting and Domain
  hasDomain: z.enum(['Sim', 'Não', 'Precisa de ajuda para registrar'], { required_error: 'Domain status is required.' }),
  hasHosting: z.enum(['Sim', 'Não', 'Precisa de recomendação'], { required_error: 'Hosting status is required.' }),

  // 7. Deadlines and Investment (New Section)
  desiredDeadline: z.string().min(1, 'Desired deadline is required.'), // Changed name and made required
  hasDefinedBudget: z.enum(['Sim', 'Não, gostaria de uma proposta personalizada'], { required_error: 'Budget status is required.' }), // Changed name
  budgetRange: z.string().optional().or(z.literal('')), // Conditional for "Sim"

  // 8. Final Observations (New Section)
  howDidYouHear: z.enum(['Indicação', 'Pesquisa Online', 'Redes sociais', 'Google', 'Outro'], { required_error: 'How you heard about us is required.' }), // Changed name
  otherHowDidYouHear: z.string().optional().or(z.literal('')), // Conditional for "Outro"
  additionalObservations: z.string().optional().or(z.literal('')), // Changed name
/*   createdAt: z.date().optional(),
  clientId: z.string().uuid().optional().nullable(),
  projectId: z.string().uuid().optional().nullable(), */
}).refine(data => {
  // Refinements for conditional validation
  if (data.websiteObjectives.includes('Outro') && !data.otherWebsiteObjective) {
    return false;
  }
  if (data.websitePages.includes('Outra(s)') && !data.otherWebsitePages) {
    return false;
  }
  if (data.desiredStyle.includes('Outro') && !data.otherDesiredStyle) {
    return false;
  }
  if (data.hasDefinedBudget === 'Sim' && !data.budgetRange) {
    return false;
  }
  if (data.howDidYouHear === 'Outro' && !data.otherHowDidYouHear) {
    return false;
  }
  return true;
}, {
  message: 'Please specify the "Other" field(s).',
  path: [''], // General error for the form
  
});

export type BriefingFormValues = z.infer<typeof briefingSchema>;