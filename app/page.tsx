export default function ChatPage() {
  return (
    // 這是一個全螢幕容器
    <main className="flex flex-col h-screen bg-black text-white">
      
      {/* 頂部標題列 */}
      <div className="p-4 border-b border-zinc-200 text-center font-bold">
        AI角色扮演聊天系統
      </div>

      {/* 訊息對話區 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-zinc-800 p-3 rounded-lg max-w-fit">
          AI：你好！我是你的助手，請問有什麼我可以幫你的？
        </div>
        <div className="bg-blue-600 p-3 rounded-lg max-w-fit ml-auto">
          使用者：我想測試一下界面。
        </div>
      </div>

      {/* 底部輸入框 */}
      <div className="p-4 border-t border-zinc-200">
        <div className="flex gap-2">
          <textarea 
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded p-2 resize-none" 
            placeholder="請輸入訊息..."
            rows={3} // 預設只顯示一行的高度
/>
          <button className="bg-white text-black px-4 py-2 rounded font-medium">
            發送
          </button>
        </div>
      </div>

    </main>
  );
}