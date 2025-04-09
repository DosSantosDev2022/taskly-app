'use client'

import { UploadCloud } from 'lucide-react'
import { useState } from 'react'
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface CoverUploadProps {
	name: string
	setValue: UseFormSetValue<any>
	watch: UseFormWatch<any>
}

const CoverUpload = ({ name, setValue, watch }: CoverUploadProps) => {
	const [preview, setPreview] = useState<string | null>(null)
	const image = watch(name)

	const handleImageChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				const result = reader.result as string
				setPreview(result)
				setValue(name, result)
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<div className='flex items-end justify-start space-x-4'>
			<div className='flex flex-col items-start space-y-2 w-full'>
				<h2 className='text-sm font-medium text-muted-foreground'>
					Foto de Capa
				</h2>
				<label
					htmlFor='cover-upload'
					className='border-2 bg-input border-dashed border-border overflow-hidden flex justify-center items-center relative w-full h-48 cursor-pointer'
				>
					{preview || image ? (
						<img
							src={preview || image}
							alt='Capa'
							className='w-full h-full object-cover'
						/>
					) : (
						<div className='text-muted-foreground p-10 flex flex-col items-center bg-transparent'>
							<UploadCloud size={40} />
							<span className='mt-2'>
								Carregue um arquivo ou arraste e solte
							</span>
							<span className='text-sm mt-1'>PNG, JPG, GIF até 10MB</span>
						</div>
					)}
					<input
						type='file'
						accept='image/*'
						onChange={handleImageChange}
						className='hidden'
						id='cover-upload'
					/>
				</label>
			</div>
		</div>
	)
}

export { CoverUpload }
