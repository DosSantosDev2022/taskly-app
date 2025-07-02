import {
	AlertCircleIcon,
	ErrorCircleIcon,
	SuccessCircleIcon,
} from '../icons/notificationsIcon'

interface MessageErrorProps {
	label: string
}

const MessageError = ({ label }: MessageErrorProps) => {
	return (
		<div className='bg-danger/10 p-3 border-2 rounded border-danger flex items-center space-x-1.5'>
			<ErrorCircleIcon />
			<span className='text-danger text-sm font-medium'>{label}</span>
		</div>
	)
}

interface MessageAlertProps {
	label: string
}

const MessageAlert = ({ label }: MessageAlertProps) => {
	return (
		<div className='bg-warning/10 p-3 border-2 rounded border-warning flex items-center space-x-1.5'>
			<AlertCircleIcon />
			<span className='text-warning-foreground text-sm font-medium'>
				{label}
			</span>
		</div>
	)
}

interface MessageAlertProps {
	label: string
}

const MessageSuccess = ({ label }: MessageAlertProps) => {
	return (
		<div className='bg-success/10 p-3 border-2 rounded border-success flex items-center space-x-1.5'>
			<SuccessCircleIcon />
			<span className='text-success-foreground text-sm font-medium'>
				{label}
			</span>
		</div>
	)
}

export { MessageError, MessageAlert, MessageSuccess }
