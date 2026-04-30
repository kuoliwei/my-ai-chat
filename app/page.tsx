'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';

interface Message {
  role: string;
  content: string;
}

export default function ChatPage() {
  // 全域狀態管理
  const [characterList, setCharacterList] = useState<{id: string, name: string}[]>([]);
  const [selectedChar, setSelectedChar] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isWaitingForReply, setIsWaitingForReply] = useState(false);
  
  // [新增動作]：網頁載入時，去跟後端要角色菜單
  useEffect(() => {
    fetch('http://localhost:8000/characters')
      .then(res => res.json())
      .then(data => {
        if (data.characters) {
          setCharacterList(data.characters);
        }
      })
      .catch(err => console.error("無法載入角色清單:", err));
  }, []); // [] 代表只在網頁一打開時執行一次

  // 動作 1：選擇角色並初始化
  const handleSelectCharacter = async (charId: string) => {
    setSelectedChar(charId);
    setIsInitializing(true);
    setMessages([]); // 清空先前的對話

    try {
      // 呼叫我們後端新寫好的 /initialize 接口
      const response = await fetch('http://localhost:8000/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ char_id: charId }),
      });
      const data = await response.json();
      
      // 收到開場白
      setMessages([{ role: 'ai', content: data.reply }]);
    } catch (error) {
      console.error("初始化失敗:", error);
      setMessages([{ role: 'ai', content: '（無法喚醒角色，請檢查後端是否啟動）' }]);
    } finally {
      setIsInitializing(false);
    }
  };

  // 動作 2：發送一般對話 (改編自你原本的邏輯[cite: 6])
  const handleSendMessage = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsWaitingForReply(true); // 開啟思考中動畫

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      console.error('連線錯誤:', error);
      setMessages(prev => [...prev, { role: 'ai', content: '（連線失敗）' }]);
    } finally {
      setIsWaitingForReply(false);
    }
  };

  return (
    <main className="flex h-screen bg-black text-white overflow-hidden">
      {/* 模組 1：側邊欄 */}
      <Sidebar 
        characters={characterList}
        selectedChar={selectedChar} 
        isInitializing={isInitializing} 
        onSelectChar={handleSelectCharacter} 
      />
      
      {/* 模組 2：主對話區 */}
      <ChatArea 
        selectedChar={selectedChar}
        messages={messages}
        isWaiting={isWaitingForReply}
        onSendMessage={handleSendMessage}
      />
    </main>
  );
}