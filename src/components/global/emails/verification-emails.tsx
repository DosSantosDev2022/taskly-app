// src/components/emails/VerificationEmail.tsx
import {
	Html,
	Head,
	Body,
	Container,
	Text,
	Link,
	Button,
	Tailwind,
	Section,
	Hr,
	Img,
} from "@react-email/components";

interface VerificationEmailProps {
	username?: string;
	verificationLink: string;
}

const main = {
	backgroundColor: "#f6f9fc",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
};

const logo = {
	margin: "0 auto",
};

const paragraph = {
	fontSize: "16px",
	lineHeight: "26px",
};

const btnContainer = {
	textAlign: "center" as const,
};

const button = {
	backgroundColor: "#0070f3",
	borderRadius: "4px",
	color: "#fff",
	fontSize: "16px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	padding: "12px",
};

const hr = {
	borderColor: "#cccccc",
	margin: "20px 0",
};

const footer = {
	color: "#8898aa",
	fontSize: "12px",
};

export const VerificationEmail = ({
	username,
	verificationLink,
}: VerificationEmailProps) => (
	<Html>
		<Head />
		<Tailwind>
			<Body style={main}>
				<Container style={container}>
					<Img
						src={"https://resend.com/static/logo.png"}
						width="40"
						height="40"
						alt="Taskly App"
						style={logo}
					/>
					<Text style={paragraph}>Olá, {username},</Text>
					<Text style={paragraph}>
						Obrigado por se registrar no **Taskly App**! Para ativar sua conta e
						começar a usar todos os recursos, por favor, verifique seu endereço
						de e-mail clicando no botão abaixo:
					</Text>
					<Section style={btnContainer}>
						<Button style={button} href={verificationLink}>
							Verificar meu E-mail
						</Button>
					</Section>
					<Text style={paragraph}>
						Este link de verificação é válido por 24 horas. Se você não
						solicitou este e-mail, pode ignorá-lo com segurança.
					</Text>
					<Text style={paragraph}>
						Atenciosamente,
						<br />A equipe Taskly App
					</Text>
					<Hr style={hr} />
					<Text style={footer}>
						Se você está com problemas para clicar no botão "Verificar meu
						E-mail", copie e cole o URL abaixo no seu navegador:
						<br />
						<Link href={verificationLink} style={footer}>
							{verificationLink}
						</Link>
					</Text>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);

export default VerificationEmail;
