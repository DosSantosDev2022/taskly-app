// src/app/login/page.tsx
import { FormRegister } from "@/components/pages/auth";
import { ClipboardList } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
	return (
		<div className="grid min-h-screen md:grid-cols-2">
			{/* Lado esquerdo: Conteúdo visual e textual */}
			<div className="relative hidden flex-col items-center justify-center bg-zinc-900 p-8 text-foreground dark:border-r lg:flex">
				{/* Adicione uma imagem ou ícone de destaque */}
				<div className="absolute inset-0 z-0 opacity-20">
					<Image
						src="/images/login-background.jpg" // Caminho para sua imagem de fundo
						alt="Fundo da plataforma"
						layout="fill" // Faz a imagem preencher o contêiner
						objectFit="cover" // Garante que a imagem cubra o espaço sem distorção
						quality={100} // Qualidade da imagem
					/>
				</div>

				{/* Conteúdo sobreposto à imagem */}
				<div className="z-10 text-center">
					{/* Logo da sua plataforma */}
					<div className="mb-4 flex items-center justify-center text-lg font-medium">
						<ClipboardList />
						<span className="text-3xl font-bold">Taskly app</span>{" "}
						{/* Substitua pelo nome da sua plataforma */}
					</div>
					<h1 className="mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
						Faça seu cadastro agora !
					</h1>
					<p className="text-xl leading-relaxed text-zinc-300">
						E tenha acesse a uma plataforma incrível para gerenciar seus
						projetos.
					</p>
					<p className="mt-4 text-sm text-muted-foreground">
						Descubra um novo nível de produtividade.
					</p>
				</div>
			</div>

			{/* Lado direito: Formulário de Login */}
			<div className="flex items-center justify-center p-4">
				<FormRegister />
			</div>
		</div>
	);
}
