interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[90%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-700 text-white'
            : 'bg-gray-800 text-gray-100'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap wrap-break-words">{content}</p>
      </div>
    </div>
  );
}
