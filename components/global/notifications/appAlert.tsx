// components/global/AppAlert.tsx
'use client';

import { IoTimeSharp } from 'react-icons/io5'; // Mantendo se necessário
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'; // Importe o componente Alert do Shadcn
import { Button } from '@/components/ui/button'; // Importe o Button do Shadcn
import { cn } from '@/lib/utils'; // Para concatenar classes Tailwind
import { LuX } from 'react-icons/lu';

interface AppAlertProps {
  id: string;
  title: string;
  content: string;
  onClose: () => void;
  time: string; // Ex: "5 minutos atrás", "Ontem às 10:30"
  type?: 'default' | 'success' | 'destructive' | 'warning'; // Novo: Para controlar o tipo visual do alerta
}

const AppAlert = ({
  id,
  title,
  content,
  onClose,
  time,
  type = 'default', // Padrão para 'default' se não for especificado
}: AppAlertProps) => {

  const alertTypeClasses = {
    default: 'bg-accent/30 border-accent text-foreground', // Seu fundo original
    success: 'bg-green-100 border-green-400 text-green-800 dark:bg-green-950 dark:border-green-700 dark:text-green-200',
    destructive: 'bg-red-100 border-red-400 text-red-800 dark:bg-red-950 dark:border-red-700 dark:text-red-200',
    warning: 'bg-orange-100 border-orange-400 text-orange-800 dark:bg-orange-950 dark:border-orange-700 dark:text-orange-200',
  };

  return (
    <div key={id} className="w-full">
      <Alert
        className={cn(
          "flex items-start space-x-3 min-h-16 rounded-2xl p-4", // Estilos base do seu alerta
          alertTypeClasses[type] // Aplica as classes baseadas no tipo
        )}
      >
        <div className='flex flex-col space-y-1 w-full'>
          <div className='flex items-center justify-between w-full'>
            <AlertTitle className="text-sm font-semibold">{title}</AlertTitle>
            <Button
              onClick={onClose}
              className='rounded-full h-8 w-8 p-0' // Ajustando tamanho do botão para ícone
              variant='ghost' // 'ghost' é mais comum para botões de fechar em alertas
              size='icon'
            >
              <LuX className="h-4 w-4" /> {/* Ajuste o tamanho do ícone LuX */}
            </Button>
          </div>
          <AlertDescription className='text-xs text-muted-foreground break-words line-clamp-3'>
            {content}
          </AlertDescription>
          <div className='flex w-full items-center space-x-1 mt-2'> {/* Adicionado mt-2 para espaçamento */}
            <IoTimeSharp size={14} className='text-muted-foreground/80' />
            <span className='text-xs text-muted-foreground'>{time}</span>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export { AppAlert };