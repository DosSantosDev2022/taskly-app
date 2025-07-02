import type { Task } from "@/@types/prismaSchema";

// Componente para exibir um card de tarefa
interface TaskCardProps {
  task: Task;
}


const TaskCard = ({ task }: TaskCardProps) => {
  // Você pode adicionar mais detalhes ao card aqui
  return (
    <div className="bg-secondary/60 p-3 rounded-md shadow-sm border border-border">
      <h3 className="font-medium text-gray-900 dark:text-gray-50">{task.title}</h3>
      {/* Adicione mais detalhes da tarefa aqui se quiser */}
      <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{task.status.replace('-', ' ')}</span>
    </div>
  );
}

export { TaskCard }