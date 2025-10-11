import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Link, HelpCircle, Brain, MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ReservationSummaryCards } from "./components/ReservationSummaryCards";
import { ReservationTrendChart } from "./components/ReservationTrendChart";
import { EventEffectAnalysis } from "./components/EventEffectAnalysis";
import { TrendAnalysisSection } from "./components/TrendAnalysisSection";
import { ReservationSettings } from "./components/ReservationSettings";

export function ReservationManagement() {
  const [showSettings, setShowSettings] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showAICoachModal, setShowAICoachModal] = useState(false);

  const preloadedPrompt = "최근 예약률이 낮아요. 이벤트나 쿠폰 제안을 추천해줘.";

  return (
    <main className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">예약관리</h1>
          <p className="text-gray-600">스마트 예약 관리로 고객 만족도를 높이세요</p>
        </div>
        
        <div className="flex items-center space-x-3">
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
                  <span>네이버 예약 연동하기</span>
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>현재 연동되지 않았습니다. 클릭 시 네이버 예약 연동 안내</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-2 border-gray-300 hover:border-[#FF7A00] hover:text-[#FF7A00]"
          >
            <Settings className="w-4 h-4" />
            <span>설정</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <ReservationSummaryCards />

      {/* Reservation Trend Chart */}
      <ReservationTrendChart />

      {/* Event Effect Analysis */}
      <EventEffectAnalysis />

      {/* Trend Analysis & Reminders */}
      <TrendAnalysisSection />

      {/* AI Coach Banner - Fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-gradient-to-r from-[#FF7A00] to-[#FFB566] p-4 rounded-2xl shadow-lg border border-[#FF7A00]/20 max-w-sm animate-in slide-in-from-bottom-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white font-medium mb-1">잘코치</p>
              <p className="text-sm text-white/90 mb-3 leading-relaxed">
                💬 예약률 높이는 방법, 잘코치에게 물어보세요!
              </p>
              <Button
                onClick={() => setShowAICoachModal(true)}
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/20 text-sm"
              >
                AI에게 묻기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Modal */}
      {showConnectionModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <h3 className="font-semibold text-gray-900 mb-2">네이버 예약 연동</h3>
            <p className="text-gray-600 mb-4">네이버 예약 연동 준비 중입니다.</p>
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

      {/* AI Coach Modal */}
      <Dialog open={showAICoachModal} onOpenChange={setShowAICoachModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="p-2 bg-[#FF7A00]/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-[#FF7A00]" />
              </div>
              <span>잘코치에게 물어보기</span>
            </DialogTitle>
            <DialogDescription>
              예약 관리 AI 코치에게 질문하고 답변을 받아보세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-[#F7F8FA] p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">예약 관리 AI 코치가 도와드릴게요!</p>
              <p className="text-xs text-gray-500">
                예약률 개선, 노쇼 방지, 고객 관리 등 어떤 것이든 물어보세요.
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                질문을 입력해주세요
              </label>
              <Textarea
                placeholder="예: 최근 예약률이 낮아요. 이벤트나 쿠폰 제안을 추천해줘."
                defaultValue={preloadedPrompt}
                className="min-h-[100px] resize-none"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAICoachModal(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-[#FF7A00] hover:bg-[#E86E00] text-white"
                onClick={() => {
                  // Here you would typically send the question to the AI service
                  setShowAICoachModal(false);
                }}
              >
                질문하기
              </Button>
            </div>
            
            <div className="bg-[#FFE0C2]/30 p-3 rounded-lg border border-[#FF7A00]/20">
              <p className="text-xs text-[#FF7A00]">
                💡 빠른 질문: "예약률 높이기", "노쇼 줄이기", "재예약 늘리기"
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <ReservationSettings 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
    </main>
  );
}