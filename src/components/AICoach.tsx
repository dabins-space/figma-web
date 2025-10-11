import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { ChatHeader } from "./ai-coach/ChatHeader";
import { ChatList } from "./ai-coach/ChatList";
import { ChatMessages } from "./ai-coach/ChatMessages";
import { ChatInput } from "./ai-coach/ChatInput";
import { SidePanel } from "./ai-coach/SidePanel";

type PageType = "dashboard" | "health-index" | "sales-management" | "marketing" | "reservations" | "ai-coach" | "news" | "settings";

interface AICoachProps {
  onNavigate?: (page: PageType) => void;
}

export function AICoach({ onNavigate }: AICoachProps) {
  const [selectedChatId, setSelectedChatId] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleSendMessage = (message: string) => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    // Simulate AI processing with progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 300);

    // Reset after 3 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
      setLoadingProgress(0);
    }, 3000);
  };

  const handleNewChat = () => {
    // Create new chat logic
    const newChatId = Date.now().toString();
    setSelectedChatId(newChatId);
  };

  const handleCommandSelect = (command: string) => {
    handleSendMessage(command);
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <ChatHeader isLoading={isLoading} loadingProgress={loadingProgress} onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List */}
        <ChatList
          selectedChatId={selectedChatId}
          onChatSelect={setSelectedChatId}
          onNewChat={handleNewChat}
        />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatMessages selectedChatId={selectedChatId} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>

        {/* Side Panel */}
        <SidePanel onCommandSelect={handleCommandSelect} />
      </div>

      {/* Floating Action Button - New Chat */}
      <Button
        onClick={handleNewChat}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#FF7A00] hover:bg-[#E86E00] shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        size="icon"
      >
        <Plus className="w-6 h-6 text-white" />
        <span className="sr-only">새 대화 시작</span>
      </Button>
    </div>
  );
}