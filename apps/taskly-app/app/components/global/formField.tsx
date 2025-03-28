import { Label, Input, TextArea } from '../ui'

interface FormFieldProps {
	label: string
	type: 'text' | 'password' | 'email' | 'number' | 'textarea'
	placeholder: string
}

const FormField = ({ label, placeholder, type }: FormFieldProps) => {
	return (
		<div className='flex flex-col w-full space-y-2'>
			<Label>{label}</Label>
			{type === 'textarea' ? (
				<TextArea placeholder={placeholder} />
			) : (
				<Input type={type} placeholder={placeholder} />
			)}
		</div>
	)
}

export { FormField }
