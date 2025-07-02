import { AddTasks } from "./addTasks";

interface ActionTasksProps {
  projectId?: string | null;
}

const ActionTasks = ({ projectId }: ActionTasksProps) => {
  return (
    <div className='my-2 px-2.5 py-1.5 bg-secondary/20 rounded-xl'>
      <AddTasks
        ownerId=""
        teamId=""
        projectId={projectId || ""}
        triggerSize='sm'
        triggerLabel="Nova"
      />
    </div>
  );
}


export { ActionTasks };