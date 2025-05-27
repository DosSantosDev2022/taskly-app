'use client' // Necessário para usar hooks como `useState` e `useForm`

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	type BriefingFormValues,
	briefingSchema,
} from '@/@types/briefingSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label, TextArea } from '@/components/ui'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { saveBriefing } from '@/actions/briefings/addBriefing'

export default function BriefingPage() {
	const form = useForm<BriefingFormValues>({
		resolver: zodResolver(briefingSchema),
		defaultValues: {
			projectLead: '',
			websiteObjectives: [],
			websitePages: [],
			desiredStyle: [],
			projectId: '',
			clientId: '',
		},
	})

	// Observar o valor dos campos para renderização condicional
	const objetivos = form.watch('websiteObjectives')
	const paginas = form.watch('websitePages')
	const estilos = form.watch('desiredStyle')
	const orcamentoDefinido = form.watch('hasDefinedBudget')
	const comoSoube = form.watch('howDidYouHear')

	async function onSubmit(data: BriefingFormValues) {
		console.log('Dados do formulário para envio:', data) // Para debug

		try {
			// Chama a Server Action
			const result = await saveBriefing(data)

			if (result.success) {
				alert(result.message)
				form.reset() // Limpa o formulário após o sucesso
			} else {
				alert('Não foi possível conectar-se ao servidor. Tente novamente.')
				if (result.errors) {
					// Opcional: mostrar erros de validação específicos de Zod para o usuário
					console.error('Zod errors:', result.errors)
					// biome-ignore lint/complexity/noForEach: <explanation>
					Object.keys(result.errors).forEach((key) => {
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						const fieldErrors = result.errors![key]
						if (fieldErrors && fieldErrors.length > 0) {
							// Exemplo: form.setError(key, { type: 'server', message: fieldErrors[0] });
							// Mas o Zod resolver já deveria cuidar da maioria dos erros de validação client-side.
							// Erros de servidor Zod seriam mais para validações que só acontecem no backend.
						}
					})
				}
			}
		} catch (error) {
			console.error('Erro ao chamar Server Action:', error)
			alert('Não foi possível conectar-se ao servidor. Tente novamente.')
		}
	}

	const objetivosOptions = [
		'Vender produtos (e-commerce)',
		'Captar leads',
		'Divulgar serviços',
		'Ter presença online',
		'Outro',
	] as const

	// Para paginasSite
	const paginasOptions = [
		'Home',
		'Sobre a empresa',
		'Serviços',
		'Portfólio',
		'Depoimentos',
		'Contato',
		'Blog',
		'E-commerce / Loja virtual',
		'Outra(s)',
	] as const

	// Para estiloDesejado
	const estiloOptions = [
		'Moderno',
		'Clássico',
		'Minimalista',
		'Colorido',
		'Elegante',
		'Outro',
	] as const

	return (
		<div className='container mx-auto py-8 px-4 max-w-4xl'>
			<h1 className='text-4xl font-bold text-center mb-6'>
				Briefing para Desenvolvimento de Site
			</h1>
			<p className='text-center text-lg text-muted-foreground mb-8'>
				Por favor, preencha o formulário abaixo para nos ajudar a entender
				suas necessidades.
			</p>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 max-h-[520px] border border-border p-4 overflow-y-auto scrollbar-custom'
				>
					{/* 1. Informações da Empresa */}
					<section className='space-y-4 p-6 border border-border rounded-lg shadow-sm'>
						<h2 className='text-2xl font-semibold mb-4'>
							1. Informações da Empresa
						</h2>
						<FormField
							control={form.control}
							name='companyName'
							render={({ field }) => (
								<FormItem>
									<Label>Nome da empresa</Label>
									<FormControl>
										<Input placeholder='Sua Empresa Ltda.' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='cnpj'
							render={({ field }) => (
								<FormItem>
									<Label>CNPJ (opcional)</Label>
									<FormControl>
										<Input placeholder='00.000.000/0000-00' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='projectLead'
							render={({ field }) => (
								<FormItem>
									<Label>Responsável pelo projeto</Label>
									<FormControl>
										<Input placeholder='Digite seu nome' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='phoneNumberWhatsapp'
							render={({ field }) => (
								<FormItem>
									<Label>Telefone e WhatsApp</Label>
									<FormControl>
										<Input placeholder='(XX) XXXXX-XXXX' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<Label>E-mail</Label>
									<FormControl>
										<Input
											placeholder='contato@suaempresa.com.br'
											type='email'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='address'
							render={({ field }) => (
								<FormItem>
									<Label>Endereço (cidade/estado)</Label>
									<FormControl>
										<Input placeholder='São Paulo/SP' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<h3 className='text-xl font-semibold mt-6 mb-2'>
							Redes sociais:
						</h3>
						<FormField
							control={form.control}
							name='instagram'
							render={({ field }) => (
								<FormItem>
									<Label>Instagram</Label>
									<FormControl>
										<Input
											placeholder='https://instagram.com/seuperfil'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='facebook'
							render={({ field }) => (
								<FormItem>
									<Label>Facebook</Label>
									<FormControl>
										<Input
											placeholder='https://facebook.com/seuperfil'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='linkedin'
							render={({ field }) => (
								<FormItem>
									<Label>LinkedIn</Label>
									<FormControl>
										<Input
											placeholder='https://linkedin.com/in/seuperfil'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='currentWebsite'
							render={({ field }) => (
								<FormItem>
									<Label>Site atual (caso tenha)</Label>
									<FormControl>
										<Input
											placeholder='https://www.siteatual.com.br'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</section>

					{/* 2. Sobre o Negócio */}
					<section className='space-y-4 p-6 border border-border rounded-lg shadow-sm'>
						<h2 className='text-2xl font-semibold mb-4'>
							2. Sobre o Negócio
						</h2>
						<FormField
							control={form.control}
							name='businessDescription'
							render={({ field }) => (
								<FormItem>
									<Label>Descreva brevemente o que sua empresa faz:</Label>
									<FormControl>
										<TextArea
											placeholder='Somos uma empresa...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='mainProductsServices'
							render={({ field }) => (
								<FormItem>
									<Label>
										Quais produtos ou serviços principais você oferece?
									</Label>
									<FormControl>
										<TextArea
											placeholder='Desenvolvemos softwares, oferecemos consultoria...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='businessDifferentiator'
							render={({ field }) => (
								<FormItem>
									<Label>Qual é o diferencial do seu negócio?</Label>
									<FormControl>
										<TextArea
											placeholder='Nosso atendimento personalizado, tecnologia inovadora...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='targetAudience'
							render={({ field }) => (
								<FormItem>
									<Label>
										Quem é seu público-alvo (perfil ideal de cliente)?
									</Label>
									<FormControl>
										<TextArea
											placeholder='Empresas de pequeno porte, pessoas físicas...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='websiteObjectives'
							render={({ field }) => (
								<FormItem>
									<Label>
										Quais são os objetivos da empresa com o site?
									</Label>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-2'>
										{objetivosOptions.map(
											(
												item, // AGORA USAMOS A VARIÁVEL TIPADA AQUI
											) => (
												<FormField
													key={item}
													control={form.control}
													name='websiteObjectives'
													render={({ field: checkboxField }) => {
														return (
															<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
																<FormControl>
																	<Checkbox
																		checked={checkboxField.value?.includes(
																			item,
																		)}
																		onCheckedChange={(checked) => {
																			return checked
																				? checkboxField.onChange([
																						...checkboxField.value,
																						item,
																					])
																				: checkboxField.onChange(
																						checkboxField.value?.filter(
																							(value) => value !== item,
																						),
																					)
																		}}
																	/>
																</FormControl>
																<Label className='font-normal'>
																	{item}
																</Label>
															</FormItem>
														)
													}}
												/>
											),
										)}
									</div>
									<FormMessage />
									{objetivos?.includes('Outro') && (
										<FormField
											control={form.control}
											name='otherWebsiteObjective'
											render={({ field }) => (
												<FormItem>
													<Label>Especifique outro objetivo:</Label>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
								</FormItem>
							)}
						/>
					</section>

					{/* 3. Objetivo do Site */}
					<section className='space-y-4 p-6 border border-border rounded-lg shadow-sm'>
						<h2 className='text-2xl font-semibold mb-4'>
							3. Objetivo do Site
						</h2>
						<FormField
							control={form.control}
							name='websiteExpectation'
							render={({ field }) => (
								<FormItem>
									<Label>
										O que você espera que o site proporcione ao seu
										negócio? (Ex.: Aumentar vendas, agendar serviços, gerar
										autoridade, etc.)
									</Label>
									<FormControl>
										<TextArea
											placeholder='Aumentar nossa visibilidade online...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='essentialFeatures'
							render={({ field }) => (
								<FormItem>
									<Label>
										Há alguma funcionalidade essencial? (Ex.: Formulário de
										contato, chat, blog, galeria de fotos, área do cliente,
										integração com redes sociais, etc.)
									</Label>
									<FormControl>
										<TextArea
											placeholder='Formulário de contato, blog, galeria de fotos...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</section>

					{/* 4. Conteúdo do Site */}
					<section className='space-y-4 p-6 border border-border rounded-lg shadow-sm'>
						<h2 className='text-2xl font-semibold mb-4'>
							4. Conteúdo do Site
						</h2>
						<FormField
							control={form.control}
							name='hasContent'
							render={({ field }) => (
								<FormItem className='space-y-3'>
									<Label>
										Você já possui o conteúdo (textos e imagens)?
									</Label>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='flex flex-col space-y-1'
										>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Sim' />
												</FormControl>
												<Label className='font-normal'>Sim</Label>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Não' />
												</FormControl>
												<Label className='font-normal'>Não</Label>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Em desenvolvimento' />
												</FormControl>
												<Label className='font-normal'>
													Em desenvolvimento
												</Label>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='websitePages'
							render={() => (
								<FormItem>
									<Label>Quais páginas o site deverá ter?</Label>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-2'>
										{paginasOptions.map(
											(
												item, // AGORA USAMOS A VARIÁVEL TIPADA AQUI
											) => (
												<FormField
													key={item}
													control={form.control}
													name='websitePages'
													render={({ field }) => {
														return (
															<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(item)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value,
																						item,
																					])
																				: field.onChange(
																						field.value?.filter(
																							(value) => value !== item,
																						),
																					)
																		}}
																	/>
																</FormControl>
																<Label className='font-normal'>
																	{item}
																</Label>
															</FormItem>
														)
													}}
												/>
											),
										)}
									</div>
									<FormMessage />
									{paginas?.includes('Outra(s)') && (
										<FormField
											control={form.control}
											name='otherWebsitePages'
											render={({ field }) => (
												<FormItem>
													<Label>Especifique outras páginas:</Label>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='hasLogoIdentity'
							render={({ field }) => (
								<FormItem className='space-y-3'>
									<Label>Você possui logotipo e identidade visual?</Label>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='flex flex-col space-y-1'
										>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Sim' />
												</FormControl>
												<Label className='font-normal'>Sim</Label>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Não' />
												</FormControl>
												<Label className='font-normal'>Não</Label>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Deseja que seja desenvolvido junto com o site' />
												</FormControl>
												<Label className='font-normal'>
													Deseja que seja desenvolvido junto com o site
												</Label>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</section>

					{/* 5. Referências e Inspirações */}
					<section className='space-y-4 p-6 border border-border rounded-lg shadow-sm'>
						<h2 className='text-2xl font-semibold mb-4'>
							5. Referências e Inspirações
						</h2>
						<h3 className='text-xl font-semibold mb-2'>
							Você tem sites de referência que gosta (concorrentes ou não)?
						</h3>
						{[1, 2, 3].map((num) => (
							<div key={num} className='space-y-2'>
								<FormField
									control={form.control}
									name={`referenceLink${num}` as `referenceLink1`} // Type assertion here is correct
									render={({ field }) => (
										<FormItem>
											<Label>Link {num}</Label>
											<FormControl>
												<Input
													placeholder='https://www.siteexemplo.com.br'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={
										`whatLikedAboutLink${num}` as `whatLikedAboutLink1`
									} // Type assertion here is correct
									render={({ field }) => (
										<FormItem>
											<Label>O que você gostou no Link {num}?</Label>
											<FormControl>
												<TextArea
													placeholder='Gostei do design limpo e da navegação intuitiva.'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						))}
						<FormField
							control={form.control}
							name='preferredColors'
							render={({ field }) => (
								<FormItem>
									<Label>
										Cores preferidas ou que representam sua marca:
									</Label>
									<FormControl>
										<Input placeholder='Azul, branco e cinza' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='desiredStyle'
							render={() => (
								<FormItem>
									<Label>Estilo desejado:</Label>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-2'>
										{estiloOptions.map(
											(
												item, // AGORA USAMOS A VARIÁVEL TIPADA AQUI
											) => (
												<FormField
													key={item}
													control={form.control}
													name='desiredStyle'
													render={({ field }) => {
														return (
															<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(item)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value,
																						item,
																					])
																				: field.onChange(
																						field.value?.filter(
																							(value) => value !== item,
																						),
																					)
																		}}
																	/>
																</FormControl>
																<Label className='font-normal'>
																	{item}
																</Label>
															</FormItem>
														)
													}}
												/>
											),
										)}
									</div>
									<FormMessage />
									{estilos?.includes('Outro') && (
										<FormField
											control={form.control}
											name='otherDesiredStyle'
											render={({ field }) => (
												<FormItem>
													<Label>Especifique outro estilo:</Label>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
								</FormItem>
							)}
						/>
					</section>

					{/* 6. Hospedagem e Domínio */}
					<section className='space-y-4 p-6 border border-border rounded-lg shadow-sm'>
						<h2 className='text-2xl font-semibold mb-4'>
							6. Hospedagem e Domínio
						</h2>
						<FormField
							control={form.control}
							name='hasDomain'
							render={({ field }) => (
								<FormItem className='space-y-3'>
									<Label>
										Você já possui um domínio registrado (ex:
										suamarca.com.br)?
									</Label>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='flex flex-col space-y-1'
										>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Sim' />
												</FormControl>
												<Label className='font-normal'>Sim</Label>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Não' />
												</FormControl>
												<Label className='font-normal'>Não</Label>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Precisa de ajuda para registrar' />
												</FormControl>
												<Label className='font-normal'>
													Precisa de ajuda para registrar
												</Label>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='hasHosting'
							render={({ field }) => (
								<FormItem className='space-y-3'>
									<Label>Já possui hospedagem?</Label>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='flex flex-col space-y-1'
										>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Sim' />
												</FormControl>
												<Label className='font-normal'>Sim</Label>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Não' />
												</FormControl>
												<Label className='font-normal'>Não</Label>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Precisa de recomendação' />
												</FormControl>
												<Label className='font-normal'>
													Precisa de recomendação
												</Label>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</section>

					{/* 7. Prazos e Investimento */}
					<section className='space-y-4 p-6 border border-border rounded-lg shadow-sm'>
						<h2 className='text-2xl font-semibold mb-4'>
							7. Prazos e Investimento
						</h2>
						<FormField
							control={form.control}
							name='desiredDeadline' // Continuei o campo 'prazoDesejado' que estava cortado
							render={({ field }) => (
								<FormItem>
									<Label>
										Qual o prazo desejado para a entrega do site?
									</Label>
									<FormControl>
										<Input
											placeholder='Ex: 30 dias, 60 dias, o mais breve possível'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='hasDefinedBudget'
							render={({ field }) => (
								<FormItem className='space-y-3'>
									<Label>
										Você já tem um orçamento definido para este projeto?
									</Label>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='flex flex-col space-y-1'
										>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Sim' />
												</FormControl>
												<Label className='font-normal'>Sim</Label>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Não, gostaria de uma proposta personalizada' />
												</FormControl>
												<Label className='font-normal'>Não</Label>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{orcamentoDefinido === 'Sim' && (
							<FormField
								control={form.control}
								name='budgetRange'
								render={({ field }) => (
									<FormItem>
										<Label>Qual a faixa de orçamento?</Label>
										<FormControl>
											<Input
												placeholder='Ex: R$ 5.000 - R$ 10.000'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
					</section>

					{/* 8. Informações Adicionais */}
					<section className='space-y-4 p-6 border border-border rounded-lg shadow-sm'>
						<h2 className='text-2xl font-semibold mb-4'>
							8. Informações Adicionais
						</h2>
						<FormField
							control={form.control}
							name='howDidYouHear'
							render={({ field }) => (
								<FormItem className='space-y-3'>
									<Label>Como você soube dos nossos serviços?</Label>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='flex flex-col space-y-1'
										>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Indicação' />
												</FormControl>
												<Label className='font-normal'>Indicação</Label>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Pesquisa Online' />
												</FormControl>
												<Label className='font-normal'>
													Pesquisa Online
												</Label>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Redes Sociais' />
												</FormControl>
												<Label className='font-normal'>
													Redes Sociais
												</Label>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='Outro' />
												</FormControl>
												<Label className='font-normal'>Outro</Label>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{comoSoube === 'Outro' && (
							<FormField
								control={form.control}
								name='otherHowDidYouHear'
								render={({ field }) => (
									<FormItem>
										<Label>Especifique como soube:</Label>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						<FormField
							control={form.control}
							name='additionalObservations'
							render={({ field }) => (
								<FormItem>
									<Label>
										Tem mais alguma informação que considera importante?
									</Label>
									<FormControl>
										<TextArea
											placeholder='Descreva aqui qualquer detalhe adicional...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</section>

					<Button type='submit' className='w-full'>
						Enviar Briefing
					</Button>
				</form>
			</Form>
		</div>
	)
}
