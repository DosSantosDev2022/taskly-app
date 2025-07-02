import Link from 'next/link'
import {
	FaFacebook,
	FaTwitter,
	FaInstagram,
	FaLinkedin,
} from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'

const Footer = () => {
	const currentYear = new Date().getFullYear()

	const socialLinks = [
		{
			id: uuidv4(),
			url: '',
			icon: <FaFacebook size={20} />,
		},
		{
			id: uuidv4(),
			url: '',
			icon: <FaTwitter size={20} />,
		},
		{
			id: uuidv4(),
			url: '',
			icon: <FaInstagram size={20} />,
		},
		{
			id: uuidv4(),
			url: '',
			icon: <FaLinkedin size={20} />,
		},
	]

	const utilityLinks = [
		{
			id: uuidv4(),
			url: '',
			label: 'Funcionalidades',
		},
		{
			id: uuidv4(),
			url: '',
			label: 'Planos e preços',
		},
		{
			id: uuidv4(),
			url: '',
			label: 'Contato',
		},
		{
			id: uuidv4(),
			url: '',
			label: 'Blog',
		},
	]

	const suportLinks = [
		{
			id: uuidv4(),
			url: '',
			label: 'FAQ',
		},
		{
			id: uuidv4(),
			url: '',
			label: 'Central de ajuda',
		},
		{
			id: uuidv4(),
			url: '',
			label: 'Termos e serviços',
		},
		{
			id: uuidv4(),
			url: '',
			label: 'Política de privacidade',
		},
	]

	return (
		<footer className='bg-gray-800 text-muted py-12 md:py-16'>
			<div className='container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
				{/* Coluna 1: Sobre o Taskly */}
				<div>
					<h4 className='text-lg font-semibold mb-4 text-primary-foreground'>
						Taskly App
					</h4>
					<p className='text-sm mb-4'>
						Taskly é a sua solução completa para gerenciamento de tarefas,
						aumentando a produtividade e facilitando a colaboração.
					</p>
					<div className='flex space-x-4'>
						{socialLinks.map((link) => (
							<Link
								key={link.id}
								href={link.url}
								className='hover:text-primary-hover duration-300 transition-colors'
							>
								{link.icon}
							</Link>
						))}
					</div>
				</div>

				{/* Coluna 2: Links Úteis */}
				<div>
					<h4 className='text-lg font-semibold mb-4 text-white'>
						Links Úteis
					</h4>
					<ul className='text-sm space-y-2'>
						{utilityLinks.map((link) => (
							<li key={link.id}>
								<Link href={link.url} className='hover:text-gray-400'>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Coluna 3: Suporte */}
				<div>
					<h4 className='text-lg font-semibold mb-4 text-white'>
						Suporte
					</h4>
					<ul className='text-sm space-y-2'>
						{suportLinks.map((link) => (
							<li key={link.id}>
								<Link href={link.url} className='hover:text-gray-400'>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Coluna 4: Contato */}
				<div>
					<h4 className='text-lg font-semibold mb-4 text-white'>
						Contato
					</h4>
					<p className='text-sm mb-2'>Itupeva, SP, Brasil</p>
					<p className='text-sm mb-2'>Email: contato@tasklyapp.com</p>
					<p className='text-sm mb-2'>Telefone: +55 (11) 99999-9999</p>
				</div>
			</div>
			<div className='mt-8 py-4 border-t border-gray-700 text-center text-sm text-gray-400'>
				Copyright © {currentYear} Taskly App. Todos os direitos reservados.
			</div>
		</footer>
	)
}

export { Footer }
