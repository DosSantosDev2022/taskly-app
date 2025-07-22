import z from "zod";

export const clientFormSchema = z.object({
	name: z
		.string()
		.min(2, "O nome é obrigatório !")
		.max(100, "O nome não pode exceder 100 caracteres."),

	email: z
		.string()
		.email("Por favor, insira um endereço de e-mail válido.")
		.max(255, "O e-mail não pode exceder 255 caracteres.")
		.optional()
		.or(z.literal("")),

	phone: z
		.string()
		.max(20, "O telefone não pode exceder 20 caracteres.") // Adicionado limite máximo
		.optional()
		.or(z.literal("")),
});
