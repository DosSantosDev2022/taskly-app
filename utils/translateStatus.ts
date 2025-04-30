const statusTranslations: Record<string, string> = {
    in_progress: 'Em andamento',
    archived: 'Arquivado',
    pending: 'Pendente',
    completed: 'Concluído',
  }

  export const translateStatus = (status: string) => {
    return statusTranslations[status] || status
  }