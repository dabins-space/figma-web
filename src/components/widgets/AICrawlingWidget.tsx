import { useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Bot, TrendingUp, ExternalLink, RefreshCw, Sparkles } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface CrawledItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: "trend" | "news" | "policy" | "competitor";
  timestamp: string;
  url: string;
  relevance: number;
}

// Mock data - 실제로는 크롤링 API에서 가져올 데이터
const mockCrawledData: CrawledItem[] = [
  {
    id: "1",
    title: "2025년 소상공인 디지털 전환 지원금 확대",
    summary: "정부가 소상공인 디지털 전환을 위해 최대 500만원까지 지원금을 확대한다고 발표했습니다. 키오스크, POS 시스템 등이 대상입니다.",
    source: "중소벤처기업부",
    category: "policy",
    timestamp: "10분 전",
    url: "https://example.com",
    relevance: 95
  },
  {
    id: "2",
    title: "카페 업계 신메뉴 트렌드: 제로슈거 음료 급부상",
    summary: "최근 건강을 중시하는 소비자가 늘면서 제로슈거 음료 판매가 전년 대비 180% 증가했습니다. MZ세대의 선호도가 특히 높습니다.",
    source: "한국외식산업연구소",
    category: "trend",
    timestamp: "1시간 전",
    url: "https://example.com",
    relevance: 88
  },
  {
    id: "3",
    title: "인근 경쟁 매장 '맛있는집' 할인 이벤트 진행 중",
    summary: "500m 거리의 경쟁 매장에서 20% 할인 이벤트를 진행하고 있습니다. SNS 홍보로 고객 유입이 증가하는 추세입니다.",
    source: "AI 분석",
    category: "competitor",
    timestamp: "2시간 전",
    url: "https://example.com",
    relevance: 82
  },
  {
    id: "4",
    title: "배달앱 수수료 인하 정책 논의 중",
    summary: "공정거래위원회가 배달앱 수수료 인하를 위한 가이드라인 마련을 검토하고 있습니다. 소상공인 부담 경감이 목표입니다.",
    source: "공정거래위원회",
    category: "policy",
    timestamp: "3시간 전",
    url: "https://example.com",
    relevance: 90
  },
  {
    id: "5",
    title: "주말 날씨 영향: 외식 업계 매출 15% 증가 예상",
    summary: "이번 주말 맑은 날씨가 예상되어 외식 업계 매출이 평균 15% 증가할 것으로 전망됩니다. 특히 야외 테라스가 있는 매장의 예약이 급증하고 있습니다.",
    source: "기상청 & AI 분석",
    category: "trend",
    timestamp: "4시간 전",
    url: "https://example.com",
    relevance: 85
  }
];

export function AICrawlingWidget() {
  const [items, setItems] = useState<CrawledItem[]>(mockCrawledData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleRefresh = () => {
    setIsRefreshing(true);
    // 크롤링 API 호출 시뮬레이션
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "trend":
        return { label: "트렌드", color: "bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/20" };
      case "news":
        return { label: "뉴스", color: "bg-[#3580FF]/10 text-[#3580FF] border-[#3580FF]/20" };
      case "policy":
        return { label: "정책", color: "bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20" };
      case "competitor":
        return { label: "경쟁사", color: "bg-purple-100 text-purple-600 border-purple-200" };
      default:
        return { label: "기타", color: "bg-gray-100 text-gray-600 border-gray-200" };
    }
  };

  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const categories = [
    { value: "all", label: "전체" },
    { value: "trend", label: "트렌드" },
    { value: "policy", label: "정책" },
    { value: "competitor", label: "경쟁사" }
  ];

  return (
    <Card className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-[#FF7A00]/20 to-[#FFB566]/20 rounded-xl">
            <Bot className="w-5 h-5 text-[#FF7A00]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">AI 잘코치 크롤링</h3>
              <Sparkles className="w-4 h-4 text-[#FF7A00]" />
            </div>
            <p className="text-xs text-gray-500">실시간 업계 동향 분석</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20 text-xs">
            {filteredItems.length}개 발견
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-8 h-8"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
            className={`text-xs whitespace-nowrap ${
              selectedCategory === cat.value
                ? "bg-[#FF7A00] hover:bg-[#E86E00] text-white"
                : "hover:border-[#FF7A00] hover:text-[#FF7A00]"
            }`}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Crawled Items List */}
      <ScrollArea className="h-96">
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const categoryInfo = getCategoryInfo(item.category);
            return (
              <div
                key={item.id}
                className="p-4 bg-[#F7F8FA] rounded-lg border border-gray-100 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <Badge className={categoryInfo.color}>
                      {categoryInfo.label}
                    </Badge>
                    <span className="text-xs text-gray-500">{item.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-[#00B894]" />
                      <span className="text-xs text-[#00B894] font-medium">
                        {item.relevance}%
                      </span>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1 group-hover:text-[#FF7A00] transition-colors">
                  {item.title}
                </h4>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-3">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">출처: {item.source}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-[#FF7A00] hover:text-[#E86E00] hover:bg-[#FF7A00]/5"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    <span>자세히</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Bot className="w-3 h-3" />
            <span>AI가 100+ 웹사이트를 실시간 모니터링 중</span>
          </div>
          <span>마지막 업데이트: 방금 전</span>
        </div>
      </div>
    </Card>
  );
}