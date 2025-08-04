import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectFilters } from "./project-filters";

// Solução para o erro "ResizeObserver is not defined"
const mockResizeObserver = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", mockResizeObserver);

// Solução para o erro "scrollIntoView is not a function"
// Adiciona uma implementação mock da função scrollIntoView ao protótipo de HTMLElement.
global.HTMLElement.prototype.scrollIntoView = vi.fn();

// Solução para o erro "target.hasPointerCapture is not a function"
global.Element.prototype.hasPointerCapture = vi.fn(() => false);

// Mocking Next.js router and searchParams
const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
	useSearchParams: () => mockSearchParams,
}));

// Mocking external utils
vi.mock("@/utils", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/utils")>();
	return {
		...actual,
		getStatusLabelProject: (status: string) => `Status: ${status}`,
		projectStatusArray: ["IN_PROGRESS", "COMPLETED", "CANCELED"],
	};
});

describe("ProjectFilters", () => {
	// Teste: Renderização inicial dos filtros
	// Test: Initial rendering of filters

	beforeEach(() => {
		// Limpa todos os mocks (vi.fn) para que as chamadas de push de testes anteriores não interfiram.
		vi.clearAllMocks();
		// Reseta o mockSearchParams para um estado inicial vazio.
		mockSearchParams.delete("type");
		mockSearchParams.delete("status");
	});

	it("should render both type and status filters with 'all' selected by default", () => {
		// Limpar os mocks antes de cada teste
		mockSearchParams.delete("type");
		mockSearchParams.delete("status");

		render(<ProjectFilters />);

		// Verifica se os placeholders estão presentes, o que indica que os selects foram renderizados
		// Usa 'queryAllByText' para encontrar todos os elementos com o texto "Todos" e garantir que haja exatamente dois.
		const allOptions = screen.getAllByText("Todos");
		expect(allOptions).toHaveLength(2);
	});

	// Teste: Sincroniza o estado com os parâmetros da URL na renderização
	// Test: Syncs state with URL parameters on initial render
	it("should initialize filters based on URL search params", () => {
		mockSearchParams.set("type", "WEB");
		mockSearchParams.set("status", "IN_PROGRESS");

		render(<ProjectFilters />);

		const selectedType = screen.getByText("Web");
		const selectedStatus = screen.getByText("Status: IN_PROGRESS");

		expect(selectedType).toBeInTheDocument();
		expect(selectedStatus).toBeInTheDocument();
	});

	// Teste: Atualiza o parâmetro 'type' na URL ao selecionar um tipo
	// Test: Updates 'type' parameter in URL when selecting a type
	it("should update the URL with the selected type filter", async () => {
		render(<ProjectFilters />);

		const typeFilterTrigger = screen.getByLabelText("Selecione um tipo");
		fireEvent.click(typeFilterTrigger);

		const webOption = screen.getByText("Sistema");
		fireEvent.click(webOption);

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith("?type=SISTEMA");
		});
		await waitFor(() => {
			expect(screen.getByText("Sistema")).toBeInTheDocument();
		});
	});

	// Teste: Atualiza o parâmetro 'status' na URL ao selecionar um status
	// Test: Updates 'status' parameter in URL when selecting a status
	it("should update the URL with the selected status filter", async () => {
		render(<ProjectFilters />);

		const statusFilterTrigger = screen.getByLabelText("Selecione um status");
		fireEvent.click(statusFilterTrigger);

		const completedOption = screen.getByText("Status: COMPLETED");
		fireEvent.click(completedOption);

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith("?status=COMPLETED");
		});
		await waitFor(() => {
			expect(screen.getByText("Status: COMPLETED")).toBeInTheDocument();
		});
	});

	// Teste: Remove o parâmetro 'type' da URL ao selecionar 'Todos'
	// Test: Removes 'type' parameter from URL when selecting 'Todos'
	it("should remove 'type' from URL when 'Todos' is selected", async () => {
		const user = userEvent.setup();
		mockSearchParams.set("type", "WEB");
		render(<ProjectFilters />);

		const typeFilterTrigger = screen.getByLabelText("Selecione um tipo");
		await user.click(typeFilterTrigger);

		// O "Todos" só aparece depois do clique, então usamos findByText para esperar por ele
		const allOption = await screen.getByRole("option", {
			name: "Todos",
			hidden: true,
		});
		await user.click(allOption);

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith("?");
		});
	});

	// Teste: Remove o parâmetro 'status' da URL ao selecionar 'Todos'
	// Test: Removes 'status' parameter from URL when selecting 'Todos'
	it("should remove 'status' from URL when 'Todos' is selected", async () => {
		mockSearchParams.set("status", "IN_PROGRESS");
		render(<ProjectFilters />);

		const statusFilterTrigger = screen.getByLabelText("Selecione um status");
		fireEvent.click(statusFilterTrigger);

		const allOption = screen.getAllByText("Todos")[1];
		fireEvent.click(allOption);

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith("?");
			const lastPushCall = mockPush.mock.calls.at(-1)?.[0];
			const urlParams = new URLSearchParams(lastPushCall);
			expect(urlParams.has("type")).toBe(false);
			expect(urlParams.has("status")).toBe(false);
		});
	});

	// Teste: Atualiza ambos os filtros na URL quando um dos filtros é alterado
	// Test: Updates both filters in the URL when one of the filters is changed
	it("should update the URL with both type and status filters correctly", async () => {
		mockSearchParams.set("type", "WEB");
		render(<ProjectFilters />);

		const statusFilterTrigger = screen.getByLabelText("Selecione um status");
		fireEvent.click(statusFilterTrigger);

		const completedOption = screen.getByText("Status: COMPLETED");
		fireEvent.click(completedOption);

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith("?type=WEB&status=COMPLETED");
		});
	});
});
