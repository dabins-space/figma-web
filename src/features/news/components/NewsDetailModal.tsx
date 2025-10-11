import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, MapPin, Building, Bookmark } from "lucide-react";
import type { NewsItem } from "./NewsCard";

interface NewsDetailModalProps {
  item: NewsItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookmarkToggle: (id: string) => void;
}

export function NewsDetailModal({ item, open, onOpenChange, onBookmarkToggle }: NewsDetailModalProps) {
  if (!item) return null;

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "government":
        return { label: "정부지원금", color: "bg-[#3580FF]/10 text-[#3580FF] border-[#3580FF]/20", icon: "🏛️" };
      case "promotion":
        return { label: "카드사 프로모션", color: "bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20", icon: "💳" };
      case "local":
        return { label: "지역 이벤트", color: "bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/20", icon: "🏪" };
      default:
        return { label: "기타", color: "bg-gray-100 text-gray-600 border-gray-200", icon: "📄" };
    }
  };

  const getDeadlineColor = (daysLeft?: number) => {
    if (!daysLeft) return "bg-gray-100 text-gray-600 border-gray-200";
    if (daysLeft <= 3) return "bg-red-50 text-red-600 border-red-200";
    if (daysLeft <= 7) return "bg-yellow-50 text-yellow-600 border-yellow-200";
    return "bg-blue-50 text-blue-600 border-blue-200";
  };

  const categoryInfo = getCategoryInfo(item.category);

  // Mock detailed content
  const getDetailedContent = (item: NewsItem) => {
    if (item.category === "government") {
      return {
        eligibility: ["소상공인 사업자등록증 보유자", "최근 3개월 매출 감소 확인서", "고용보험 가입 증명서"],
        supportAmount: "최대 300만원",
        applicationMethod: "온라인 신청 후 서류 제출",
        requiredDocs: ["사업자등록증", "매출 감소 증빙서류", "통장 사본"],
        contact: "1588-9988 (평일 09:00-18:00)"
      };
    } else if (item.category === "promotion") {
      return {
        eligibility: ["해당 카드 보유자", "온라인/오프라인 결제 시"],
        supportAmount: "최대 10% 캐시백 (월 5만원 한도)",
        applicationMethod: "카드 사용 시 자동 적용",
        requiredDocs: ["카드 신청 및 이용"],
        contact: "카드사 고객센터"
      };
    } else {
      return {
        eligibility: ["해당 지역 소상공인", "관련 업종 사업자"],
        supportAmount: "업체별 상이",
        applicationMethod: "지역 상공회의소 또는 온라인",
        requiredDocs: ["사업자등록증", "신분증"],
        contact: "지역 상공회의소"
      };
    }
  };

  const details = getDetailedContent(item);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-4">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={categoryInfo.color}>
                  {categoryInfo.icon} {categoryInfo.label}
                </Badge>
                {item.deadline && item.daysLeft !== undefined && (
                  <Badge className={getDeadlineColor(item.daysLeft)}>
                    {item.daysLeft === 0 ? "오늘 마감" : `D-${item.daysLeft}`}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl leading-tight pr-4">
                {item.title}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {item.summary}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onBookmarkToggle(item.id)}
              className={`flex-shrink-0 ${
                item.isBookmarked 
                  ? "text-[#FF7A00] hover:text-[#E86E00]" 
                  : "text-gray-400 hover:text-[#FF7A00]"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${item.isBookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#F7F8FA] rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Building className="w-4 h-4" />
              <span>{item.organization}</span>
            </div>
            {item.region && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{item.region}</span>
              </div>
            )}
            {item.deadline && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>마감: {item.deadline}</span>
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">개요</h3>
            <p className="text-gray-700 leading-relaxed">{item.summary}</p>
          </div>

          {/* Detailed Information */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">지원 대상</h3>
              <ul className="space-y-1">
                {details.eligibility.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                    <span className="text-[#FF7A00] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">지원 내용</h3>
              <p className="text-sm text-gray-700 font-medium text-[#FF7A00]">{details.supportAmount}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">신청 방법</h3>
              <p className="text-sm text-gray-700">{details.applicationMethod}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">필요 서류</h3>
              <ul className="space-y-1">
                {details.requiredDocs.map((doc, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                    <span className="text-[#FF7A00] mt-1">•</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">문의처</h3>
              <p className="text-sm text-gray-700">{details.contact}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4 border-t border-gray-200">
            <Button
              onClick={() => window.open(item.link, '_blank')}
              className="flex-1 bg-[#FF7A00] hover:bg-[#E86E00] text-white flex items-center justify-center space-x-2"
            >
              <span>공식 사이트에서 신청하기</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}