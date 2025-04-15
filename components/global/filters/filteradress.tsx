'use client'

import { useState } from 'react'
import {
	PopoverRoot,
	PopoverTrigger,
	PopoverContent,
} from '@/components/global/popover'
import { Button, Label } from '@/components/ui'
import { FaFilter } from 'react-icons/fa'
import { MdCleaningServices } from 'react-icons/md'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useStatesECities } from '@/hooks/useStatesECities'

const FilterAddress = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [citySelected, setCitySelected] = useState('')
	const {
		cities,
		setStateSelected,
		stateSelected,
		states,
		isLoadingCities,
	} = useStatesECities()

	return (
		<PopoverRoot isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
			<PopoverTrigger sizes='xs' variants='secondary'>
				<FaFilter size={24} />
				Localização
			</PopoverTrigger>
			<PopoverContent alignment='bottom' className='p-4 w-56 mt-1'>
				<div className='flex flex-col gap-4'>
					{/* ESTADO */}
					<div>
						<Label className='text-sm font-medium'>Estado</Label>
						<Select
							onValueChange={(value) => {
								setStateSelected(value)
								setCitySelected('') // limpa cidade quando troca o estado
							}}
							value={stateSelected}
						>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Selecione o estado' />
							</SelectTrigger>
							<SelectContent>
								{states.map((state) => (
									<SelectItem key={state.id} value={state.sigla}>
										{state.nome}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* CIDADE */}
					<div>
						<Label className='text-sm font-medium'>Cidade</Label>
						<Select
							onValueChange={(value) => setCitySelected(value)}
							value={citySelected}
							disabled={!stateSelected}
						>
							<SelectTrigger className='w-full'>
								{isLoadingCities ? (
									<SelectValue placeholder='Carregando...' />
								) : (
									<SelectValue placeholder='Seleciona a cidade' />
								)}
							</SelectTrigger>
							<SelectContent>
								{cities.map((city) => (
									<SelectItem key={city.id} value={city.nome}>
										{city.nome}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* BOTÃO LIMPAR */}
					<div>
						<Button
							className='text-sm'
							sizes='full'
							variants='ghost'
							onClick={() => {
								setStateSelected('')
								setCitySelected('')
							}}
						>
							<MdCleaningServices />
							Limpar filtros
						</Button>
					</div>
				</div>
			</PopoverContent>
		</PopoverRoot>
	)
}

export { FilterAddress }
