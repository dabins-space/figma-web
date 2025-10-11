import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Send, Mic, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [autoExecute, setAutoExecute] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Input Area */}
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="예) 이번주 마케팅 추천해줘"
              className="resize-none min-h-[44px] max-h-32 pr-20 border-gray-300 focus:border-[#FF7A00] focus:ring-[#FF7A00]"
              rows={1}
              disabled={isLoading}
            />
            
            {/* Input Actions */}
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-gray-500 hover:text-gray-700"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-gray-500 hover:text-gray-700"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-[#FF7A00] hover:bg-[#E86E00] text-white px-4 py-2 h-11"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Auto Execute Toggle */}
        <div className="flex items-center justify-between p-3 bg-[#F7F8FA] rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg">
              <Send className="w-4 h-4 text-[#FF7A00]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">자동 실행모드</h4>
              <p className="text-xs text-gray-600">AI 제안을 자동으로 실행합니다</p>
            </div>
          </div>
          <Switch
            checked={autoExecute}
            onCheckedChange={setAutoExecute}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">빠른 질문:</span>
          <div className="flex flex-wrap gap-2">
            {[
              "매출 분석해줘",
              "이벤트 추천해줘", 
              "예약률 높이는 방법",
              "리뷰 관리 팁"
            ].map((quickAction) => (
              <Button
                key={quickAction}
                variant="outline"
                size="sm"
                onClick={() => setMessage(quickAction)}
                className="text-xs h-7 px-3 border-gray-300 hover:border-[#FF7A00] hover:text-[#FF7A00]"
              >
                {quickAction}
              </Button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}