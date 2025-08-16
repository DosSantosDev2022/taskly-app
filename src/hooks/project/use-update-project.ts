// src/hooks/project/use-update-project-mutation.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Importa a Server Action de atualização, mas agora ela será chamada dentro do hook.
import { updateProjectAction } from "@/actions/project";

/**
 * Hook customizado para gerenciar a mutação de atualização de um projeto.
 * Usa o useMutation do React Query.
 */
export const useUpdateProjectMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// A função de mutação que chama a sua Server Action
		mutationFn: async ({
			projectId,
			formData,
		}: {
			projectId: string;
			formData: FormData;
		}) => {
			const result = await updateProjectAction(projectId, formData);
			if (!result.success) {
				// Lança um erro para que a callback `onError` seja acionada
				throw new Error(
					result.errors ? "Erro de validação" : "Erro ao atualizar projeto.",
				);
			}
			return result;
		},
		// Callback que é executada em caso de sucesso
		onSuccess: (projectId) => {
			// Invalida o cache do projeto para que o React Query busque os novos dados
			// Isso é muito mais eficiente do que gerenciar o estado manualmente
			queryClient.invalidateQueries({ queryKey: ["project", projectId] });
			toast.success("Projeto atualizado com sucesso!", {
				autoClose: 3000,
				theme: "dark",
			});
		},
		// Callback que é executada em caso de erro
		onError: (error) => {
			toast.error(error.message, {
				autoClose: 5000,
				theme: "dark",
			});
			console.error("Erro na mutação de atualização:", error);
		},
	});
};
