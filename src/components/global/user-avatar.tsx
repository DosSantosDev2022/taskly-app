"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

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
					<Avatar
						className={cn("h-9 w-9", isLoading && "animate-pulse bg-muted")}
					>
						{session?.user?.image && !isLoading ? (
							<AvatarImage
								src={session.user.image}
								alt={session.user.name || "User Avatar"}
							/>
						) : (
							<AvatarFallback>
								{isLoading
									? "" // Não mostra texto no fallback enquanto carrega, o skeleton já está no Avatar
									: session?.user?.name
										? session.user.name
												.split(" ")
												.map((n) => n[0])
												.join("")
												.toUpperCase()
										: "UN"}
							</AvatarFallback>
						)}
					</Avatar>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-56 p-2" align="end" forceMount>
				<div>
					<div className="flex flex-col space-y-1 p-2">
						<p className="text-sm font-medium leading-none">
							{session?.user.name}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{session?.user.email}
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
				</div>
			</PopoverContent>
		</Popover>
	);
};

export { UserAvatar };
