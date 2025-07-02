// components/global/MessageNotification.tsx
'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils'; // Para concatenar classes Tailwind

interface MessageNotificationProps {
  id: string;
  img?: string; // Imagem do avatar (opcional)
  fallback: string; // Texto de fallback para o avatar (ex: iniciais do nome)
  title: string; // Título da mensagem (ex: nome do remetente)
  content: string; // Conteúdo da mensagem
  time: string; // Tempo da mensagem (ex: "12:01pm", "2h atrás")
  isRead?: boolean; // Novo: Para indicar se a mensagem foi lida (opcional)
  onClick?: () => void; // Novo: Handler para clique na notificação
}

const MessageNotification = ({
  id,
  img,
  fallback,
  title,
  content,
  time,
  isRead = false, // Valor padrão para 'isRead'
  onClick,
}: MessageNotificationProps) => {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      key={id}
      className={cn(
        'flex items-center space-x-3 w-full h-16 rounded-2xl p-2',
        'cursor-pointer transition-colors duration-300',
        isRead ? 'bg-muted/30 hover:bg-muted/50' : 'bg-accent/30 hover:bg-accent/50' // Altera fundo com base no status de leitura
      )}
      onClick={onClick}
      // biome-ignore lint/a11y/useSemanticElements: <explanation>
      role="listitem" // Semântica para listas de itens
      aria-labelledby={`message-title-${id}`}
      aria-describedby={`message-content-${id}`}
    >
      <Avatar>
        {/* Adicione um alt para a imagem do avatar para acessibilidade */}
        <AvatarImage src={img} alt={`Avatar de ${title}`} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>

      <div className='flex flex-col space-y-1 flex-1 min-w-0'> {/* Usando flex-1 e min-w-0 para flexibilidade */}
        <div className='flex items-center justify-between w-full p-0.5'>
          <h2 id={`message-title-${id}`} className={cn(
            'text-sm font-semibold truncate', // truncate para o título também, se for muito longo
            isRead ? 'text-muted-foreground' : 'text-foreground' // Cor do título baseada no status de leitura
          )}>
            {title}
          </h2>
          <span className='text-xs text-muted-foreground shrink-0 ml-2'> {/* shrink-0 para o tempo não encolher */}
            {time}
          </span>
        </div>
        {/* O p aqui é mais adequado para o conteúdo da mensagem */}
        <p
          id={`message-content-${id}`}
          className={cn(
            'text-xs p-0.5 text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis', // text-ellipsis para "..."
            isRead ? 'opacity-70' : 'opacity-100' // Opacidade para mensagens lidas
          )}
        >
          {content}
        </p>
      </div>
    </div>
  );
};

export { MessageNotification };