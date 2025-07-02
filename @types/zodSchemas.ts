import { $Enums } from '@prisma/client'
import { z } from 'zod'

export const registerUserSchema = z.object({
	name: z
		.string()
		.nonempty('Nome é obrigatório')
		.min(3, 'O nome deve ter pelo menos 3 caracteres'),
	email: z
		.string()
		.min(6, 'E-mail é obrigatório')
		.regex(
			/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
			'O e-mail informado não é válido',
		),
	password: z
		.string()
		.min(8, 'A senha deve ter no mínimo 8 caracteres')
		.regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
		.regex(/[0-9]/, 'A senha deve conter pelo menos um número')
		.regex(
			/[^a-zA-Z0-9]/,
			'A senha deve conter pelo menos um caractere especial',
		),
})

export type RegisterFormInputs = z.infer<typeof registerUserSchema>

export const emailSchema = z.object({
	email: z.string().email('E-mail inválido'),
})

export const codeSchema = z.object({
	code: z.string().min(6, 'Código deve ter 6 caracteres'),
})

export const newPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, 'A senha deve ter no mínimo 8 caracteres')
			.regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
			.regex(/[0-9]/, 'A senha deve conter pelo menos um número')
			.regex(
				/[^a-zA-Z0-9]/,
				'A senha deve conter pelo menos um caractere especial',
			),
		confirmPassword: z
			.string()
			.min(8, 'A senha deve ter no mínimo 8 caracteres')
			.regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
			.regex(/[0-9]/, 'A senha deve conter pelo menos um número')
			.regex(
				/[^a-zA-Z0-9]/,
				'A senha deve conter pelo menos um caractere especial',
			),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'As senhas não coincidem',
		path: ['confirmPassword'],
	})

export type EmailData = z.infer<typeof emailSchema>
export type CodeData = z.infer<typeof codeSchema>
export type NewPasswordData = z.infer<typeof newPasswordSchema>

export type Step = 'email' | 'code' | 'new-password'

export const clientSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome do cliente é obrigatório.') // Mensagem para campo vazio
    .max(255, 'O nome do cliente deve ter no máximo 255 caracteres.'), // Opcional: Adicionar limite de caracteres
  
  email: z
    .string()
    .email('Por favor, insira um endereço de e-mail válido.') // Mensagem para formato de e-mail inválido
    .or(z.literal('')), // Permite que o campo seja uma string vazia se opcional
  
  phone: z
    .string()
    .or(z.literal(''))
    .refine((val) => {
      if (!val) return true; // Permite vazio
      // Exemplo de regex para telefone (DDD) XXXX-XXXX ou XXXX-XXXX (sem DDD)
      const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
      return phoneRegex.test(val) || val === '';
    }, 'Por favor, insira um número de telefone válido (ex: (XX) XXXX-XXXX ou XXXXX-XXXX).'),

  address: z
    .string()
    .max(500, 'O endereço deve ter no máximo 500 caracteres.')
    .or(z.literal('')),
  
  zipcode: z
    .string()
    .or(z.literal(''))
    .refine((val) => {
      if (!val) return true; // Permite vazio
      const zipcodeRegex = /^\d{5}-?\d{3}$/; // Exemplo: XXXXX-XXX ou XXXXXXXX
      return zipcodeRegex.test(val) || val === '';
    }, 'Por favor, insira um CEP válido (ex: XXXXX-XXX ou XXXXXXXX).'),
  
  state: z
    .string()
    .max(100, 'O estado deve ter no máximo 100 caracteres.')
    .or(z.literal('')),
  
  city: z
    .string()
    .max(100, 'A cidade deve ter no máximo 100 caracteres.')
    .or(z.literal('')),
  
  status: z
    .enum(['active', 'inactive'], {
      // Mensagem de erro para um valor de enum inválido
      errorMap: () => ({ message: 'O status do cliente deve ser "Ativo" ou "Inativo".' }),
    })
});

export type ClientFormData = z.infer<typeof clientSchema>

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome do projeto não pode ser vazio.')
    .max(255, 'O nome do projeto deve ter no máximo 255 caracteres.'),
  
  description: z
    .string()
    .min(1, 'A descrição do projeto não pode ser vazia.')
    .max(10000, 'A descrição do projeto deve ter no máximo 10000 caracteres.'),
  
  dueDate: z
    .coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_date' 
          ? 'Data de vencimento inválida. Por favor, insira uma data válida.' 
          : defaultError,
      }),
    })
    .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'A data de vencimento não pode ser no passado.',
    }),
  
  clientId: z
    .string()
    .optional(),
  
  teamId: z
    .string()
    .optional(),
  
  status: z
    .enum(['in_progress', 'pending', 'completed', 'archived'], {
      errorMap: () => ({ message: 'Status do projeto inválido.' }),
    })
    .default('pending'),
  
  ownerId: z
    .string()
    .min(1, 'O proprietário do projeto é obrigatório.'), 
});

export type ProjectFormData = z.infer<typeof projectSchema>

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'O título da tarefa é obrigatório.')
    .max(255, 'O título da tarefa deve ter no máximo 255 caracteres.'), // Adicionado limite de caracteres
  
  description: z
    .string()
    .max(1000, 'A descrição da tarefa deve ter no máximo 1000 caracteres.') // Adicionado limite de caracteres, mantendo opcional
    .optional(), // Opcional por padrão, então se for vazio, está ok
  
  dueDate: z
    .coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_date' 
          ? 'Data de vencimento inválida. Por favor, insira uma data válida.' 
          : defaultError,
      }),
    })
    .nullable() // Permite explicitamente null
    .optional() // Permite explicitamente undefined
    .refine((date) => {
      // Se a data for nula ou indefinida, a validação passa.
      if (!date) return true; 
      // Caso contrário, verifica se a data não está no passado.
      return date >= new Date(new Date().setHours(0, 0, 0, 0));
    }, {
      message: 'A data de vencimento não pode ser no passado.',
    }),
  
  status: z
    .nativeEnum($Enums.TaskStatus, {
      errorMap: () => ({ message: 'Status da tarefa inválido.' }),
    })
    .default($Enums.TaskStatus.to_do), // Define um valor padrão para o status
  
  priority: z
    .nativeEnum($Enums.TaskPriority, {
      errorMap: () => ({ message: 'Prioridade da tarefa inválida.' }),
    })
    .default($Enums.TaskPriority.medium), // Define um valor padrão para a prioridade
  
  projectId: z
    .string()
    .min(1, 'O projeto associado à tarefa é obrigatório.'),
  
  ownerId: z
    .string()
    .min(1, 'O responsável pela tarefa é obrigatório.'),
  
  teamId: z
    .string()
    .optional(), 
});

export type TaskFormData = z.infer<typeof taskSchema>

export const CommentSchema = z.object({
  content: z
    .string()
    .min(1, 'O conteúdo do comentário não pode ser vazio. Por favor, escreva algo.')
    .max(1000, 'O comentário deve ter no máximo 1000 caracteres.'),
  
  projectId: z
    .string(),
  
  userId: z
    .string()
    .min(1, 'O ID do usuário é obrigatório para registrar o comentário.'), // O userId deve ser obrigatório para saber quem comentou
})

export type CommentFormData = z.infer<typeof CommentSchema>
