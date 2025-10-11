import { Card } from "@/components/ui/card";
import { Bot, TrendingUp, Users, ShoppingBag } from "lucide-react";

export function AISummaryBox() {
  return (
    <Card className="p-6 bg-gradient-to-br from-[#FF7A00]/5 to-[#FF7A00]/10 rounded-2xl border border-[#FF7A00]/20">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-[#FF7A00]/20 rounded-lg">
          <Bot className="w-5 h-5 text-[#FF7A00]" />
        </div>
        <h3 className="font-semibold text-gray-900">AI 매장 분석 요약</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white/80 p-4 rounded-lg">
          <p className="text-gray-800 leading-relaxed">
            이번 주 매출은 전주 대비 <span className="font-semibold text-[#00B894]">8% 증가</span>했습니다. 
            주말 방문 비중이 높으며, 땡겨요 배달 매출은 전체의 <span className="font-semibold text-[#FF7A00]">23%</span>를 차지합니다.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-[#00B894]" />
            </div>
            <div className="text-sm font-medium text-gray-900">매출 증가</div>
            <div className="text-xs text-gray-600">연속 3주</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-[#3580FF]" />
            </div>
            <div className="text-sm font-medium text-gray-900">고객 만족도</div>
            <div className="text-xs text-gray-600">4.5/5.0</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ShoppingBag className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <div className="text-sm font-medium text-gray-900">평균 객단가</div>
            <div className="text-xs text-gray-600">₩15,800</div>
          </div>
        </div>
        
        <div className="bg-white/80 p-3 rounded-lg border-l-4 border-[#FF7A00]">
          <p className="text-sm text-gray-700">
            <span className="font-medium">추천:</span> 주말 특별 메뉴 프로모션을 통해 방문 고객을 늘려보세요. 
            현재 트렌드가 지속된다면 이번 달 목표 달성이 가능합니다.
          </p>
        </div>
      </div>
    </Card>
  );
}