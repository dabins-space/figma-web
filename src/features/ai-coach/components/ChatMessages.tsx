import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, TrendingUp, Calendar, ArrowRight, Copy, ThumbsUp, ThumbsDown } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
  isTyping?: boolean;
  actionable?: boolean;
  data?: {
    type: "metric" | "recommendation" | "prediction";
    title: string;
    value: string;
    change?: string;
    icon?: any;
  };
}

const sampleMessages: Message[] = [
  {
    id: "1",
    type: "user",
    content: "이번주 마케팅 추천해줘",
    timestamp: "14:30"
  },
  {
    id: "2",
    type: "ai",
    content: "안녕하세요! 현재 매장 데이터를 분석해서 맞춤형 마케팅 전략을 제안드릴게요.",
    timestamp: "14:30"
  },
  {
    id: "3",
    type: "ai",
    content: "분석 결과, 다음과 같은 인사이트를 발견했습니다:",
    timestamp: "14:31",
    actionable: true,
    data: {
      type: "metric",
      title: "지난주 매출 증가",
      value: "12%",
      change: "+₩890,000",
      icon: TrendingUp
    }
  },
  {
    id: "4",
    type: "ai",
    content: "주말 방문 고객이 늘어나고 있어요. 리뷰 이벤트를 진행하시면 예약률이 20% 더 증가할 것으로 예상됩니다. 바로 실행해보시겠어요?",
    timestamp: "14:31",
    actionable: true,
    data: {
      type: "recommendation",
      title: "리뷰 이벤트 실행 시 예약률 증가 예상",
      value: "+20%",
      icon: Calendar
    }
  }
];

interface ChatMessagesProps {
  selectedChatId?: string;
}

export function ChatMessages({ selectedChatId }: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleExecuteAction = (messageId: string) => {
    // Add confirmation message
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "ai",
      content: "리뷰 이벤트가 실행되었습니다! 네이버 예약과 SNS에 자동으로 게시되었어요.",
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const DataCard = ({ data, messageId }: { data: any; messageId: string }) => {
    const IconComponent = data.icon;
    
    return (
      <Card className="p-4 bg-gradient-to-r from-[#FF7A00]/5 to-[#FFE0C2]/10 border border-[#FF7A00]/20 mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#FF7A00]/10 rounded-lg">
              <IconComponent className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 text-sm">{data.title}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-lg font-bold text-[#FF7A00]">{data.value}</span>
                {data.change && (
                  <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20 text-xs">
                    {data.change}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {data.type === "recommendation" && (
            <Button
              onClick={() => handleExecuteAction(messageId)}
              className="bg-[#FF7A00] hover:bg-[#E86E00] text-white flex items-center space-x-1"
              size="sm"
            >
              <span>실행하기</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">매출 트렌드 분석</h3>
        <p className="text-sm text-gray-600">AI가 실시간으로 분석하고 있습니다</p>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start space-x-3 max-w-3xl ${
                message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === "user" 
                    ? "bg-gray-200" 
                    : "bg-[#FF7A00]/10"
                }`}>
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-[#FF7A00]" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col ${message.type === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-3 rounded-2xl max-w-lg ${
                    message.type === "user"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-[#FF7A00] text-white"
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>

                  {/* Data Card */}
                  {message.data && message.type === "ai" && (
                    <div className="w-full max-w-lg">
                      <DataCard data={message.data} messageId={message.id} />
                    </div>
                  )}

                  {/* Message Actions */}
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                    {message.type === "ai" && (
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <Copy className="w-3 h-3 text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <ThumbsUp className="w-3 h-3 text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <ThumbsDown className="w-3 h-3 text-gray-400" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#FF7A00]/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#FF7A00]" />
                </div>
                <div className="bg-[#FF7A00] text-white px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}