import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Register from '@/app/(pages)/(auth)/register/page'
import { describe, it, vi, beforeEach, expect } from 'vitest'
import { NotificationProvider } from '@/context/notificationContext'
import userEvent from '@testing-library/user-event'
import VerifyEmail from '@/app/(pages)/(auth)/verify-email/page'

const push = vi.fn()

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push,
	}),
	useSearchParams: () => ({
		get: (key: string) => {
			if (key === 'token') return 'fake-verification-token'
			return null
		},
	}),
}))

function renderRegister() {
	return render(
		<NotificationProvider>
			<Register />
		</NotificationProvider>,
	)
}

describe('Register Page', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		global.fetch = vi.fn()
	})

	it('should render the registration form', () => {
		renderRegister()
		expect(screen.getByText(/crie sua conta/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: /^cadastrar$/i }),
		).toBeInTheDocument()
	})

	it('should show errors if fields are empty', async () => {
		renderRegister()

		fireEvent.click(screen.getByRole('button', { name: /^cadastrar$/i }))

		await waitFor(() => {
			expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument()
			expect(screen.getByText(/E-mail é obrigatório/i)).toBeInTheDocument()
			expect(
				screen.getByText(/A senha deve ter no mínimo 8 caracteres/i),
			).toBeInTheDocument()
		})
	})

	it('should register user with valid data', async () => {
		;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: vi.fn(),
		})

		renderRegister()

		await userEvent.type(screen.getByLabelText(/nome/i), 'João Teste')
		await userEvent.type(screen.getByLabelText(/email/i), 'joao@teste.com')
		await userEvent.type(screen.getByLabelText(/senha/i), 'Joao@1234')

		fireEvent.click(screen.getByRole('button', { name: /^cadastrar$/i }))

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith(
				'/api/register',
				expect.any(Object),
			)
			expect(push).toHaveBeenCalledWith('/verify-email')
		})
	})

	it('should display verifying email message on /verify-email page', async () => {
		render(
			<NotificationProvider>
				<VerifyEmail />
			</NotificationProvider>,
		)

		await waitFor(() => {
			expect(
				screen.getByText(/verificando o seu e-mail.../i),
			).toBeInTheDocument()
		})
	})

	it('should show error if no token is provided in the URL', async () => {
		vi.mock('next/navigation', async () => {
			const actual =
				await vi.importActual<typeof import('next/navigation')>(
					'next/navigation',
				)
			return {
				...actual,
				useRouter: () => ({
					push,
				}),
				useSearchParams: () => ({
					get: () => null, // simula ausência de token
				}),
			}
		})

		render(
			<NotificationProvider>
				<VerifyEmail />
			</NotificationProvider>,
		)

		await waitFor(() => {
			expect(
				screen.getByText(/Erro interno ao verificar e-mail/i),
			).toBeInTheDocument()
		})
	})

	it('should show error if token verification fails', async () => {
		vi.mock('next/navigation', async () => {
			const actual =
				await vi.importActual<typeof import('next/navigation')>(
					'next/navigation',
				)
			return {
				...actual,
				useRouter: () => ({
					push,
				}),
				useSearchParams: () => ({
					get: () => 'invalid-token',
				}),
			}
		})

		global.fetch = vi.fn().mockResolvedValueOnce({
			ok: false,
			json: vi.fn().mockResolvedValue({
				error: 'Token inválido ou expirado',
			}),
		})

		render(
			<NotificationProvider>
				<VerifyEmail />
			</NotificationProvider>,
		)

		await waitFor(() => {
			expect(
				screen.getByText(/Erro interno ao verificar e-mail/i),
			).toBeInTheDocument()
		})
	})

	it('should show error notification if registration fails', async () => {
		;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: false,
			json: vi.fn().mockResolvedValue({ error: 'Erro simulado' }),
		})

		renderRegister()

		await userEvent.type(screen.getByLabelText(/nome/i), 'João Teste')
		await userEvent.type(screen.getByLabelText(/email/i), 'joao@teste.com')
		await userEvent.type(screen.getByLabelText(/senha/i), 'Joao@1234')

		fireEvent.click(screen.getByRole('button', { name: /^cadastrar$/i }))

		await waitFor(() => {
			expect(
				screen.getByText(/erro ao cadastrar usuário, verifique/i),
			).toBeInTheDocument()
			expect(push).not.toHaveBeenCalled()
		})
	})

	it('should show success notification after successful registration', async () => {
		;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: vi.fn(),
		})

		renderRegister()

		await userEvent.type(screen.getByLabelText(/nome/i), 'João Teste')
		await userEvent.type(screen.getByLabelText(/email/i), 'joao@teste.com')
		await userEvent.type(screen.getByLabelText(/senha/i), 'Joao@1234')

		fireEvent.click(screen.getByRole('button', { name: /^cadastrar$/i }))

		await waitFor(() => {
			expect(
				screen.getByText(/usuário cadastrado com sucesso/i),
			).toBeInTheDocument()
		})
	})

	it('should display "Registering..." while submitting the form', async () => {
		let resolveFetch: (value?: unknown) => void

		const fetchPromise = new Promise((resolve) => {
			resolveFetch = resolve
		})
		;(fetch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			fetchPromise,
		)

		renderRegister()

		await userEvent.type(screen.getByLabelText(/nome/i), 'João Teste')
		await userEvent.type(screen.getByLabelText(/email/i), 'joao@teste.com')
		await userEvent.type(screen.getByLabelText(/senha/i), 'Joao@1234')

		fireEvent.click(screen.getByRole('button', { name: /^cadastrar$/i }))

		await waitFor(() => {
			expect(screen.getByText(/^cadastrando/i)).toBeInTheDocument()
		})

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		resolveFetch!()

		await waitFor(() => {
			expect(fetch).toHaveBeenCalled()
		})
	})
})
