import { z } from 'zod'

export const registerUserSchema = z.object({
	name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
	email: z.string()
  .min(6, 'Email é obrigatório')
  .regex(
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    'O e-mail informado não é válido',
  ),
	password: 
  z.string()
  .min(8,'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[^a-zA-Z0-9]/,
			'A senha deve conter pelo menos um caractere especial',)
})

export type RegisterFormInputs = z.infer<typeof registerUserSchema>