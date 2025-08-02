"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
	isOpen,
	onConfirm,
	onCancel,
	title = "Você tem certeza?",
	description = "Esta ação não pode ser desfeita.",
	confirmText = "Confirmar",
	cancelText = "Cancelar",
}) => {
	return (
		<AlertDialog open={isOpen} onOpenChange={onCancel}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
