import React from 'react';

// 刪除原本寫死的 const CHARACTERS = [...]

interface SidebarProps {
  characters: { id: string; name: string }[]; // [新增] 從外部接收角色清單
  selectedChar: string;
  isInitializing: boolean;
  onSelectChar: (charId: string) => void;
}

export default function Sidebar({ characters, selectedChar, isInitializing, onSelectChar }: SidebarProps) {
  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800 font-bold text-center text-gray-300">
        角色大廳
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* [修改] 改用外面傳進來的 characters 陣列進行渲染 */}
        {characters.map(char => (
          <button
            key={char.id}
            disabled={isInitializing}
            onClick={() => onSelectChar(char.id)}
            className={`w-full text-left p-3 rounded transition-colors ${
              selectedChar === char.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
            } ${isInitializing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {char.name}
          </button>
        ))}
      </div>
      {isInitializing && (
        <div className="p-4 text-center text-sm text-blue-400 animate-pulse">
          正在喚醒角色模型...
        </div>
      )}
    </div>
  );
}