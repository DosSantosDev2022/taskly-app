import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useDebounce } from "use-debounce";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { ClientSearch } from "./client-search";

/// Mock das dependências no topo do arquivo.
const { mockRouterReplace, mockUseSearchParams } = vi.hoisted(() => {
	return {
		mockRouterReplace: vi.fn(),
		mockUseSearchParams: vi.fn(),
	};
});

// O mock de 'next/navigation' é definido aqui. Ele faz referência às constantes
// declaradas logo acima, evitando o erro de inicialização.
vi.mock("next/navigation", () => ({
	usePathname: vi.fn(() => "/clients"),
	useRouter: vi.fn(() => ({
		replace: mockRouterReplace,
	})),
	useSearchParams: mockUseSearchParams,
}));

// O mock de 'use-debounce' também é uma função vi.fn() que pode ser manipulada.
// Fazendo isso, removemos a necessidade do `vi.hoisted` e `require`.
vi.mock("use-debounce", () => ({
	useDebounce: vi.fn((value) => [value, vi.fn()]),
}));

describe("ClientSearch Component", () => {
	// Description: Tests the functionality of the client search component, including input changes and URL updates.
	// Descrição: Testa a funcionalidade do componente de busca de clientes, incluindo mudanças no input e atualizações da URL.

	beforeEach(() => {
		vi.clearAllMocks();
		mockUseSearchParams.mockReturnValue(new URLSearchParams());
		// Garante que o mock de useDebounce use a implementação padrão para cada teste.
		// O mock agora é acessado diretamente.
		(useDebounce as unknown as Mock).mockImplementation((value) => [
			value,
			vi.fn(),
		]);
	});

	it("should render the search input with a placeholder", () => {
		// Description: Verifies that the search input is present in the document with the correct placeholder text.
		// Descrição: Verifica se o campo de busca está presente no documento com o texto de placeholder correto.
		render(<ClientSearch />);
		const searchInput = screen.getByPlaceholderText(/buscar cliente.../i);
		expect(searchInput).toBeInTheDocument();
	});

	it("should update the input value when the user types", () => {
		// Description: Checks if the component's internal state updates correctly as the user types into the input field.
		// Descrição: Verifica se o estado interno do componente é atualizado corretamente enquanto o usuário digita no campo de input.

		render(<ClientSearch />);
		const searchInput = screen.getByPlaceholderText(/buscar cliente.../i);
		fireEvent.change(searchInput, { target: { value: "test client" } });
		expect(searchInput).toHaveValue("test client");
	});

	it("should update the URL with the search query after debounce", async () => {
		// Description: Tests the debounced behavior, ensuring the URL is updated with the search query only after the debounce period.
		// Descrição: Testa o comportamento debounced, garantindo que a URL é atualizada com a busca apenas após o período de debounce.

		const initialSearchParams = new URLSearchParams();
		mockUseSearchParams.mockReturnValue(initialSearchParams);

		render(<ClientSearch />);
		const searchInput = screen.getByPlaceholderText(/buscar cliente.../i);

		await act(async () => {
			fireEvent.change(searchInput, { target: { value: "test search" } });
		});

		const expectedParams = new URLSearchParams();
		expectedParams.set("query", "test search");
		expectedParams.set("page", "1");

		expect(mockRouterReplace).toHaveBeenCalledWith(
			`/clients?${expectedParams.toString()}`,
		);
	});

	it("should remove query and page from URL when the search input is cleared", async () => {
		// Description: Verifies that the 'query' and 'page' parameters are removed from the URL when the input field is cleared.
		// Descrição: Verifica se os parâmetros 'query' e 'page' são removidos da URL quando o campo de input é limpo.

		const initialSearchParams = new URLSearchParams(
			"query=test&page=2&pageSize=10",
		);
		mockUseSearchParams.mockReturnValue(initialSearchParams);

		render(<ClientSearch currentQuery="test" />);
		const searchInput = screen.getByPlaceholderText(/buscar cliente.../i);

		await act(async () => {
			fireEvent.change(searchInput, { target: { value: "" } });
		});

		const expectedParams = new URLSearchParams();
		expectedParams.set("pageSize", "10");

		expect(mockRouterReplace).toHaveBeenCalledWith(
			`/clients?${expectedParams.toString()}`,
		);
	});

	it("should preserve other URL parameters like pageSize", async () => {
		// Description: Ensures that existing URL parameters, such as 'pageSize', are preserved when the search query is updated.
		// Descrição: Garante que parâmetros da URL existentes, como 'pageSize', são mantidos quando a busca é atualizada.

		const initialSearchParams = new URLSearchParams("page=3&pageSize=20");
		mockUseSearchParams.mockReturnValue(initialSearchParams);

		render(<ClientSearch />);
		const searchInput = screen.getByPlaceholderText(/buscar cliente.../i);

		await act(async () => {
			fireEvent.change(searchInput, { target: { value: "new search" } });
		});

		const expectedParams = new URLSearchParams();
		expectedParams.set("page", "1");
		expectedParams.set("pageSize", "20");
		expectedParams.set("query", "new search");

		expect(mockRouterReplace).toHaveBeenCalledWith(
			`/clients?${expectedParams.toString()}`,
		);
	});
});
