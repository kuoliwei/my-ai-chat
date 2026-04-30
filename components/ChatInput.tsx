import React, { useState } from 'react';

interface ChatInputProps {
  isWaiting: boolean;
  onSendMessage: (text: string) => void;
}

export default function ChatInput({ isWaiting, onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState(''); // 輸入框專屬的小記憶

  const handleSend = () => {
    if (input.trim() === '' || isWaiting) return; // 防呆機制
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="p-4 border-t border-zinc-800 flex gap-2">
      <textarea 
        className="flex-1 bg-zinc-900 border border-zinc-700 rounded p-2 resize-none" 
        placeholder="請輸入訊息..."
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button 
        onClick={handleSend}
        disabled={isWaiting}
        className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-200 disabled:opacity-50"
      >
        發送
      </button>
    </div>
  );
}