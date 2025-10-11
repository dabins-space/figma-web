import { useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Bookmark, ExternalLink, Calendar, MapPin, Building } from "lucide-react";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: "government" | "promotion" | "local";
  industry?: string;
  region?: string;
  deadline?: string;
  daysLeft?: number;
  thumbnail?: string;
  isBookmarked: boolean;
  link: string;
  organization: string;
  publishedAt: string;
}

interface NewsCardProps {
  item: NewsItem;
  onBookmarkToggle: (id: string) => void;
  onViewDetails: (item: NewsItem) => void;
}

export function NewsCard({ item, onBookmarkToggle, onViewDetails }: NewsCardProps) {
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

  return (
    <Card className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start space-x-4">
        {/* Thumbnail/Icon */}
        <div className="flex-shrink-0">
          {item.thumbnail ? (
            <img 
              src={item.thumbnail} 
              alt={item.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-[#F7F8FA] rounded-lg flex items-center justify-center text-2xl">
              {categoryInfo.icon}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2 flex-wrap">
              <Badge className={categoryInfo.color}>
                {categoryInfo.label}
              </Badge>
              {item.deadline && item.daysLeft !== undefined && (
                <Badge className={getDeadlineColor(item.daysLeft)}>
                  {item.daysLeft === 0 ? "오늘 마감" : `D-${item.daysLeft}`}
                </Badge>
              )}
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
              <Bookmark className={`w-4 h-4 ${item.isBookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FF7A00] transition-colors">
            {item.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-3 leading-relaxed">
            {item.summary}
          </p>

          {/* Meta Information */}
          <div className="flex items-center space-x-4 mb-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Building className="w-3 h-3" />
              <span>{item.organization}</span>
            </div>
            {item.region && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{item.region}</span>
              </div>
            )}
            {item.deadline && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>마감: {item.deadline}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={() => onViewDetails(item)}
            className="bg-[#FF7A00] hover:bg-[#E86E00] text-white flex items-center space-x-2"
            size="sm"
          >
            <span>자세히 보기</span>
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}