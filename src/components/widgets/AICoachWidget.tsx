import { Card } from "../ui/card";
import { Bot, MessageCircle, TrendingUp, Lightbulb } from "lucide-react";

export function AICoachWidget() {
  return (
    <Card className="h-full p-4 bg-gradient-to-r from-[#FF7A00]/5 to-[#FF7A00]/10 rounded-2xl border border-[#FF7A00]/20 hover:shadow-md transition-shadow cursor-pointer">
      <div className="h-full flex items-center space-x-4">
        {/* Icon */}
        <div className="p-3 bg-[#FF7A00]/20 rounded-xl flex-shrink-0">
          <Bot className="w-6 h-6 text-[#FF7A00]" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900">AI 잘코치 추천</h3>
            <span className="flex items-center space-x-1 text-xs text-gray-600">
              <Lightbulb className="w-3 h-3 text-[#FF7A00]" />
              <span>2분 전</span>
            </span>
          </div>
          <p className="text-sm text-gray-800 line-clamp-1">
            "점심시간 매출이 20% 증가했어요! 런치 메뉴 홍보를 더 늘려보는 것은 어떨까요?"
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden md:inline">3개 조언</span>
          </div>
          <span className="text-sm text-white bg-[#FF7A00] hover:bg-[#E86E00] px-4 py-2 rounded-full font-medium transition-colors">
            대화하기
          </span>
        </div>
      </div>
    </Card>
  );
}