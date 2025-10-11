import { useState } from "react";
import { Button } from "../ui/button";
import { X, MessageCircle, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Textarea } from "../ui/textarea";

export function AICoachBanner() {
  const [showModal, setShowModal] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const preloadedPrompt = "이번 주에 고객 유입이 줄었어요. 어떤 프로모션을 하면 좋을까요?";

  return (
    <>
      {/* Floating Banner */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-200 ${
        isMinimized ? 'w-14 h-14' : 'w-80 max-w-sm'
      }`}>
        {isMinimized ? (
          /* Minimized FAB */
          <Button
            onClick={() => setIsMinimized(false)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FFB566] hover:from-[#E86E00] hover:to-[#FF7A00] shadow-lg hover:shadow-xl transition-all duration-200 animate-bounce"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        ) : (
          /* Full Banner */
          <div className="bg-gradient-to-r from-[#FF7A00] to-[#FFB566] p-4 rounded-2xl shadow-lg border border-[#FF7A00]/20 animate-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-white/20 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white">잘코치</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-white mb-3 leading-relaxed">
              💡 오늘 매출을 높이는 방법, 잘코치에게 물어보세요!
            </p>
            
            <Button
              onClick={() => setShowModal(true)}
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/20"
            >
              지금 물어보기
            </Button>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="p-2 bg-[#FF7A00]/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-[#FF7A00]" />
              </div>
              <span>잘코치에게 물어보기</span>
            </DialogTitle>
            <DialogDescription>
              AI 코치가 매장 운영에 대한 질문에 답변해드립니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-[#F7F8FA] p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">AI 코치가 도와드릴게요!</p>
              <p className="text-xs text-gray-500">
                매장 운영, 마케팅, 고객 관리 등 어떤 것이든 물어보세요.
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                질문을 입력해주세요
              </label>
              <Textarea
                placeholder="예: 이번 주에 고객 유입이 줄었어요. 어떤 프로모션을 하면 좋을까요?"
                defaultValue={preloadedPrompt}
                className="min-h-[100px] resize-none"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-[#FF7A00] hover:bg-[#E86E00] text-white"
                onClick={() => {
                  // Here you would typically send the question to the AI service
                  setShowModal(false);
                }}
              >
                질문하기
              </Button>
            </div>
            
            <div className="bg-[#FFD8B0]/20 p-3 rounded-lg border border-[#FF7A00]/20">
              <p className="text-xs text-[#FF7A00]">
                💡 빠른 질문: "매출 증대 방법", "고객 재방문 늘리기", "이벤트 아이디어"
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}