import { registerUser } from "@/actions/auth/register";
import { FormRegister } from "@/components/pages/auth";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

// Mock the external modules and hooks
vi.mock("@/actions/auth/register");
vi.mock("next-auth/react");
vi.mock("next/navigation");
vi.mock("react-toastify", () => ({
	toast: vi.fn(),
}));
const mockRouterPush = vi.fn();

vi.mock("resend", () => {
	const Resend = vi.fn(() => ({
		emails: {
			send: vi.fn(),
		},
	}));
	return { Resend };
});

describe("FormRegister Component", () => {
	// Description: Tests the main functionality and rendering of the registration form.
	// Descrição: Testa a funcionalidade principal e a renderização do formulário de registro.

	beforeEach(() => {
		vi.clearAllMocks();
		(useRouter as Mock).mockReturnValue({
			push: mockRouterPush,
		});
	});

	it("should render all form fields and buttons", () => {
		// Description: Verifies that all necessary form fields (name, email, password, confirmPassword) and buttons are present in the component.
		// Descrição: Verifica se todos os campos de formulário necessários (nome, email, senha, confirmar senha) e botões estão presentes no componente.
		render(<FormRegister />);

		// Verifique o campo de nome, email, senha e confirmar senha (já corrigido no passo anterior)
		expect(screen.getByLabelText("Nome Completo")).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Senha")).toBeInTheDocument();
		expect(screen.getByLabelText("Confirmar Senha")).toBeInTheDocument();

		// Query para o botão de submissão do formulário
		expect(
			screen.getByRole("button", { name: "Cadastrar" }),
		).toBeInTheDocument();

		// Query para o botão de login com o Google
		expect(
			screen.getByRole("button", { name: /cadastrar com google/i }),
		).toBeInTheDocument();

		// Verifique o link de "Já possui conta ?"
		expect(
			screen.getByRole("link", { name: "Já possuí conta ?" }),
		).toBeInTheDocument();
	});

	it("should display client-side validation errors for empty fields", async () => {
		// Description: Tests the form's client-side validation, ensuring errors are shown for required fields left empty.
		// Descrição: Testa a validação do formulário no lado do cliente, garantindo que erros são exibidos para campos obrigatórios deixados em branco.
		render(<FormRegister />);
		fireEvent.click(screen.getByText("Cadastrar"));

		await waitFor(() => {
			expect(screen.getByText("O nome é obrigatório.")).toBeInTheDocument();
			expect(screen.getByText("O e-mail é obrigatório.")).toBeInTheDocument();
			expect(screen.getByText("A senha é obrigatória.")).toBeInTheDocument();
			expect(
				screen.getByText("A confirmação da senha é obrigatória."),
			).toBeInTheDocument();
		});
	});

	it("should display client-side validation error for passwords that do not match", async () => {
		// Description: Verifies that a client-side validation error is displayed when the password and confirmation password fields do not match.
		// Descrição: Verifica se um erro de validação do lado do cliente é exibido quando os campos de senha e confirmação de senha não correspondem.
		render(<FormRegister />);

		const passwordInput = screen.getByLabelText("Senha");
		const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
		const submitButton = screen.getByRole("button", { name: "Cadastrar" });

		fireEvent.change(passwordInput, { target: { value: "Password123!" } });
		fireEvent.change(confirmPasswordInput, {
			target: { value: "Password123" },
		});
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText("As senhas não coincidem.")).toBeInTheDocument();
		});
	});

	it("should display server-side validation errors after submission", async () => {
		// Description: Simulates a failed registration attempt due to server-side validation and checks if the corresponding error messages are displayed.
		// Descrição: Simula uma tentativa de registro falha devido a validação no servidor e verifica se as mensagens de erro correspondentes são exibidas.
		const serverErrors = {
			success: false,
			message: "Validation failed",
			errors: {
				email: "Email already in use",
				password: "Password is too weak",
				general: "Something went wrong",
			},
		};

		(registerUser as Mock).mockResolvedValueOnce(serverErrors);

		render(<FormRegister />);
		const nameInput = screen.getByLabelText(/nome completo/i);
		const emailInput = screen.getByLabelText(/email/i);
		const passwordInput = screen.getByLabelText("Senha");
		const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
		const submitButton = screen.getByRole("button", { name: "Cadastrar" });

		fireEvent.change(nameInput, { target: { value: "Test User" } });
		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "Password123!" } });
		fireEvent.change(confirmPasswordInput, {
			target: { value: "Password123!" },
		});
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText("Email already in use")).toBeInTheDocument();
			expect(screen.getByText("Password is too weak")).toBeInTheDocument();
		});
	});

	it("should successfully register a user and redirect", async () => {
		// Description: Tests the successful registration flow, verifying the toast notification and redirection to the login page.
		// Descrição: Testa o fluxo de registro bem-sucedido, verificando a notificação toast e o redirecionamento para a página de login.
		const successResult = {
			success: true,
			message: "Registration successful!",
		};
		(registerUser as Mock).mockResolvedValueOnce(successResult);

		render(<FormRegister />);

		const nameInput = screen.getByLabelText(/nome completo/i);
		const emailInput = screen.getByLabelText(/email/i);
		const passwordInput = screen.getByLabelText("Senha");
		const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
		const submitButton = screen.getByRole("button", { name: "Cadastrar" });

		fireEvent.change(nameInput, { target: { value: "John Doe" } });
		fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "SecurePass123!" } });
		fireEvent.change(confirmPasswordInput, {
			target: { value: "SecurePass123!" },
		});
		fireEvent.click(submitButton, { name: /cadastrar/i });

		await waitFor(() => {
			expect(registerUser).toHaveBeenCalledWith({
				name: "John Doe",
				email: "john.doe@example.com",
				password: "SecurePass123!",
				confirmPassword: "SecurePass123!",
			});
			expect(toast).toHaveBeenCalledWith(
				"Registration successful!",
				expect.any(Object),
			);
			expect(mockRouterPush).toHaveBeenCalledWith("/login");
		});
	});

	it("should handle Google registration and redirect on success", async () => {
		// Description: Simulates a successful Google registration/login and checks for the correct redirection.
		// Descrição: Simula um registro/login bem-sucedido com o Google e verifica o redirecionamento correto.
		const successResult = {
			ok: true,
			error: null,
		};
		(signIn as Mock).mockResolvedValueOnce(successResult);

		render(<FormRegister />);
		fireEvent.click(
			screen.getByRole("button", { name: /cadastrar com google/i }),
		);

		await waitFor(() => {
			expect(signIn).toHaveBeenCalledWith("google", {
				redirect: false,
				callbackUrl: "/projects",
			});
		});
		expect(mockRouterPush).toHaveBeenCalledWith("/projects");
	});

	it("should show a general error message if Google registration fails", async () => {
		// Description: Tests the error handling for Google registration, ensuring a general feedback message is displayed.
		// Descrição: Testa o tratamento de erro para o registro com o Google, garantindo que uma mensagem de feedback geral seja exibida.
		const errorResult = {
			ok: false,
			error: "Google auth failed",
		};
		(signIn as Mock).mockResolvedValueOnce(errorResult);

		render(<FormRegister />);
		fireEvent.click(
			screen.getByRole("button", { name: /cadastrar com google/i }),
		);

		await waitFor(() => {
			expect(screen.getByText("Google auth failed")).toBeInTheDocument();
		});
	});

	it("should have a link to the login page", () => {
		// Description: Verifies that the 'Already have an account?' link is present and points to the correct route.
		// Descrição: Verifica se o link 'Já possuí conta ?' está presente e aponta para a rota correta.
		render(<FormRegister />);
		const loginLink = screen.getByRole("link", { name: /já possuí conta \?/i });
		expect(loginLink).toBeInTheDocument();
		expect(loginLink.getAttribute("href")).toBe("/login");
	});
});
