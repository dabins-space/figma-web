import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { FileText, Eye, TrendingDown, Lightbulb } from "lucide-react";

export function BlogManagement() {
  return (
    <Card className="p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">블로그관리</h3>
          <p className="text-sm text-gray-600">콘텐츠 마케팅</p>
        </div>
        <Button className="bg-[#FF7A00] hover:bg-[#E86E00] text-white">
          AI 콘텐츠 제안받기
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-5 h-5 text-[#3580FF]" />
            <span className="text-sm text-gray-600">최근 30일 발행</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">3건</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="w-5 h-5 text-[#00B894]" />
            <span className="text-sm text-gray-600">총 조회 수</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">1,247</div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200 mb-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
            <TrendingDown className="w-4 h-4 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-orange-800 font-medium mb-1">AI 인사이트</p>
            <p className="text-sm text-orange-700">
              블로그 발행량이 업종 평균보다 20% 낮아요. 
              정기적인 포스팅으로 고객 유입을 늘려보세요.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white p-4 rounded-xl border border-gray-100">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-4 h-4 text-[#FF7A00]" />
          <span className="text-sm font-medium text-gray-900">최근 게시물</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <h5 className="text-sm font-medium text-gray-900">겨울 신메뉴 소개</h5>
              <p className="text-xs text-gray-500">12월 5일 발행</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
                조회 456회
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <h5 className="text-sm font-medium text-gray-900">매장 인테리어 리뉴얼</h5>
              <p className="text-xs text-gray-500">11월 28일 발행</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
                조회 623회
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}