// src/app/projects/[id]/_components/ImagePreviewGallery.tsx
"use client"; // Indica que este é um Client Component

import { useState } from "react";
import Image from "next/image";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Dialog,
	DialogContent,
} from "@/components/ui";

interface ImagePreviewGalleryProps {
	images: string[];
	projectName: string;
}

export function ImagePreviewGallery({
	images,
	projectName,
}: ImagePreviewGalleryProps) {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Previews do Projeto</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{images.map((image, index) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							className="cursor-pointer overflow-hidden rounded-lg border hover:opacity-80 transition-opacity"
							onClick={() => setSelectedImage(image)}
						>
							{/** biome-ignore lint/performance/noImgElement: <explanation> */}
							<img
								src={image}
								alt={`Preview ${index + 1} do projeto ${projectName}`}
								className="aspect-video w-full h-full object-cover"
							/>
						</div>
					))}
				</div>
			</CardContent>

			<Dialog
				open={!!selectedImage}
				onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}
			>
				<DialogContent className="max-w-7xl w-full border-none p-0">
					{selectedImage && (
						<div className="relative w-full aspect-video">
							<Image
								src={selectedImage}
								alt="Visualização ampliada da imagem do projeto"
								fill
								className="object-contain rounded-md"
							/>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</Card>
	);
}
