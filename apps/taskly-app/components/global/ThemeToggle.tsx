'use client'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

const ThemeToggle = () => {
	const [isDark, setIsDark] = useState(false)

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme')
		const prefersDark = window.matchMedia(
			'(prefers-color-scheme: dark)',
		).matches
		const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
		setIsDark(isDark)
		document.documentElement.classList.toggle('dark', isDark)
	}, [])

	const toggleTheme = () => {
		const newValue = !isDark
		setIsDark(newValue)
		document.documentElement.classList.toggle('dark', newValue)
		localStorage.setItem('theme', newValue ? 'dark' : 'light')
	}
	return (
		<div className='flex items-center justify-between px-2 py-1.5'>
			<span className='ml-1.5 text-sm font-semibold text-foreground'>
				Theme Mode
			</span>
			<label className='inline-flex items-center cursor-pointer relative'>
				<input
					type='checkbox'
					checked={isDark}
					onChange={toggleTheme}
					className='sr-only peer'
				/>
				<div className="relative w-11 h-6 bg-accent peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
				{/* Ícone Sol (modo claro) - aparece quando está no modo claro (unchecked) */}
				<Sun className='absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary block peer-checked:hidden pointer-events-none' />

				{/* Ícone Lua (modo escuro) - aparece quando o modo escuro está ativado (checked) */}
				<Moon className='absolute left-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary-foreground hidden peer-checked:block pointer-events-none' />
			</label>
		</div>
	)
}

export { ThemeToggle }
