"use client";

import { deleteProject } from "@/actions/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * Hook customizado para deletar um projeto.
 * Encapsula a lógica de mutação, invalidação de cache e feedback para o usuário.
 */
export const useDeleteProjectMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (projectId: string) => {
			const formData = new FormData();
			formData.append("projectId", projectId);

			const result = await deleteProject(formData);
			if (!result.success) {
				throw new Error(result.message || "Erro ao deletar projeto!");
			}
			return result;
		},
		onSuccess: () => {
			// Invalida a query de projetos para forçar a re-busca e atualizar a tabela
			// Isso garante que a tabela seja atualizada após a exclusão
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			toast.success("Projeto deletado com sucesso!", {
				autoClose: 3000,
				theme: "dark",
			});
		},
		onError: (error) => {
			console.error("Erro ao deletar projeto:", error);
			toast.error(error.message, {
				autoClose: 3000,
				theme: "dark",
			});
		},
	});
};
