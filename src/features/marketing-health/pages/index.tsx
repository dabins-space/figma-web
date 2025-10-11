import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, HelpCircle, BarChart3 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HealthScoreCard } from "../components/health/HealthScoreCard";
import { CustomerVisitsCard } from "../components/health/CustomerVisitsCard";
import { ReviewSummaryCard } from "../components/health/ReviewSummaryCard";
import { IntegratedSalesChart } from "../components/health/IntegratedSalesChart";
import { AIPredictionChart } from "../components/health/AIPredictionChart";
import { AISummaryBox } from "../components/health/AISummaryBox";

interface StoreHealthIndexProps {
  onNavigateToSales: () => void;
}

export default function MarketingHealthIndexPage({ onNavigateToSales }: StoreHealthIndexProps) {
  const [showIndustryAverage, setShowIndustryAverage] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  return (
    <main className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">마케팅 건강지수 진단</h1>
          <p className="text-gray-600">AI가 분석한 매장 운영 현황과 예측을 확인하세요</p>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 text-gray-500 border-gray-300 hover:border-[#FF7A00] hover:text-[#FF7A00] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
                onClick={() => setShowConnectionModal(true)}
              >
                <Link className="w-4 h-4" />
                <span>땡겨요 연동하기</span>
                <HelpCircle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>현재 연동되지 않았습니다. 클릭 시 연동 절차 안내</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <HealthScoreCard score={83} trend="up" change={5} />
        <CustomerVisitsCard />
        <ReviewSummaryCard />
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Integrated Sales Analysis */}
        <IntegratedSalesChart />

        {/* AI Prediction Chart */}
        <AIPredictionChart />

        {/* AI Summary */}
        <AISummaryBox />
      </div>

      {/* Industry Average Toggle */}
      <div className="mt-8 flex justify-center">
        <Button
          variant="ghost"
          onClick={() => setShowIndustryAverage(!showIndustryAverage)}
          className="text-gray-600 hover:text-[#FF7A00]"
        >
          {showIndustryAverage ? "업종 평균 숨기기" : "업종 평균 그래프 보기"}
        </Button>
      </div>

      {/* Industry Average Graph (conditional) */}
      {showIndustryAverage && (
        <div className="mt-6 p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">업종 평균 비교</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">우리 매장</div>
              <div className="text-2xl font-bold text-[#FF7A00]">83점</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600">업종 평균</div>
              <div className="text-2xl font-bold text-gray-600">71점</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600">상위 25%</div>
              <div className="text-2xl font-bold text-gray-600">78점</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600">상위 10%</div>
              <div className="text-2xl font-bold text-gray-600">92점</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
              상위 15% 매장입니다! 🎉
            </Badge>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div className="mt-12 flex justify-center">
        <Button 
          onClick={onNavigateToSales}
          className="bg-[#FF7A00] hover:bg-[#E86E00] text-white px-8 py-3 rounded-2xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          <BarChart3 className="w-5 h-5" />
          <span>매출관리 탭으로 이동</span>
        </Button>
      </div>

      {/* Connection Modal (placeholder) */}
      {showConnectionModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <h3 className="font-semibold text-gray-900 mb-2">땡겨요 계정 연결</h3>
            <p className="text-gray-600 mb-4">땡겨요 계정 연결 준비 중입니다.</p>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => setShowConnectionModal(false)}
              >
                닫기
              </Button>
              <Button 
                className="bg-[#FF7A00] hover:bg-[#E86E00] text-white"
                onClick={() => setShowConnectionModal(false)}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}