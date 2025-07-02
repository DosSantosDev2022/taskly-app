// hooks/useHandleStatusChange.ts
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function useHandleStatusChange(searchParams: string) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const router = useRouter()

  const handleStatusChange = (status: string) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]

    setSelectedStatuses(updated)

    const params = new URLSearchParams(searchParams)

    if (updated.length > 0) {
      params.set('status', updated.join(','))
    } else {
      params.delete('status')
    }

    router.push(`?${params.toString()}`)
  }

  return { selectedStatuses, setSelectedStatuses, handleStatusChange }
}
