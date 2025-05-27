'use client'

import type { BriefingFormValues } from '@/@types/briefingSchema'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Strong,
	Paragraph,
	Separator,
} from '@/components/ui'
import { BriefingsActions } from '@/components/pages/briefings'

interface BriefingDetailProps {
	briefing: BriefingFormValues
}

export function BriefingDetail({ briefing }: BriefingDetailProps) {
	return (
		<div className='flex-1 '>
			{/* <BriefingsActions /> */}
			<Card className=''>
				<CardHeader>
					<CardTitle className='text-3xl font-bold'>
						Briefing: {briefing.companyName}
					</CardTitle>
					<p className='text-sm text-muted-foreground'>
						Responsável: {briefing.projectLead} | Email: {briefing.email} |
						Tel/WhatsApp: {briefing.phoneNumberWhatsapp}
					</p>
				</CardHeader>
				<CardContent className='space-y-6'>
					{/* Informações da Empresa */}
					<div className='space-y-2'>
						<h3 className='text-xl font-semibold mb-2'>
							1. Informações da Empresa
						</h3>
						<Paragraph>
							<Strong>CNPJ:</Strong> {briefing.cnpj || 'Não informado'}
						</Paragraph>
						<Paragraph>
							<strong className='font-medium'>Endereço:</strong>{' '}
							{briefing.address}
						</Paragraph>
						{briefing.instagram && (
							<Paragraph>
								<Strong>Instagram:</Strong>{' '}
								<a
									href={briefing.instagram}
									target='_blank'
									rel='noopener noreferrer'
									className='text-blue-400 hover:underline'
								>
									{briefing.instagram}
								</a>
							</Paragraph>
						)}
						{briefing.facebook && (
							<Paragraph>
								<Strong>Facebook:</Strong>{' '}
								<a
									href={briefing.facebook}
									target='_blank'
									rel='noopener noreferrer'
									className='text-blue-400 hover:underline'
								>
									{briefing.facebook}
								</a>
							</Paragraph>
						)}
						{briefing.linkedin && (
							<Paragraph>
								<Strong>LinkedIn:</Strong>{' '}
								<a
									href={briefing.linkedin}
									target='_blank'
									rel='noopener noreferrer'
									className='text-blue-400 hover:underline'
								>
									{briefing.linkedin}
								</a>
							</Paragraph>
						)}
						{briefing.currentWebsite && (
							<Paragraph>
								<Strong>Site Atual:</Strong>{' '}
								<a
									href={briefing.currentWebsite}
									target='_blank'
									rel='noopener noreferrer'
									className='text-blue-400 hover:underline'
								>
									{briefing.currentWebsite}
								</a>
							</Paragraph>
						)}
					</div>
					<Separator />

					{/* Sobre o Negócio */}
					<div className='space-y-2'>
						<h3 className='text-xl font-semibold mb-2'>
							2. Sobre o Negócio
						</h3>
						<Paragraph>
							<Strong>Descrição:</Strong> {briefing.businessDescription}
						</Paragraph>
						<Paragraph>
							<Strong>Produtos/Serviços:</Strong>{' '}
							{briefing.mainProductsServices}
						</Paragraph>
						<Paragraph>
							<Strong>Diferencial:</Strong>{' '}
							{briefing.businessDifferentiator}
						</Paragraph>
						<Paragraph>
							<Strong>Público-alvo:</Strong> {briefing.targetAudience}
						</Paragraph>
						<Paragraph>
							<Strong>Objetivos do Site:</Strong>{' '}
							{briefing.websiteObjectives.join(', ')}
							{briefing.otherWebsiteObjective &&
								` (${briefing.otherWebsiteObjective})`}
						</Paragraph>
					</div>
					<Separator />

					{/* Objetivo do Site */}
					<div className='space-y-2'>
						<h3 className='text-xl  font-semibold mb-2'>
							3. Objetivo do Site
						</h3>
						<Paragraph>
							<Strong>Expectativa:</Strong> {briefing.websiteExpectation}
						</Paragraph>
						<Paragraph>
							<Strong>Funcionalidades Essenciais:</Strong>{' '}
							{briefing.essentialFeatures}
						</Paragraph>
					</div>
					<Separator />

					{/* Conteúdo do Site */}
					<div className='space-y-2'>
						<h3 className='text-xl font-semibold mb-2'>
							4. Conteúdo do Site
						</h3>
						<Paragraph>
							<Strong>Possui Conteúdo:</Strong> {briefing.hasContent}
						</Paragraph>
						<Paragraph>
							<Strong>Páginas Desejadas:</Strong>{' '}
							{briefing.websitePages.join(', ')}
							{briefing.otherWebsitePages &&
								` (${briefing.otherWebsitePages})`}
						</Paragraph>
						<Paragraph>
							<Strong>Logotipo/Identidade Visual:</Strong>{' '}
							{briefing.hasLogoIdentity}
						</Paragraph>
					</div>
					<Separator />

					{/* Referências e Inspirações */}
					<div className='space-y-2'>
						<h3 className='text-xl font-semibold mb-2'>
							5. Referências e Inspirações
						</h3>
						{[1, 2, 3].map((num) => {
							const linkKey =
								`referenceLink${num}` as keyof BriefingFormValues
							const likedKey =
								`whatLikedAboutLink${num}` as keyof BriefingFormValues
							return (
								briefing[linkKey] && (
									<div key={num} className='mb-2'>
										<Paragraph>
											<Strong>Link {num}:</Strong>{' '}
											<a
												href={briefing[linkKey] as string}
												target='_blank'
												rel='noopener noreferrer'
												className='text-blue-400 hover:underline'
											>
												{briefing[linkKey] as string}
											</a>
										</Paragraph>
										{briefing[likedKey] && (
											<Paragraph>
												<Strong>Gostou no Link {num}:</Strong>{' '}
												{briefing[likedKey] as string}
											</Paragraph>
										)}
									</div>
								)
							)
						})}
						<Paragraph>
							<Strong>Cores Preferidas:</Strong> {briefing.preferredColors}
						</Paragraph>
						<Paragraph>
							<Strong>Estilo Desejado:</Strong>{' '}
							{briefing.desiredStyle.join(', ')}
							{briefing.otherDesiredStyle &&
								` (${briefing.otherDesiredStyle})`}
						</Paragraph>
					</div>
					<Separator />

					{/* Hospedagem e Domínio */}
					<div className='space-y-2'>
						<h3 className='text-xl font-semibold mb-2'>
							6. Hospedagem e Domínio
						</h3>
						<Paragraph>
							<Strong>Possui Domínio:</Strong> {briefing.hasDomain}
						</Paragraph>
						<Paragraph>
							<Strong>Possui Hospedagem:</Strong> {briefing.hasHosting}
						</Paragraph>
					</div>
					<Separator />

					{/* Investimento e Contato */}
					<div className='space-y-2'>
						<h3 className='text-xl font-semibold mb-2'>
							7. Investimento e Contato
						</h3>
						<Paragraph>
							<Strong>Orçamento Definido:</Strong>{' '}
							{briefing.hasDefinedBudget}
							{briefing.budgetRange && ` (${briefing.budgetRange})`}
						</Paragraph>
						<Paragraph>
							<Strong>Como Soube:</Strong> {briefing.howDidYouHear}
							{briefing.otherHowDidYouHear &&
								` (${briefing.otherHowDidYouHear})`}
						</Paragraph>
						{briefing.additionalObservations && (
							<Paragraph>
								<Strong>Informações Adicionais:</Strong>{' '}
								{briefing.additionalObservations}
							</Paragraph>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
