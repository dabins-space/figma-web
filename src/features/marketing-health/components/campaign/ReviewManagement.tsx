import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, MessageSquare, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const reviewData = [
  { name: "긍정", value: 78, color: "#00B894" },
  { name: "부정", value: 22, color: "#E74C3C" }
];

export function ReviewManagement() {
  return (
    <Card className="p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">리뷰관리</h3>
          <p className="text-sm text-gray-600">네이버/땡겨요 통합</p>
        </div>
        <Button variant="outline" size="sm">
          리뷰 리포트 보기
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Average Rating */}
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">평균 평점</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">4.5</div>
        </div>

        {/* Weekly Reviews */}
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-5 h-5 text-[#3580FF]" />
            <span className="text-sm text-gray-600">이번주 리뷰</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">24</span>
            <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
              +12
            </Badge>
          </div>
        </div>

        {/* Review Ratio Chart */}
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">긍정/부정 비율</span>
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reviewData}
                  cx="50%"
                  cy="50%"
                  innerRadius={15}
                  outerRadius={30}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {reviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-r from-[#FF7A00]/5 to-[#FFD8B0]/10 p-4 rounded-xl border border-[#FF7A00]/20">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-[#FF7A00]/10 rounded-lg flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-[#FF7A00]" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800 font-medium mb-1">AI 추천</p>
            <p className="text-sm text-gray-700">
              최근 부정 리뷰가 늘었어요. 단골 대상 쿠폰 이벤트를 제안할까요?
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}