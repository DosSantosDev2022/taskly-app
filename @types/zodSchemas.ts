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
	name: z.string().min(1, 'Nome é obrigatório'),
	email: z.string().email('E-mail inválido').optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
	zipcode: z.string().optional(),
	state: z.string().optional(),
	city: z.string().optional(),
	status: z.enum(['active', 'inactive']).optional(),
})

export type ClientFormData = z.infer<typeof clientSchema>

export const projectSchema = z.object({
	name: z.string().min(1, 'O nome do projeto é obrigatório'),
	description: z.string().min(1, 'A descrição é obrigatória'),
	dueDate: z.coerce.date().nullable().optional(),
	clientId: z.string().optional(),
	teamId: z.string().optional(),
	status: z.enum(['in_progress', 'pending', 'completed', 'archived']),
	ownerId: z.string(),
})

export type ProjectFormData = z.infer<typeof projectSchema>

export const taskSchema = z.object({
	title: z.string(),
	description: z.string(),
	dueDate: z.coerce.date(),
	status: z.nativeEnum($Enums.TaskStatus),
	priority: z.nativeEnum($Enums.TaskPriority),
	projectId: z.string(),
	ownerId: z.string(),
	teamId: z.string().optional(),
})

export type TaskFormData = z.infer<typeof taskSchema>

export const CommentSchema = z.object({
	content: z.string().min(1, 'Deixe um comentário'),
	projectId: z.string().nullable().optional(),
	taskId: z.string().nullable().optional(),
	userId: z.string().optional(),
})

export type CommentFormData = z.infer<typeof CommentSchema>
