import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Plus, Brain } from "lucide-react";
import { ReviewManagement } from "./components/ReviewManagement";
import { LoyaltyManagement } from "./components/LoyaltyManagement";
import { EventManagement } from "./components/EventManagement";
import { BlogManagement } from "./components/BlogManagement";
import { SocialMediaManagement } from "./components/SocialMediaManagement";
import { AdManagement } from "./components/AdManagement";
import { AICoachBanner } from "./components/AICoachBanner";
import { CustomizationModal } from "./components/CustomizationModal";

const defaultEnabledSections = ["review", "loyalty", "event"];

const sectionComponents = {
  review: ReviewManagement,
  loyalty: LoyaltyManagement,
  event: EventManagement,
  blog: BlogManagement,
  social: SocialMediaManagement,
  ad: AdManagement
};

const sectionTitles = {
  review: "리뷰관리",
  loyalty: "단골관리", 
  event: "이벤트관리",
  blog: "블로그관리",
  social: "SNS관리",
  ad: "광고관리"
};

export function MarketingManagement() {
  const [enabledSections, setEnabledSections] = useState<string[]>(defaultEnabledSections);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const handleSectionsChange = (newSections: string[]) => {
    setEnabledSections(newSections);
  };

  const EmptyStateCard = ({ sectionKey }: { sectionKey: string }) => (
    <Card className="p-8 bg-[#F7F8FA] rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#FF7A00] transition-colors cursor-pointer">
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="font-medium text-gray-900 mb-2">{sectionTitles[sectionKey as keyof typeof sectionTitles]}</h3>
        <p className="text-sm text-gray-600 mb-4">이 섹션을 활성화하려면 추가하기를 클릭하세요</p>
        <Button 
          variant="outline"
          onClick={() => setShowCustomizationModal(true)}
          className="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
        >
          추가하기
        </Button>
      </div>
    </Card>
  );

  return (
    <main className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">마케팅 관리</h1>
          <p className="text-gray-600">통합 마케팅 허브에서 고객 관리를 효율적으로 하세요</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowCustomizationModal(true)}
            className="flex items-center space-x-2 border-gray-300 hover:border-[#FF7A00] hover:text-[#FF7A00]"
          >
            <Settings className="w-4 h-4" />
            <span>커스터마이징 설정</span>
          </Button>
          
          <Button
            onClick={() => setShowAIModal(true)}
            className="bg-[#FF7A00] hover:bg-[#E86E00] text-white flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>잘코치에게 물어보기</span>
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Render enabled sections */}
        {Object.keys(sectionComponents).map((sectionKey) => {
          const Component = sectionComponents[sectionKey as keyof typeof sectionComponents];
          const isEnabled = enabledSections.includes(sectionKey);
          
          return (
            <div key={sectionKey} className="w-full">
              {isEnabled ? (
                <div className="animate-in fade-in-0 duration-500">
                  <Component />
                </div>
              ) : (
                <EmptyStateCard sectionKey={sectionKey} />
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-gradient-to-br from-[#FF7A00]/5 to-[#FFD8B0]/10 rounded-xl border border-[#FF7A00]/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FF7A00] mb-1">92%</div>
            <div className="text-sm text-gray-600">마케팅 건강도</div>
          </div>
        </Card>
        
        <Card className="p-4 bg-[#F7F8FA] rounded-xl border border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">2,347</div>
            <div className="text-sm text-gray-600">총 고객 수</div>
          </div>
        </Card>
        
        <Card className="p-4 bg-[#F7F8FA] rounded-xl border border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">15</div>
            <div className="text-sm text-gray-600">활성 캠페인</div>
          </div>
        </Card>
        
        <Card className="p-4 bg-[#F7F8FA] rounded-xl border border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">₩1.2M</div>
            <div className="text-sm text-gray-600">마케팅 ROI</div>
          </div>
        </Card>
      </div>

      {/* AI Insights Banner */}
      <Card className="p-6 bg-gradient-to-r from-[#3580FF]/5 to-[#00B894]/5 rounded-2xl border border-[#3580FF]/20 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#3580FF]/10 rounded-xl">
              <Brain className="w-6 h-6 text-[#3580FF]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">이번 주 마케팅 인사이트</h3>
              <p className="text-sm text-gray-700">
                고객 재방문율이 12% 증가했습니다! 단골 고객 대상 특별 이벤트를 통해 
                더 큰 효과를 기대할 수 있어요.
              </p>
            </div>
          </div>
          <Button className="bg-[#3580FF] hover:bg-[#2563EB] text-white shrink-0">
            자세히 보기
          </Button>
        </div>
      </Card>

      {/* Customization Modal */}
      <CustomizationModal
        open={showCustomizationModal}
        onOpenChange={setShowCustomizationModal}
        enabledSections={enabledSections}
        onSectionsChange={handleSectionsChange}
      />

      {/* AI Coach Banner - Always visible */}
      <AICoachBanner />
    </main>
  );
}