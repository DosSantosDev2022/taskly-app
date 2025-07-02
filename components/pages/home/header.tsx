'use client'
import { Button } from '@/components/ui'
import { v4 as uuidv4 } from 'uuid'
import Link from 'next/link'
import { useState } from 'react'
import { LuMenu, LuX } from 'react-icons/lu'

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const navLinks = [
		{
			id: uuidv4(),
			label: 'Início',
			url: '/',
		},
		{
			id: uuidv4(),
			label: 'Funcionalidades',
			url: '/functions',
		},
		{
			id: uuidv4(),
			label: 'Planos e Preços',
			url: '/prices',
		},
		{
			id: uuidv4(),
			label: 'Contato',
			url: '/contact',
		},
	]

	return (
		<header className='bg-white shadow sticky top-0 z-50'>
			<div className='container mx-auto px-4 py-5 flex items-center justify-between'>
				<Link
					href='/'
					className='font-bold text-xl md:text-4xl text-primary'
				>
					Taskly App
				</Link>

				{/* Menu Hamburger (Mobile) */}
				<div className='md:hidden'>
					<Button
						sizes='icon'
						onClick={toggleMenu}
						className='focus:outline-none'
					>
						{isMenuOpen ? (
							<LuX className='h-6 w-6 ' />
						) : (
							<LuMenu className='h-6 w-6 ' />
						)}
					</Button>
				</div>

				{/* Navegação Principal (Desktop) */}
				<nav className='hidden md:flex space-x-6 items-center'>
					<ul className='flex space-x-4'>
						{navLinks.map((link) => (
							<li key={link.id}>
								<Link
									href={link.url}
									className='text-foreground hover:text-primary-hover transition duration-300'
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
					<Button sizes='sm' asChild>
						<Link href={'/signIn'} className='whitespace-nowrap'>
							Iniciar seção
						</Link>
					</Button>
				</nav>

				{/* Menu Mobile (Dropdown) */}
				{isMenuOpen && (
					<div className='md:hidden absolute top-full left-0 right-0 bg-background shadow-md rounded-b-md py-4 flex flex-col items-center space-y-3'>
						<nav className='flex flex-col items-center space-y-3'>
							{navLinks.map((link) => (
								<Link
									key={link.id}
									href={link.url}
									className='text-foreground hover:text-primary-hover transition duration-300'
									onClick={toggleMenu} // Fechar o menu ao clicar no link
								>
									{link.label}
								</Link>
							))}
						</nav>
						<Button sizes='sm' asChild className='w-48'>
							<Link href={'/signIn'} onClick={toggleMenu}>
								Fazer Login
							</Link>
						</Button>
					</div>
				)}
			</div>
		</header>
	)
}

export { Header }
