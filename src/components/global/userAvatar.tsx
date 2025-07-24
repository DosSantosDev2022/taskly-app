// src/components/user-nav.tsx
"use client"; // Este componente precisa ser um Client Component

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui"; // Ajuste os imports conforme sua estrutura de ui
import { Separator } from "@/components/ui/separator"; // Certifique-se que Separator está disponível

const UserAvatar = () => {
	const { data: session, status } = useSession();
	const isLoading = status === "loading";

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-10 w-10 rounded-full"
					disabled={isLoading}
				>
					<Avatar className="h-9 w-9">
						{session?.user?.image ? (
							<AvatarImage
								src={session.user.image}
								alt={session.user.name || "User Avatar"}
							/>
						) : (
							<AvatarFallback>
								{session?.user?.name
									? session.user.name
											.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase()
									: isLoading
										? ""
										: "UN"}
							</AvatarFallback>
						)}
					</Avatar>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-56 p-2" align="end" forceMount>
				{isLoading ? (
					<div className="flex items-center p-2 text-sm text-muted-foreground">
						Carregando...
					</div>
				) : session?.user ? (
					<>
						<div className="flex flex-col space-y-1 p-2">
							<p className="text-sm font-medium leading-none">
								{session.user.name}
							</p>
							<p className="text-xs leading-none text-muted-foreground">
								{session.user.email}
							</p>
						</div>
						<Separator className="my-2" />
						<Button
							variant="ghost"
							className="w-full justify-start text-left"
							onClick={() => signOut({ callbackUrl: "/login" })}
						>
							Sair
						</Button>
					</>
				) : (
					<Button
						variant="ghost"
						className="w-full justify-start text-left"
						onClick={() => signIn("google", { callbackUrl: "/projects" })} // Ajuste o provedor e callbackUrl conforme seu projeto
					>
						Entrar
					</Button>
				)}
			</PopoverContent>
		</Popover>
	);
};

export { UserAvatar };
