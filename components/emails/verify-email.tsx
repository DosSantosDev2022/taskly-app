import {
	Body,
	Button,
	Container,
	Head,
	Html,
	Link,
	Preview,
	Section,
	Text,
	Heading,
} from '@react-email/components'

interface EmailVerificationProps {
	userName?: string
	verificationUrl?: string
}

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: ''

export const EmailVerificationEmail = ({
	userName,
	verificationUrl,
}: EmailVerificationProps) => {
	return (
		<Html>
			<Head />
			<Preview>Confirme seu e-mail para ativar sua conta</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={heading}>Taskly App</Heading>
					<Section>
						<Text style={text}>Olá {userName},</Text>
						<Text style={text}>
							Obrigado por se cadastrar! Para ativar sua conta, clique no
							botão abaixo:
						</Text>
						<Button style={button} href={verificationUrl}>
							Verificar E-mail
						</Button>
						<Text style={text}>
							Se você não criou uma conta, pode ignorar este e-mail.
						</Text>
						<Text style={text}>
							Caso o botão acima não funcione, copie e cole este link no
							seu navegador:
							<br />
							<Link style={anchor} href={verificationUrl}>
								{verificationUrl}
							</Link>
						</Text>
						<Text style={text}>
							Abraços, <br />
							Equipe do Taskly App
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	)
}

// Estilos
const main = {
	backgroundColor: '#f6f9fc',
	padding: '10px 0',
}

const container = {
	backgroundColor: '#ffffff',
	border: '1px solid #f0f0f0',
	padding: '45px',
}

const text = {
	fontSize: '16px',
	fontFamily: "'Poppins', sans-serif",
	fontWeight: '300',
	color: '#404040',
	lineHeight: '26px',
}

const heading = {
	fontSize: '32px',
	fontFamily: "'Poppins', sans-serif",
	fontWeight: '800',
	color: '#000000',
	lineHeight: '26px',
}

const button = {
	backgroundColor: '#1c8ad4',
	borderRadius: '4px',
	color: '#fff',
	fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
	fontSize: '15px',
	textDecoration: 'none',
	textAlign: 'center' as const,
	display: 'block',
	width: '210px',
	padding: '14px 7px',
}

const anchor = {
	textDecoration: 'underline',
}
