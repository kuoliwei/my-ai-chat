import React, { useState, useEffect } from 'react';
import ChatInput from './ChatInput';

interface Message {
  role: string;
  content: string;
}

interface ChatAreaProps {
  selectedChar: string;
  messages: Message[];
  isWaiting: boolean;
  onSendMessage: (text: string) => void;
}

export default function ChatArea({ selectedChar, messages, isWaiting, onSendMessage }: ChatAreaProps) {
  // 模型選單相關狀態
  const [models, setModels] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState('載入中...');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 初始化時抓取模型列表
useEffect(() => {
  fetch('http://localhost:8000/models')
    .then(res => res.json())
    .then(data => {
      if (data.models && data.models.length > 0) {
        setModels(data.models);
        
        // [關鍵修改] 優先使用後端指定的預設模型，若找不到才回退到第一個
        const systemDefault = data.default;
        if (data.models.includes(systemDefault)) {
          setCurrentModel(systemDefault);
        } else {
          setCurrentModel(data.models[0]);
        }
      }
    });
}, []);

  if (!selectedChar) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black text-gray-500">
        請從左側選擇一位角色開始對話
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-black text-white relative"> {/* 注意這裡加了 relative */}
      
      {/* 模型選擇按鈕 (右上角絕對定位) */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-zinc-800/80 hover:bg-zinc-700 px-3 py-1.5 rounded-full text-xs border border-zinc-700 flex items-center gap-2 transition-all"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {currentModel}
          <span className="text-[10px]">▼</span>
        </button>

        {/* 懸浮選單本體 */}
        {isMenuOpen && (
          <div className="absolute top-10 right-0 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden py-1">
            <div className="px-3 py-2 text-[10px] text-zinc-500 font-bold border-b border-zinc-800">切換推論引擎</div>
            {models.map(m => (
              <button
                key={m}
                onClick={async () => {
                  setCurrentModel(m);
                  setIsMenuOpen(false);
                  // [新增] 通知後端切換模型
                  try {
                    await fetch('http://localhost:8000/switch_model', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ model_name: m }),
                    });
                    console.log(`模型已成功切換為: ${m}`);
                  } catch (error) {
                    console.error("模型切換失敗:", error);
                  }
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-600 transition-colors ${currentModel === m ? 'text-blue-400' : 'text-gray-300'}`}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 訊息顯示區 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-zinc-800'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isWaiting && (
          <div className="p-3 rounded-lg max-w-[80%] bg-zinc-800 text-gray-400 animate-pulse">
            AI 正在思考中...
          </div>
        )}
      </div>

      {/* 輸入區 */}
      <ChatInput 
        isWaiting={isWaiting} 
        onSendMessage={onSendMessage} 
      />
    </div>
  );
}