import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { LoginWithGoogle } from '@/components/global/LoginWithGoogle'

export default function Login() {
	return (
		<div className='max-w-[768px] w-[628px]'>
			<div className='lg:p-12 p-6 flex flex-col space-y-4'>
				<div className='space-y-1.5'>
					<h3 className='font-bold text-3xl'>Crie sua conta</h3>
					<span className='text-muted-foreground'>
						Preencha seus dados
					</span>
				</div>

				<form action=''>
					<div className='space-y-2.5'>
						<div className='flex flex-col space-y-1'>
							<label htmlFor={''} className='text-sm font-medium'>
								Nome
							</label>
							<Input placeholder='Digite o seu nome' />
						</div>

						<div className='flex flex-col space-y-1'>
							<label htmlFor={''} className='text-sm font-medium'>
								Email
							</label>
							<Input placeholder='Digite o seu e-mail' />
						</div>

						<div className='flex flex-col space-y-1'>
							<label htmlFor={''} className='text-sm font-medium'>
								Senha
							</label>
							<Input placeholder='Digite sua senha' />
						</div>

						<div className='w-full flex flex-col space-y-3'>
							<Button sizes='full'>Cadastrar</Button>
							<LoginWithGoogle label='Cadastrar com Google' />

							<div className='flex flex-col items-center justify-center w-full p-1 space-y-1'>
								<span className='text-muted-foreground'>
									Já possuí conta ?{' '}
								</span>
								<Button asChild sizes='full' variants='secondary'>
									<Link href={'/signin'}>Fazer Login</Link>
								</Button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
