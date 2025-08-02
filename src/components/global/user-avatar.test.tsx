import { UserAvatar } from "@/components/global";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { signOut, useSession } from "next-auth/react";
import { describe, expect, it, vi } from "vitest";

// Mock das dependências externas
vi.mock("next-auth/react", () => ({
	useSession: vi.fn(),
	signOut: vi.fn(),
}));

vi.mock("@/lib/utils", () => ({
	cn: (...args: any[]) => args.join(" "),
}));

vi.mock("@/components/ui", async (importOriginal) => {
	const mod = await importOriginal<typeof import("@/components/ui")>();
	return {
		...mod,
		AvatarImage: ({ src, alt }: { src: string; alt: string }) => (
			// Retorna um <img> simples com os atributos corretos para a biblioteca de testes encontrar.
			// biome-ignore lint/performance/noImgElement: <explanation>
			<img src={src} alt={alt} />
		),
	};
});

describe("UserAvatar Component", () => {
	// Tradução: Testa o comportamento do componente quando o estado da sessão está carregando.
	it("should display a loading state when the session status is 'loading'", () => {
		// Mock do useSession para retornar um estado de carregamento
		(useSession as any).mockReturnValue({
			data: null,
			status: "loading",
		});

		render(<UserAvatar />);

		const button = screen.getByRole("button");
		// Verifica se o botão está desabilitado e se o avatar possui a classe de animação
		expect(button).toBeDisabled();
		// Garante que o texto de fallback não está presente
		expect(screen.queryByText("UN")).not.toBeInTheDocument();
	});

	// Tradução: Testa o comportamento do componente quando a sessão de um usuário está presente e tem uma imagem.
	it("should display the user avatar image when a session is available with an image", () => {
		// Mock do useSession para retornar um usuário com imagem
		// Mock do useSession para retornar um usuário com imagem
		const mockSession = {
			user: {
				name: "John Doe",
				email: "john.doe@example.com",
				image: "https://example.com/avatar.jpg",
			},
		};
		(useSession as any).mockReturnValue({
			data: mockSession,
			status: "authenticated",
		});

		render(<UserAvatar />);

		// Agora buscamos a imagem do avatar pelo seu atributo `alt`, que o componente define.
		const avatarImage = screen.getByRole("img", {
			name: mockSession.user.name,
		});
		const button = screen.getByRole("button");

		// Verifica se a imagem do avatar é exibida corretamente e o botão não está desabilitado
		expect(avatarImage).toBeInTheDocument();
		expect(avatarImage).toHaveAttribute(
			"src",
			"https://example.com/avatar.jpg",
		);
		expect(button).not.toBeDisabled();

		// Garante que o fallback de iniciais não está visível
		expect(screen.queryByText("JD")).not.toBeInTheDocument();
	});

	// Tradução: Testa o comportamento do componente quando a sessão de um usuário está presente, mas não tem uma imagem.
	it("should display the user's initials as fallback when a session is available without an image", () => {
		// Mock do useSession para retornar um usuário sem imagem
		(useSession as any).mockReturnValue({
			data: {
				user: {
					name: "John Doe",
					email: "john.doe@example.com",
					image: null,
				},
			},
			status: "authenticated",
		});

		render(<UserAvatar />);

		// Verifica se o fallback com as iniciais do usuário é exibido
		expect(screen.getByText("JD")).toBeInTheDocument();
		// Usa queryByRole para verificar que nenhuma imagem está presente
		expect(screen.queryByRole("img")).not.toBeInTheDocument();
	});

	// Tradução: Testa se a popover é aberta ao clicar no botão do avatar e exibe os detalhes do usuário.
	it("should open the popover and display user details on button click", async () => {
		// Mock do useSession para retornar um usuário com dados completos
		(useSession as any).mockReturnValue({
			data: {
				user: {
					name: "John Doe",
					email: "john.doe@example.com",
					image: "https://example.com/avatar.jpg",
				},
			},
			status: "authenticated",
		});

		render(<UserAvatar />);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		// Espera que o conteúdo da popover seja visível
		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
			expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
			expect(screen.getByText("Sair")).toBeInTheDocument();
		});
	});

	// Tradução: Testa se o botão de "Sair" na popover chama a função signOut com a URL de callback correta.
	it('should call signOut with the correct callback URL when the "Sair" button is clicked', async () => {
		// Mock do useSession para retornar um usuário com dados completos
		(useSession as any).mockReturnValue({
			data: {
				user: {
					name: "John Doe",
					email: "john.doe@example.com",
					image: "https://example.com/avatar.jpg",
				},
			},
			status: "authenticated",
		});

		render(<UserAvatar />);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		// Espera que a popover esteja visível e clica no botão "Sair"
		await waitFor(() => {
			const signOutButton = screen.getByText("Sair");
			fireEvent.click(signOutButton);
		});

		// Verifica se a função signOut foi chamada com o objeto de callback correto
		expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
	});

	// Tradução: Testa o comportamento do componente quando não há sessão.
	it("should display a fallback for no user when session is unauthenticated", () => {
		// Mock do useSession para retornar um estado não autenticado
		(useSession as any).mockReturnValue({
			data: null,
			status: "unauthenticated",
		});

		render(<UserAvatar />);

		// Verifica se o fallback "UN" é exibido
		expect(screen.getByText("UN")).toBeInTheDocument();
	});
});
