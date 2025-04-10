import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoginWithGoogle } from '@/components/global/LoginWithGoogle'

vi.mock('next-auth/react', () => ({
	signIn: vi.fn(),
}))

import { signIn } from 'next-auth/react'

describe('LoginWithGoogle', () => {
	it('renders correctly with the given text', () => {
		render(<LoginWithGoogle label='Entrar com Google' />)

		expect(screen.getByText('Entrar com Google')).toBeInTheDocument()
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('should call signIn with google when clicking the button', async () => {
		const user = userEvent.setup()
		render(<LoginWithGoogle label='Entrar com Google' />)
		await user.click(screen.getByRole('button'))

		expect(signIn).toHaveBeenCalledWith('google', {
			callbackUrl: '/dashboard',
		})
	})
})
