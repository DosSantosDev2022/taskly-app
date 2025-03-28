import Link from 'next/link'
import { Button } from '@/components/ui'
import Image from 'next/image'
import logoGoogle from '@/assets/icons/google.png'
import { FormField } from '@/components/global/formField'

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
						<FormField
							label='Nome'
							type='text'
							placeholder='Digite o seu nome'
						/>

						<FormField
							label='Email'
							type='email'
							placeholder='Digite o seu e-mail'
						/>

						<FormField
							label='Senha'
							type='password'
							placeholder='Digite sua senha'
						/>

						<div className='w-full flex flex-col space-y-3'>
							<Button sizes='full'>Cadastrar</Button>
							<Button className='space-x-2' variants='ghost' sizes='full'>
								<Image
									width={26}
									height={26}
									quality={100}
									alt=''
									src={logoGoogle}
								/>
								<span>Cadastrar com Google</span>
							</Button>

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
