import React, { useState } from 'react';

// [修改] 擴充 Props，新增 onReset 屬性來接收上層傳來的重啟指令
interface ChatInputProps {
  isWaiting: boolean;
  onSendMessage: (text: string) => void;
  onReset: () => void; 
}

export default function ChatInput({ isWaiting, onSendMessage, onReset }: ChatInputProps) {
  const [input, setInput] = useState(''); // 輸入框專屬的小記憶

  const handleSend = () => {
    if (input.trim() === '' || isWaiting) return; // 防呆機制
    onSendMessage(input);
    setInput('');
  };

  return (
    // [修改] 將外層從原本的水平排列改為 flex-col (垂直排列)，並微調間距
    <div className="p-4 border-t border-zinc-800 flex flex-col gap-3">
      
      {/* 模塊 A：預留的上方工具列 (Toolbar) */}
      <div className="flex gap-2">
        <button 
          onClick={onReset}
          disabled={isWaiting}
          // 使用暗紅色調的按鈕，避免與主發送按鈕搶視覺焦點，同時帶有「危險/重置」的語意
          className="bg-red-900/30 text-red-400 border border-red-800 px-3 py-1 rounded text-sm hover:bg-red-900/60 transition-colors disabled:opacity-50"
        >
          🔄 重啟對話
        </button>
        
        {/* 未來如果你想擴充功能，直接在這裡加入新的 button 即可，它們會自動水平排列 */}
        {/* <button>⚙️ 模型設定</button> */}
        {/* <button>💾 儲存快照</button> */}
      </div>

      {/* 模塊 B：原本的輸入區 (水平排列) */}
      <div className="flex gap-2">
        <textarea 
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded p-2 resize-none focus:outline-none focus:border-zinc-500" 
          placeholder="請輸入訊息..."
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          // 支援按下 Enter 快捷發送 (可選填加，提升操作手感)
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button 
          onClick={handleSend}
          disabled={isWaiting}
          className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          發送
        </button>
      </div>

    </div>
  );
}