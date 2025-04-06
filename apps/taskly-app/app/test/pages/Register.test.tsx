import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Register from '@/(pages)/(login)/register/page'
import { describe, it, vi, beforeEach, expect } from 'vitest'
import { NotificationProvider } from '@/context/notificationContext'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'

const push = vi.fn()

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push,
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
			expect(push).toHaveBeenCalledWith('/signIn')
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
