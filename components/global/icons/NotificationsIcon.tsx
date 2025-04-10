interface IconProps extends React.SVGProps<SVGSVGElement> {
	title?: string
	fillColor?: string
	pathColor?: string
}

const ErrorCircleIcon: React.FC<IconProps> = ({
	title = 'Error icon',
	fillColor = '#bc3306',
	pathColor = '#ffff',
	...props
}) => {
	return (
		<svg
			width={22}
			height={22}
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 48 48'
			{...props}
		>
			<title>{title}</title>
			<circle cx='24' cy='24' r='24' fill={fillColor} />
			<path
				d='M35.997 33.877l-2.122 2.12L24 26.123l-9.874 9.874-2.123-2.12 
           9.876-9.876-9.876-9.876 2.12-2.122L24 21.88l9.878-9.877 
           2.119 2.122-9.875 9.876 9.875 9.876z'
				fill={pathColor}
			/>
		</svg>
	)
}

const AlertCircleIcon: React.FC<IconProps> = ({
	title = 'Alert icon',
	fillColor = '#facc15',
	pathColor = '#1a1a1a',
	...props
}) => {
	return (
		<svg
			width={22}
			height={22}
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 32 32'
			overflow='visible'
			{...props}
		>
			<circle cx={16} cy={16} r={16} fill={fillColor} />
			<title>{title}</title>
			<path d='M14.5 25h3v-3h-3v3zm0-19v13h3V6h-3z' fill={pathColor} />
		</svg>
	)
}

const SuccessCircleIcon: React.FC<IconProps> = ({
	title = 'Success icon',
	fillColor = '#16a34a',
	pathColor = '#ffffff',
	...props
}) => {
	return (
		<svg
			width={22}
			height={22}
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 512 512'
			xmlSpace='preserve'
			aria-label={title}
			{...props}
		>
			<title>{title}</title>

			{/* Fundo circular */}
			<path
				d='M489 255.9v-.7c0-1.6 0-3.2-.1-4.7 0-.9-.1-1.8-.1-2.8 0-.9-.1-1.8-.1-2.7-.1-1.1-.1-2.2-.2-3.3 0-.7-.1-1.4-.1-2.1l-.3-3.6c0-.5-.1-1.1-.1-1.6-.1-1.3-.3-2.6-.4-4 0-.3-.1-.7-.1-1C474.3 113.2 375.7 22.9 256 22.9S37.7 113.2 24.5 229.5c0 .3-.1.7-.1 1-.1 1.3-.3 2.6-.4 4-.1.5-.1 1.1-.1 1.6l-.3 3.6c0 .7-.1 1.4-.1 2.1-.1 1.1-.1 2.2-.2 3.3 0 .9-.1 1.8-.1 2.7 0 .9-.1 1.8-.1 2.8 0 1.6-.1 3.2-.1 4.7V256.9c0 1.6 0 3.2.1 4.7 0 .9.1 1.8.1 2.8 0 .9.1 1.8.1 2.7.1 1.1.1 2.2.2 3.3 0 .7.1 1.4.1 2.1l.3 3.6c0 .5.1 1.1.1 1.6.1 1.3.3 2.6.4 4 0 .3.1.7.1 1C37.7 398.8 136.3 489.1 256 489.1s218.3-90.3 231.5-206.5c0-.3.1-.7.1-1 .1-1.3.3-2.6.4-4 .1-.5.1-1.1.1-1.6l.3-3.6c0-.7.1-1.4.1-2.1.1-1.1.1-2.2.2-3.3 0-.9.1-1.8.1-2.7 0-.9.1-1.8.1-2.8 0-1.6.1-3.2.1-4.7v-.7-.2c0 .1 0 .1 0 0z'
				fill={fillColor}
			/>

			{/* Check */}
			<path
				d='M213.6 344.2L369.7 188.2'
				fill='none'
				stroke={pathColor}
				strokeWidth={30}
				strokeMiterlimit={10}
			/>
			<path
				d='M233.8 345.2L154.7 266.1'
				fill='none'
				stroke={pathColor}
				strokeWidth={30}
				strokeMiterlimit={10}
			/>
		</svg>
	)
}

export { ErrorCircleIcon, AlertCircleIcon, SuccessCircleIcon }
