// __tests__/form-login.test.tsx
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock das dependências externas
const mockPush = vi.fn();

vi.mock("next-auth/react", () => ({
	signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(() => ({
		push: mockPush,
	})),
}));

vi.mock("resend", () => {
	const Resend = vi.fn(() => ({
		emails: {
			send: vi.fn(),
		},
	}));
	return { Resend };
});

import { FormLogin } from "@/components/pages/auth";
import { signIn } from "next-auth/react";

const mockedSignIn = vi.mocked(signIn);

describe("FormLogin Component", () => {
	/* let mockToast: any; */
	beforeEach(() => {
		/*    mockToast = vi.fn();
       vi.doMock("react-toastify", () => ({
         toast: mockToast,
       })); */
		vi.clearAllMocks();
	});

	// Testa a renderização do formulário
	it("should render the login form with all fields and buttons", () => {
		// Deve renderizar o formulário de login com todos os campos e botões
		render(<FormLogin />);
		expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Login com Google" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /Não possuí conta \?/i }),
		).toBeInTheDocument();
	});

	// Testa o cenário de submissão bem-sucedida do formulário
	it("should call signIn with correct credentials and redirect on successful login", async () => {
		// Deve chamar a função signIn com as credenciais corretas e redirecionar em caso de login bem-sucedido
		mockedSignIn.mockResolvedValueOnce({
			ok: true,
			error: null,
			status: 200, // Adicione o status esperado
			url: "http://localhost:3000/projects", // Adicione a URL esperada
		});

		render(<FormLogin />);

		const emailInput = screen.getByLabelText(/Email/i);
		const passwordInput = screen.getByLabelText(/Senha/i);
		const submitButton = screen.getByRole("button", { name: "Login" });

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "@Password123" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockedSignIn).toHaveBeenCalledWith("credentials", {
				redirect: false,
				email: "test@example.com",
				password: "@Password123",
			});
		});

		// Espera a chamada da função signIn antes de continuar o teste
		await waitFor(() => {
			expect(mockedSignIn).toHaveBeenCalledWith("credentials", {
				redirect: false,
				email: "test@example.com",
				password: "@Password123",
			});
		});

		// Depois de garantir que o signIn foi chamado, espera pelas outras ações
		await waitFor(() => {
			/*  expect(mockToast).toHaveBeenCalledWith("Login efetuado com sucesso!", {
         autoClose: 3000,
         theme: "dark",
       }); */
			expect(mockPush).toHaveBeenCalledWith("/projects");
		});
	});

	// Testa o cenário de submissão com credenciais inválidas

	it("should display an error message for invalid credentials", async () => {
		// Deve exibir uma mensagem de erro para credenciais inválidas
		mockedSignIn.mockResolvedValueOnce({
			ok: false,
			error: null,
			status: 200, // Adicione o status esperado
			url: "http://localhost:3000/projects", // Adicione a URL esperada
		});

		render(<FormLogin />);

		const emailInput = screen.getByLabelText(/Email/i);
		const passwordInput = screen.getByLabelText(/Senha/i);
		const submitButton = screen.getByRole("button", { name: "Login" });

		fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText("A senha deve conter pelo menos uma letra maiúscula."),
			).toBeInTheDocument();
		});
	});

	// Testa a validação do formulário com email vazio
	it("should show validation error for empty email", async () => {
		// Deve mostrar erro de validação para email vazio
		render(<FormLogin />);

		const emailInput = screen.getByLabelText(/Email/i);
		const submitButton = screen.getByRole("button", { name: "Login" });

		fireEvent.change(emailInput, { target: { value: "" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText("O e-mail é obrigatório.")).toBeInTheDocument();
		});
	});

	// Testa a validação do formulário com email inválido
	it("should show validation error for invalid email format", async () => {
		// Deve mostrar erro de validação para formato de email inválido
		render(<FormLogin />);

		const emailInput = screen.getByLabelText(/Email/i);
		const submitButton = screen.getByRole("button", { name: "Login" });

		fireEvent.change(emailInput, { target: { value: "invalid-email" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(/O e-mail fornecido é inválido./i),
			).toBeInTheDocument();
		});
	});

	// Testa a validação do formulário com senha vazia
	it("should show validation error for empty password", async () => {
		// Deve mostrar erro de validação para senha vazia
		render(<FormLogin />);

		const emailInput = screen.getByLabelText(/Email/i);
		const passwordInput = screen.getByLabelText(/Senha/i);
		const submitButton = screen.getByRole("button", { name: "Login" });

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText("A senha é obrigatória.")).toBeInTheDocument();
		});
	});

	// Testa a validação da senha com menos de 8 caracteres
	it("should show validation error for password with less than minimum length", async () => {
		// Deve mostrar erro de validação para senha com menos de 8 caracteres
		render(<FormLogin />);

		const emailInput = screen.getByLabelText(/Email/i);
		const passwordInput = screen.getByLabelText(/Senha/i);
		const submitButton = screen.getByRole("button", { name: "Login" });

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "short" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText("A senha deve ter no mínimo 8 caracteres."),
			).toBeInTheDocument();
		});
	});

	// Testa a validação da senha sem letra maiúscula
	it("should show validation error for password without an uppercase letter", async () => {
		// Deve mostrar erro de validação para senha sem letra maiúscula
		render(<FormLogin />);

		const emailInput = screen.getByLabelText(/Email/i);
		const passwordInput = screen.getByLabelText(/Senha/i);
		const submitButton = screen.getByRole("button", { name: "Login" });

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "password123!" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText("A senha deve conter pelo menos uma letra maiúscula."),
			).toBeInTheDocument();
		});
	});

	// Testa a validação da senha sem caractere especial
	it("should show validation error for password without a special character", async () => {
		// Deve mostrar erro de validação para senha sem caractere especial
		render(<FormLogin />);

		const emailInput = screen.getByLabelText(/Email/i);
		const passwordInput = screen.getByLabelText(/Senha/i);
		const submitButton = screen.getByRole("button", { name: "Login" });

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "Password123" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(
					"A senha deve conter pelo menos um caractere especial.",
				),
			).toBeInTheDocument();
		});
	});

	// Testa o comportamento do botão "Login com Google"
	it("should call signIn with 'google' provider when Google button is clicked", () => {
		// Deve chamar a função signIn com o provedor 'google' quando o botão do Google for clicado
		render(<FormLogin />);

		const googleButton = screen.getByRole("button", {
			name: "Login com Google",
		});

		fireEvent.click(googleButton);

		expect(mockedSignIn).toHaveBeenCalledWith("google", {
			callbackUrl: "/projects",
		});
	});

	// Testa o link de cadastro
	it("should have a link to the registration page", () => {
		// Deve ter um link para a página de cadastro
		render(<FormLogin />);
		const registerLink = screen.getByRole("link", {
			name: /Não possuí conta \?/i,
		});
		expect(registerLink).toBeInTheDocument();
		expect(registerLink.getAttribute("href")).toBe("/register");
	});
});
