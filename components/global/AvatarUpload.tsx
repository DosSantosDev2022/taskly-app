import { UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui'
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface AvatarUploadProps {
	name: string
	setValue: UseFormSetValue<any>
	watch: UseFormWatch<any>
}

const AvatarUpload = ({ name, setValue, watch }: AvatarUploadProps) => {
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
			<div className='flex flex-col items-start space-y-2'>
				<h2 className='text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
					Avatar
				</h2>
				<div className='border-2 border-dashed border-border rounded-full overflow-hidden flex justify-center items-center bg-input relative w-18 h-18 mx-auto'>
					{preview || image ? (
						<img
							src={preview || image}
							alt='Avatar'
							className='w-full h-full object-cover'
						/>
					) : (
						<div className='flex flex-col items-center text-muted-foreground'>
							<UploadCloud size={30} />
						</div>
					)}
				</div>
				<input
					type='file'
					accept='image/*'
					onChange={handleImageChange}
					className='hidden'
					id='avatar-upload'
				/>
			</div>
			<label htmlFor='avatar-upload' className='mb-4'>
				<Button sizes='xs' variants='primary'>
					Alterar
				</Button>
			</label>
		</div>
	)
}

export { AvatarUpload }
