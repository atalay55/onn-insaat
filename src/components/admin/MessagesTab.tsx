import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: any;
}

interface MessagesTabProps {
  messages: Message[];
  onDeleteMessage: (id: string) => Promise<void>;
}

export function MessagesTab({ messages, onDeleteMessage }: MessagesTabProps) {
  return (
    <div>
      <h2 className="text-3xl font-light text-white mb-8">Mesajlar</h2>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-white/60 py-12 bg-zinc-900 p-8 rounded-lg border border-zinc-800">
            <p>Henüz mesaj alınmamış</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-medium text-white text-lg">{message.name}</h3>
                  <p className="text-white/60 text-sm">{message.email}</p>
                  <p className="text-white/60 text-sm">{message.phone}</p>
                </div>
                <Button
                  onClick={() => onDeleteMessage(message.id)}
                  size="sm"
                  variant="outline"
                  className="border-red-600/30 text-red-400 hover:bg-red-600/20 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-white/70 mb-4 leading-relaxed">{message.message}</p>

              <p className="text-white/40 text-xs">
                {message.createdAt?.toDate?.()?.toLocaleString?.('tr-TR') || 'Tarih bilinmiyor'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}