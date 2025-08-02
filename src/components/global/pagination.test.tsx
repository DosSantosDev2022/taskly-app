import { PaginationComponent } from "@/components/global/pagination";
import { fireEvent, render, screen } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock para os hooks de navegação do Next.js
vi.mock("next/navigation", () => ({
	usePathname: vi.fn(),
	useRouter: vi.fn(),
	useSearchParams: vi.fn(),
}));

const ResizeObserverMock = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

describe("PaginationComponent", () => {
	// Configuração de mocks antes de cada teste
	beforeEach(() => {
		vi.resetAllMocks();
		// Mock padrão para useRouter
		(useRouter as any).mockReturnValue({
			push: vi.fn(),
		});
		// Mock padrão para usePathname
		(usePathname as any).mockReturnValue("/teste");
		// Mock padrão para useSearchParams
		(useSearchParams as any).mockReturnValue(new URLSearchParams());
	});

	// Teste para a renderização inicial com a página 1 de 50
	it("should render pagination correctly with initial values", () => {
		/*deve renderizar a paginação corretamente com os valores iniciais*/
		render(
			<PaginationComponent currentPage={1} totalPages={50} pageSize={10} />,
		);

		expect(screen.getByText("Página 1 de 50"));
		expect(screen.getByText("10"));
		expect(screen.getByLabelText("Primeira página"));
		expect(screen.getByLabelText("Página anterior"));
		expect(screen.getByLabelText("Próxima página"));
		expect(screen.getByLabelText("Última página"));
	});

	// Teste para a renderização na página do meio
	it("should render with all navigation buttons enabled except 'First' and 'Previous' when on the first page", () => {
		/* deve renderizar com todos os botões de navegação habilitados exceto o 'Primeira' e 'Anterior' quando na primeira página */
		render(
			<PaginationComponent currentPage={1} totalPages={10} pageSize={10} />,
		);
		expect(screen.getByLabelText("Primeira página"));
		expect(screen.getByLabelText("Página anterior"));
		expect(screen.getByLabelText("Próxima página"));
		expect(screen.getByLabelText("Última página"));
	});

	// Teste para a renderização na última página
	it("should render with all navigation buttons enabled except 'Last' and 'Next' when on the last page", () => {
		/* deve renderizar com todos os botões de navegação habilitados exceto o 'Última' e 'Próxima' quando na última página */
		render(
			<PaginationComponent currentPage={10} totalPages={10} pageSize={10} />,
		);
		expect(screen.getByLabelText("Primeira página"));
		expect(screen.getByLabelText("Página anterior"));
		expect(screen.getByLabelText("Próxima página"));
		expect(screen.getByLabelText("Última página"));
	});

	// Teste para a navegação usando os botões
	it("should call 'router.push' with the correct URL when clicking 'Next Page'", () => {
		/* deve chamar 'router.push' com a URL correta ao clicar em 'Próxima página */
		const routerMock = { push: vi.fn() };
		(useRouter as any).mockReturnValue(routerMock);
		(useSearchParams as any).mockReturnValue(
			new URLSearchParams("pageSize=10"),
		);

		render(
			<PaginationComponent currentPage={2} totalPages={5} pageSize={10} />,
		);

		fireEvent.click(screen.getByLabelText("Próxima página"));
		expect(routerMock.push).toHaveBeenCalledWith("/teste?pageSize=10&page=3");
	});

	// Teste para a navegação para a primeira página
	it("should call 'router.push' for the first page when the button is clicked", () => {
		/* deve chamar 'router.push' para a primeira página quando o botão for clicado */
		const routerMock = { push: vi.fn() };
		(useRouter as any).mockReturnValue(routerMock);
		(useSearchParams as any).mockReturnValue(
			new URLSearchParams("pageSize=20"),
		);

		render(
			<PaginationComponent currentPage={3} totalPages={5} pageSize={20} />,
		);

		fireEvent.click(screen.getByLabelText("Primeira página"));
		expect(routerMock.push).toHaveBeenCalledWith("/teste?pageSize=20&page=1");
	});

	// Teste para a navegação para a última página
	it("should call 'router.push' for the last page when the button is clicked", () => {
		/* deve chamar 'router.push' para a última página quando o botão for clicado */
		const routerMock = { push: vi.fn() };
		(useRouter as any).mockReturnValue(routerMock);
		(useSearchParams as any).mockReturnValue(
			new URLSearchParams("pageSize=10"),
		);

		render(
			<PaginationComponent currentPage={2} totalPages={5} pageSize={10} />,
		);

		fireEvent.click(screen.getByLabelText("Última página"));
		expect(routerMock.push).toHaveBeenCalledWith("/teste?pageSize=10&page=5");
	});

	// Teste para a mudança de 'pageSize'
	it("must call 'router.push' with the correct URL when changing the 'pageSize'", async () => {
		/* deve chamar 'router.push' com a URL correta ao mudar o 'pageSize' */
		const routerMock = { push: vi.fn() };
		(useRouter as any).mockReturnValue(routerMock);
		(useSearchParams as any).mockReturnValue(
			new URLSearchParams("page=1&pageSize=10"),
		);

		render(
			<PaginationComponent currentPage={1} totalPages={10} pageSize={10} />,
		);

		const selectTrigger = screen.getByRole("combobox");
		fireEvent.click(selectTrigger);

		// Simula a seleção de um novo valor
		fireEvent.click(screen.getByText("20"));

		expect(routerMock.push).toHaveBeenCalledWith("/teste?page=1&pageSize=20");
	});

	// Teste para a preservação de 'query'
	it("must preserve the 'query' parameter in the URL when navigating to another page", () => {
		/* deve preservar o parâmetro 'query' na URL ao navegar para outra página */
		const routerMock = { push: vi.fn() };
		(useRouter as any).mockReturnValue(routerMock);
		(usePathname as any).mockReturnValue("/teste");
		(useSearchParams as any).mockReturnValue(
			new URLSearchParams("query=exemplo&page=1&pageSize=10"),
		);

		render(
			<PaginationComponent
				currentPage={1}
				totalPages={5}
				pageSize={10}
				currentQuery="exemplo"
			/>,
		);

		fireEvent.click(screen.getByLabelText("Próxima página"));
		expect(routerMock.push).toHaveBeenCalledWith(
			"/teste?query=exemplo&page=2&pageSize=10",
		);
	});

	// Teste para a preservação de 'query' ao mudar o 'pageSize'
	it("must preserve the 'query' parameter in the URL when changing the 'pageSize'", () => {
		/* deve preservar o parâmetro 'query' na URL ao mudar o 'pageSize' */
		const routerMock = { push: vi.fn() };
		(useRouter as any).mockReturnValue(routerMock);
		(usePathname as any).mockReturnValue("/teste");
		(useSearchParams as any).mockReturnValue(
			new URLSearchParams("query=exemplo&page=1&pageSize=10"),
		);

		render(
			<PaginationComponent
				currentPage={1}
				totalPages={5}
				pageSize={10}
				currentQuery="exemplo"
			/>,
		);

		const selectTrigger = screen.getByRole("combobox");
		fireEvent.click(selectTrigger);

		fireEvent.click(screen.getByText("20"));

		expect(routerMock.push).toHaveBeenCalledWith(
			"/teste?query=exemplo&page=1&pageSize=20",
		);
	});
});
