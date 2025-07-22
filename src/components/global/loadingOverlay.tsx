// components/LoadingOverlay.tsx
import type React from "react";

interface LoadingOverlayProps {
	isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
	if (!isLoading) {
		return null; // Não renderiza nada se não estiver carregando
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			{/* Spinner */}
			<div className="flex items-center justify-center gap-2">
				<div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent">
					<span className="sr-only">Carregando...</span>
				</div>
				<span>Carregando...</span>
			</div>
		</div>
	);
};

export { LoadingOverlay };
