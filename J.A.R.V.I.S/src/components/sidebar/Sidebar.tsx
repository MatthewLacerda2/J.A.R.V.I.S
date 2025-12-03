import { FileText, MessageSquare } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { MediaList } from "./MediaList";
import { ChatbotPanel } from "./chatbot/ChatbotPanel";

type Tab = "files" | "assistant";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>("files");

  return (
    <div className="w-72 h-screen bg-black border-r border-gray-800 flex flex-col">
      <div className="px-3 py-3 border-b border-gray-900">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("files")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
              activeTab === "files"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-900"
            )}
          >
            <FileText size={18} />
            Files
          </button>
          <button
            onClick={() => setActiveTab("assistant")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
              activeTab === "assistant"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-900"
            )}
          >
            <MessageSquare size={18} />
            Assistant
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === "files" ? (
          <div className="h-full overflow-y-auto">
            <MediaList />
          </div>
        ) : (
          <ChatbotPanel />
        )}
      </div>
    </div>
  );
}
