'use client'

import { useEffect, useState } from 'react'

type State = {
  id: number
  sigla: string
  nome: string
}

type City = {
  id: number
  nome: string
}

export function useStatesECities() {
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [stateSelected, setStateSelected] = useState<string>('')
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false)

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((res) => res.json())
      .then((data) => {
        const statesOrdered = data.sort((a: State, b: State) =>
          a.nome.localeCompare(b.nome)
        )
        setStates(statesOrdered)
      })
  }, [])

  useEffect(() => {
    if (!stateSelected) {
      setCities([])
      return
    }
    setIsLoadingCities(true)
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateSelected}/municipios`
    )
      .then((res) => res.json())
      .then((data) => {
        const citiesOrdered = data.sort((a: City, b: City) =>
          a.nome.localeCompare(b.nome)
        )
        setCities(citiesOrdered)
      }).finally(() => {
        setIsLoadingCities(false)
      })
  }, [stateSelected])

  return {
    states,
    cities,
    stateSelected,
    setStateSelected,
    isLoadingCities
  }
}
