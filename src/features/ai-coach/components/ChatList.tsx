import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Star, MoreHorizontal, Plus } from "lucide-react";

interface ChatItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isFavorite: boolean;
  unreadCount?: number;
}

const recentChats: ChatItem[] = [
  {
    id: "1",
    title: "매출 트렌드 분석",
    lastMessage: "지난 주 매출이 12% 증가했습니다. 주말 매출이...",
    timestamp: "방금 전",
    isFavorite: true,
    unreadCount: 2
  },
  {
    id: "2",
    title: "리뷰 이벤트 기획",
    lastMessage: "고객 리뷰 이벤트로 참여율을 높여보세요.",
    timestamp: "1시간 전",
    isFavorite: false
  },
  {
    id: "3",
    title: "예약률 개선 방안",
    lastMessage: "노쇼율을 줄이는 3가지 방법을 제안드려요.",
    timestamp: "어제",
    isFavorite: true
  },
  {
    id: "4",
    title: "SNS 마케팅 전략",
    lastMessage: "인스타그램 릴스 콘텐츠 아이디어 10가지",
    timestamp: "2일 전",
    isFavorite: false
  }
];

interface ChatListProps {
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatList({ selectedChatId, onChatSelect, onNewChat }: ChatListProps) {
  const [activeTab, setActiveTab] = useState<"recent" | "favorites">("recent");

  const filteredChats = activeTab === "favorites" 
    ? recentChats.filter(chat => chat.isFavorite)
    : recentChats;

  return (
    <div className="w-80 bg-[#F7F8FA] border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">대화 목록</h2>
          <Button 
            onClick={onNewChat}
            size="sm" 
            className="bg-[#FF7A00] hover:bg-[#E86E00] text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            새 대화
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1">
          <Button
            variant={activeTab === "recent" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("recent")}
            className={`flex-1 text-sm ${
              activeTab === "recent" 
                ? "bg-[#FF7A00] text-white hover:bg-[#E86E00]" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            최근 대화
          </Button>
          <Button
            variant={activeTab === "favorites" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 text-sm ${
              activeTab === "favorites" 
                ? "bg-[#FF7A00] text-white hover:bg-[#E86E00]" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            즐겨찾기
          </Button>
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`p-3 rounded-xl cursor-pointer transition-colors hover:bg-white group ${
                selectedChatId === chat.id ? "bg-white shadow-sm border border-[#FF7A00]/20" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="p-2 bg-[#FF7A00]/10 rounded-lg flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#FF7A00]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate text-sm">
                        {chat.title}
                      </h3>
                      {chat.isFavorite && (
                        <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      {chat.unreadCount && (
                        <Badge className="bg-[#FF7A00] text-white text-xs px-1.5 py-0.5">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex-shrink-0"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Empty State */}
      {filteredChats.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {activeTab === "favorites" ? "즐겨찾기한 대화가 없습니다" : "아직 대화가 없습니다"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}