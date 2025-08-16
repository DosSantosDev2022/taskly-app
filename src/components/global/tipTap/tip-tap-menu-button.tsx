// src/components/ui/tiptap/tiptap-menu-button.tsx
"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import * as React from "react";

interface TiptapMenuButtonProps extends ButtonProps {
	/**
	 * O texto que será exibido no tooltip.
	 */
	tooltipText: string;
}

/**
 * @name TiptapMenuButton
 * @description Um botão de menu com tooltip para ser usado na barra de ferramentas do Tiptap.
 * @param {object} props - As props do componente.
 * @param {string} props.tooltipText - O texto que será exibido no tooltip.
 * @returns {JSX.Element} Um componente de botão com tooltip.
 */
export const TiptapMenuButton = React.forwardRef<
	HTMLButtonElement,
	TiptapMenuButtonProps
>(({ tooltipText, children, ...props }, ref) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={300}>
				<TooltipTrigger asChild>
					<Button ref={ref} {...props}>
						{children}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{tooltipText}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
});

TiptapMenuButton.displayName = "TiptapMenuButton";
