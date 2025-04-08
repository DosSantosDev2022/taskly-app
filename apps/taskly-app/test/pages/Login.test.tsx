import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from '@/app/(pages)/(login)/signIn/page'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { signIn } from 'next-auth/react'
import { NotificationProvider } from '@/context/notificationContext'
import userEvent from '@testing-library/user-event'

const push = vi.fn()

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push,
	}),
}))

vi.mock('next-auth/react', () => ({
	signIn: vi.fn(),
}))

const mockedSignIn = signIn as unknown as ReturnType<typeof vi.fn>

function renderLogin() {
	return render(
		<NotificationProvider>
			<Login />
		</NotificationProvider>,
	)
}

describe('Login Page', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should render the login form', () => {
		renderLogin()
		expect(screen.getByText(/entre em sua conta/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: /login/i }),
		).toBeInTheDocument()
	})

	it('should show error if fields are empty', async () => {
		renderLogin()

		fireEvent.click(screen.getByRole('button', { name: /login/i }))

		await waitFor(() => {
			expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument()
			expect(
				screen.getByText(/a senha é obrigatória/i),
			).toBeInTheDocument()
		})
	})

	it('should call signIn with valid email and password', async () => {
		mockedSignIn.mockResolvedValueOnce({ ok: true })

		renderLogin()

		await userEvent.type(
			screen.getByLabelText(/email/i),
			'usertest@test.com',
		)
		await userEvent.type(screen.getByLabelText(/senha/i), 'User@2025')

		fireEvent.click(screen.getByRole('button', { name: /login/i }))

		await waitFor(() => {
			expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
				redirect: false,
				email: 'usertest@test.com',
				password: 'User@2025',
			})
		})
	})

	it('should display notification if login fails', async () => {
		mockedSignIn.mockResolvedValueOnce({ ok: false })

		renderLogin()

		await userEvent.type(
			screen.getByLabelText(/email/i),
			'wrong@example.com',
		)
		await userEvent.type(screen.getByLabelText(/senha/i), 'wrongpass')

		fireEvent.click(screen.getByRole('button', { name: /login/i }))

		await waitFor(() => {
			expect(
				screen.getByText(/e-mail e senha inválidos, verifique/i),
			).toBeInTheDocument()
		})
	})

	it('should redirect to dashboard after successful login', async () => {
		mockedSignIn.mockResolvedValueOnce({ ok: true })

		renderLogin()

		await userEvent.type(
			screen.getByLabelText(/email/i),
			'usertest@test.com',
		)
		await userEvent.type(screen.getByLabelText(/senha/i), 'User@2025')

		fireEvent.click(screen.getByRole('button', { name: /login/i }))

		await waitFor(() => {
			expect(push).toHaveBeenCalledWith('/dashboard') // <- Agora deve funcionar
		})
	})
})
