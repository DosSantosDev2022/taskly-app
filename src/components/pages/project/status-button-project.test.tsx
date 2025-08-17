// StatusButtonProject.test.tsx
import { toggleProjectStatusAction } from "@/actions/project";
import { ProjectStatus } from "@prisma/client";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { describe, expect, it, Mock, vi } from "vitest";
import { StatusButtonProject } from "./status-button-project";

// Mock das funções externas
vi.mock("@/actions/project", () => ({
	toggleProjectStatusAction: vi.fn(),
}));

vi.mock("react-toastify", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

vi.mock("@/utils", () => ({
	getStatusLabelProject: (status: ProjectStatus) => {
		switch (status) {
			case "PENDING":
				return "Pendente";
			case "IN_PROGRESS":
				return "Em Andamento";
			case "COMPLETED":
				return "Concluído";
			default:
				return "Desconhecido";
		}
	},
	getStatusProjectStyles: () => "bg-blue-500 text-white",
}));

describe("StatusButtonProject", () => {
	// Test if the component renders with the correct status
	// Testa se o componente é renderizado com o status correto
	it("should render with the correct status label", () => {
		render(<StatusButtonProject projectId="123" currentStatus="PENDING" />);
		const statusText = screen.getByText("Pendente");
		expect(statusText).toBeInTheDocument();
	});

	describe("Success Scenario", () => {
		// Test the successful flow of a status change
		// Testa o fluxo de sucesso de uma mudança de status
		it("should call toggleProjectStatusAction and show a success toast on successful update", async () => {
			// Mock da ação para retornar sucesso
			(toggleProjectStatusAction as Mock).mockResolvedValue({ success: true });

			// Renderiza o componente
			render(<StatusButtonProject projectId="123" currentStatus="PENDING" />);

			const button = screen.getByText("Pendente");

			// Clica no botão e espera pela transição
			fireEvent.click(button);

			// Aguarda a atualização da UI para o estado de "Atualizando..."
			await waitFor(() => {
				expect(screen.getByText("Atualizando...")).toBeInTheDocument();
			});

			// Aguarda a conclusão da transição
			await waitFor(() => {
				expect(toggleProjectStatusAction).toHaveBeenCalledWith(
					"123",
					"PENDING",
				);
			});

			// Verifica se o toast de sucesso foi chamado
			await waitFor(() => {
				expect(toast.success).toHaveBeenCalledWith(
					"Status do projeto atualizado!",
					expect.anything(),
				);
			});

			// Aguarda o retorno do estado inicial
			await waitFor(() => {
				expect(screen.getByText("Pendente")).toBeInTheDocument();
			});
		});
	});

	describe("Error Scenario", () => {
		// Test the error flow of a status change
		// Testa o fluxo de erro de uma mudança de status
		it("should call toggleProjectStatusAction and show an error toast on update failure", async () => {
			// Mock da ação para retornar erro
			(toggleProjectStatusAction as Mock).mockResolvedValue({ success: false });

			// Renderiza o componente
			render(<StatusButtonProject projectId="123" currentStatus="PENDING" />);

			const button = screen.getByText("Pendente");

			// Clica no botão e espera pela transição
			fireEvent.click(button);

			// Aguarda a atualização da UI para o estado de "Atualizando..."
			await waitFor(() => {
				expect(screen.getByText("Atualizando...")).toBeInTheDocument();
			});

			// Aguarda a conclusão da transição
			await waitFor(() => {
				expect(toggleProjectStatusAction).toHaveBeenCalledWith(
					"123",
					"PENDING",
				);
			});

			// Verifica se o toast de erro foi chamado
			await waitFor(() => {
				expect(toast.error).toHaveBeenCalledWith(
					"Erro ao atualizar status do projeto.",
					expect.anything(),
				);
			});

			// Aguarda o retorno do estado inicial
			await waitFor(() => {
				expect(screen.getByText("Pendente")).toBeInTheDocument();
			});
		});
	});
});
