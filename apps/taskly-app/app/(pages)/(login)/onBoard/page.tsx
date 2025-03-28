'use client'
import { FormField } from '@/components/global/formField'
import { AvatarUpload } from '@/components/global/AvatarUpload'
import { Button, TextArea } from '@/components/ui'
import { useState } from 'react'
import { CoverUpload } from '@/components/global/CoverUpload'

export default function OnBoarding() {
	const [step, setStep] = useState(1)

	const nextStep = () => {
		setStep(step + 1)
	}
	const prevStep = () => {
		setStep(step - 1)
	}

	return (
		<div className='w-full h-full flex items-center justify-center border border-border shadow-2xl p-12'>
			<div className='max-w-[768px] w-[468px] flex flex-col items-center h-full justify-center'>
				{step === 1 && (
					<>
						<div className='p-6 flex flex-col space-y-8'>
							<h1 className='text-3xl  font-bold'>Vamos começar ?</h1>
						</div>
						<div className='w-full border'>
							{/* <Image alt='' src={''} fill /> */}
						</div>
					</>
				)}

				<div className='w-full h-full flex flex-col justify-between'>
					{/* Formulários aqui */}
					{step === 1 && <FormStep1 />}
					{step === 2 && <FormStep2 />}
					{step === 3 && <FormStep3 />}
				</div>

				<div className='flex gap-4 w-full justify-between mt-2.5'>
					{step > 1 && (
						<Button sizes='xs' variants='secondary' onClick={prevStep}>
							Voltar
						</Button>
					)}

					{step < 3 && (
						<Button sizes='xs' variants='primary' onClick={nextStep}>
							Próximo
						</Button>
					)}

					{step === 3 && (
						<div className='flex gap-1'>
							<Button sizes='xs' variants='accent'>
								Pular
							</Button>
							<Button sizes='xs' variants='primary'>
								Finalizar
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

//Componentes  dos forms
function FormStep1() {
	return <div className='p-4'>a</div>
}

function FormStep2() {
	return (
		<form>
			<div className='space-y-2.5'>
				<FormField label='apelido' type='text' placeholder='@apelido' />
				<FormField
					label='Sobre'
					type='textarea'
					placeholder='Descreve sobre você...'
				/>
				<div className='space-y-3.5'>
					<AvatarUpload />
					<CoverUpload />
				</div>
			</div>
		</form>
	)
}

function FormStep3() {
	return (
		<div className='flex flex-col space-y-4'>
			<div className='p-6 flex flex-col space-y-1'>
				<h1 className='text-3xl font-bold'>Vamos criar sua equipe ?</h1>
				<span className='text-muted-foreground'>
					Gerencie o seus projetos de forma colaborativa junto dos seus
					amigos e eleve o nível da usa produtividade
				</span>
			</div>

			<form action=''>
				<div className='space-y-2.5'>
					<FormField
						label='Nome'
						type='text'
						placeholder='Nome da equipe'
					/>
					<FormField
						label='Sobre'
						type='textarea'
						placeholder='Descreve sobre você...'
					/>
					<div className='space-y-3.5'>
						<AvatarUpload />
					</div>
				</div>
			</form>
		</div>
	)
}
