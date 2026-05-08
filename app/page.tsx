//使用方式：npm run dev
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

  // 網頁載入時，去跟後端要角色菜單
  useEffect(() => {
    fetch('http://localhost:8000/characters')
      .then(res => res.json())
      .then(data => {
        if (data.characters) {
          setCharacterList(data.characters);
        }
      })
      .catch(err => console.error("無法載入角色清單:", err));
  }, []); 

  // 動作 1：選擇角色並初始化
  const handleSelectCharacter = async (charId: string) => {
    setSelectedChar(charId);
    setIsInitializing(true);
    setMessages([]); // 先清空當前畫面

    try {
      const response = await fetch('http://localhost:8000/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ char_id: charId }),
      });
      const data = await response.json();

      if (data.history && data.history.length > 0) {
        const restoredMessages = data.history
          .filter((msg: any) => msg.role !== 'system')
          .map((msg: any) => ({
            role: msg.role === 'assistant' ? 'ai' : msg.role,
            content: msg.content
          }));
        setMessages(restoredMessages);
      } else {
        setMessages([{ role: 'ai', content: data.reply }]);
      }

    } catch (error) {
      console.error("初始化失敗:", error);
      setMessages([{ role: 'ai', content: '（無法喚醒角色，請檢查後端是否啟動）' }]);
    } finally {
      setIsInitializing(false);
    }
  };

  // 動作 2：發送一般對話 
  const handleSendMessage = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsWaitingForReply(true); 

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

  // [新增動作]：重置特定角色對話
  const handleResetCharacter = async () => {
    if (!selectedChar) return;
    
    // 增加一個防呆確認機制，避免誤觸
    const confirmReset = window.confirm(`確定要完全清除並重置這個角色的所有記憶與對話嗎？\n此動作將同時清空資料庫與向量庫，且無法復原。`);
    if (!confirmReset) return;

    setIsInitializing(true);
    setMessages([]); // 先清空畫面，給予使用者反饋

    try {
      const response = await fetch('http://localhost:8000/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ char_id: selectedChar }),
      });
      const data = await response.json();
      
      setMessages([{ role: 'ai', content: data.reply }]);
      
    } catch (error) {
      console.error("重置失敗:", error);
      setMessages([{ role: 'ai', content: '（無法重置角色，請檢查後端日誌）' }]);
    } finally {
      setIsInitializing(false);
    }
  };

  // 單一且乾淨的輸出區塊
  return (
    <main className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar 
        characters={characterList}
        selectedChar={selectedChar} 
        isInitializing={isInitializing} 
        onSelectChar={handleSelectCharacter} 
      />
      
      <ChatArea 
        selectedChar={selectedChar}
        messages={messages}
        isWaiting={isWaitingForReply}
        onSendMessage={handleSendMessage}
        onReset={handleResetCharacter} 
      />
    </main>
  );
}