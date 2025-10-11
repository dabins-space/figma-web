import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Search, MousePointer, TrendingUp, DollarSign } from "lucide-react";

export function AdManagement() {
  return (
    <Card className="p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">광고관리</h3>
          <p className="text-sm text-gray-600">네이버 검색광고</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-red-50 text-red-600 border-red-200 flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>광고 진단 필요</span>
          </Badge>
          <Button className="bg-[#FF7A00] hover:bg-[#E86E00] text-white">
            AI 광고 피드백 받기
          </Button>
        </div>
      </div>

      {/* Ad Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-[#FF7A00]" />
            <span className="text-sm text-gray-600">예산 소진율</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">73%</div>
          <div className="text-xs text-gray-500 mt-1">₩876,000 / ₩1,200,000</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <MousePointer className="w-5 h-5 text-[#3580FF]" />
            <span className="text-sm text-gray-600">클릭률</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">2.8%</div>
          <div className="text-xs text-red-500 mt-1">업종 평균 3.2%</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#00B894]" />
            <span className="text-sm text-gray-600">전환율</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">4.1%</div>
          <div className="text-xs text-[#00B894] mt-1">업종 평균보다 높음</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <Search className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">노출 수</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">45K</div>
          <div className="text-xs text-gray-500 mt-1">이번 달</div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">활성 캠페인</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900">"맛집 추천" 키워드</h5>
              <p className="text-xs text-gray-500">일 예산: ₩50,000</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
                성과 좋음
              </Badge>
              <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200">
                클릭률 2.9%
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900">"신메뉴" 키워드</h5>
              <p className="text-xs text-gray-500">일 예산: ₹30,000</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-50 text-red-600 border-red-200">
                개선 필요
              </Badge>
              <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200">
                클릭률 1.8%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-800 font-medium mb-1">광고 최적화 제안</p>
            <p className="text-sm text-blue-700">
              "신메뉴" 키워드 성과가 낮습니다. 
              키워드를 "새로운 메뉴", "시즌 메뉴"로 확장하고 광고 문구를 수정해보세요.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}