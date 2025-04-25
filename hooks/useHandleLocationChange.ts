'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStatesECities } from './useStatesECities'

export function useHandleLocationChange(searchParamsString: string) {
	const router = useRouter()
	const [citySelected, setCitySelected] = useState('')
	const [stateSelected, setStateSelected] = useState('')

	const { cities, states, isLoadingCities, setStateSelected: setStateInHook } =
		useStatesECities()

	// Atualiza URL e estados locais ao mudar o estado
	const handleStateChange = (value: string) => {
		setStateSelected(value)
		setCitySelected('')
		setStateInHook(value)

		const params = new URLSearchParams(searchParamsString)
		if (value) {
			params.set('state', value)
			params.delete('city')
		} else {
			params.delete('state')
			params.delete('city')
		}
		router.push(`?${params.toString()}`)
	}

	// Atualiza URL ao mudar a cidade
	const handleCityChange = (value: string) => {
		setCitySelected(value)
		const params = new URLSearchParams(searchParamsString)
		value ? params.set('city', value) : params.delete('city')
		router.push(`?${params.toString()}`)
	}

	// Atualiza os valores iniciais com base nos searchParams
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
		const params = new URLSearchParams(searchParamsString)
		const state = params.get('state') || ''
		const city = params.get('city') || ''
		setStateSelected(state)
		setCitySelected(city)
		setStateInHook(state)
	}, [searchParamsString])

	return {
		stateSelected,
		citySelected,
		states,
		cities,
		isLoadingCities,
		handleStateChange,
		handleCityChange,
		setCitySelected,
		setStateSelected,
	}
}
