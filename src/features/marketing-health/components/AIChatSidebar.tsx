import { Bot, Send, Calendar, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import type { ChatMessage, ActionPlan } from "@/types/actionPlan";
import { generateActionPlan } from "@/api/actionPlan";

const quickButtons = [
  "SNS 마케팅 전략 수립해줘",
  "고객 유치 이벤트 기획해줘",
  "브랜드 인지도 높이는 방법 알려줘",
  "지역 마케팅 전략 만들어줘",
  "디지털 마케팅 플랜 세워줘",
  "신메뉴 홍보 전략 알려줘",
];

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content: "안녕하세요! AI 잘코치입니다. 마케팅 관련 질문을 해주시면 구체적인 액션 플랜을 만들어드릴게요! 🤖",
  },
];

interface AIChatSidebarProps {
  onActionPlanGenerated?: (actionPlan: ActionPlan) => void;
  isGoogleSignedIn?: boolean;
}

export function AIChatSidebar({ onActionPlanGenerated, isGoogleSignedIn = false }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickButton = async (text: string) => {
    await handleSendMessage(text);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user" as const, content: messageText, timestamp: new Date() },
    ];
    setMessages(newMessages);

    setIsGenerating(true);

    try {
      // AI 액션 플랜 생성 (대화 맥락 포함)
      const actionPlan = await generateActionPlan({
        messages: newMessages,
        user_context: {
          business_type: "카페", // 기본값, 나중에 사용자 설정에서 가져올 수 있음
          target_audience: "20-40대 커피 애호가",
          current_challenges: "신규 고객 유치 및 브랜드 인지도 향상",
          conversation_context: {
            total_messages: newMessages.length,
            previous_topics: newMessages.slice(0, -1).map(msg => msg.content).join(' | '),
            current_focus: messageText
          }
        },
      });

      // 성공 메시지 추가 (대화 진행 상황에 따라 다르게)
      const isFollowUp = newMessages.length > 3;
      const successContent = isFollowUp 
        ? `🔄 **대화 기반 액션 플랜 업데이트**!\n\n📋 **${actionPlan.plan_title}**\n\n이전 대화 내용을 반영하여 더욱 구체적인 ${actionPlan.items.length}개의 액션 아이템을 준비했습니다.\n\n💡 Google Calendar에 등록하여 실제 일정으로 관리할 수 있습니다.`
        : `✅ 마케팅 액션 플랜이 생성되었습니다!\n\n📋 **${actionPlan.plan_title}**\n\n총 ${actionPlan.items.length}개의 액션 아이템이 준비되었습니다.\n\n💡 Google Calendar에 등록하여 실제 일정으로 관리할 수 있습니다.`;
      
      const successMessage: ChatMessage = {
        role: "assistant",
        content: successContent,
        timestamp: new Date(),
      };

      setMessages([...newMessages, successMessage]);

      // 부모 컴포넌트에 액션 플랜 전달
      if (onActionPlanGenerated) {
        onActionPlanGenerated(actionPlan);
      }

    } catch (error) {
      console.error('액션 플랜 생성 실패:', error);
      
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: `❌ 액션 플랜 생성에 실패했습니다.\n\n오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n다시 시도해주세요.`,
        timestamp: new Date(),
      };

      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      handleSendMessage(input);
      setInput("");
    }
  };

  return (
    <Card className="h-full flex flex-col bg-white rounded-2xl border-2 border-[#FFE1C1]">
      {/* Header */}
      <div className="p-5 border-b border-[#FFD2A8] bg-white">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-[#FF914D]" />
          <div className="flex-1">
            <h4 className="text-[18px] font-black text-[#FF914D]">AI 잘코치와 대화하기 🤖</h4>
            <p className="text-xs text-gray-500 font-light">실시간 마케팅 액션 플랜 생성</p>
          </div>
          {isGoogleSignedIn && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Calendar className="w-3 h-3" />
              <span>연결됨</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Buttons */}
      <div className="p-4 bg-[#FFF8F2]">
        <div className="text-xs text-gray-600 mb-2 font-light">빠른 질문</div>
        <div className="flex flex-wrap gap-2">
          {quickButtons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs bg-white hover:bg-[#FFF5EB] border-[#FF914D] text-[#FF914D] rounded-full px-3 py-1 font-medium"
              onClick={() => handleQuickButton(button)}
              disabled={isGenerating}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {button}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-white custom-scrollbar">
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm font-normal ${
                  message.role === "user"
                    ? "bg-[#F6F6F6] text-[#333333]"
                    : "bg-[#FFF0E0] text-[#333333]"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#FFD2A8] bg-white">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isGenerating && handleSend()}
            placeholder={isGenerating ? "액션 플랜 생성 중..." : "마케팅 관련 질문을 입력하세요..."}
            className="bg-[#FFF5EB] border-[#FFE1C1] focus:border-[#FF914D] rounded-xl"
            disabled={isGenerating}
          />
          <Button 
            size="icon" 
            onClick={handleSend} 
            disabled={isGenerating || !input.trim()}
            className="flex-shrink-0 bg-[#FF914D] hover:bg-[#FFB36C] rounded-xl"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        {isGenerating && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-orange-300 border-t-transparent rounded-full animate-spin" />
              AI가 마케팅 액션 플랜을 생성하고 있습니다... (보통 10-20초 소요)
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}