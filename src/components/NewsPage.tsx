import { useState, useMemo } from "react";
import { NewsHeader } from "./news/NewsHeader";
import { NewsTabMenu } from "./news/NewsTabMenu";
import { NewsCard } from "./news/NewsCard";
import type { NewsItem } from "./news/NewsCard";
import { BookmarkSection } from "./news/BookmarkSection";
import { NewsDetailModal } from "./news/NewsDetailModal";

// Sample data
const sampleNewsItems: NewsItem[] = [
  {
    id: "1",
    title: "소상공인 전기요금 지원사업 2024년 4분기 신청",
    summary: "전기요금 부담 경감을 위한 정부 지원사업입니다. 월 전기요금의 20%를 지원하며, 최대 월 30만원까지 지원받을 수 있습니다. 소상공인 및 자영업자 대상으로 진행됩니다.",
    category: "government",
    industry: "all",
    region: "전국",
    deadline: "2024년 12월 31일",
    daysLeft: 18,
    isBookmarked: false,
    link: "https://example.com/electric-support",
    organization: "중소벤처기업부",
    publishedAt: "2024-12-08"
  },
  {
    id: "2",
    title: "신한카드 소상공인 특별 캐시백 이벤트",
    summary: "음식점, 카페, 미용실 등에서 신한카드 결제 시 10% 캐시백을 제공합니다. 월 최대 5만원까지 적립 가능하며, 온라인/오프라인 모두 적용됩니다.",
    category: "promotion",
    industry: "restaurant",
    region: "전국",
    deadline: "2024년 12월 20일",
    daysLeft: 7,
    isBookmarked: true,
    link: "https://example.com/shinhan-cashback",
    organization: "신한카드",
    publishedAt: "2024-12-10"
  },
  {
    id: "3",
    title: "부산시 청년 창업 지원금 3차 모집",
    summary: "만 39세 이하 청년 창업자를 대상으로 최대 500만원의 창업 지원금을 제공합니다. 사업계획서 심사를 통해 선정되며, 추가로 멘토링과 사업공간도 지원됩니다.",
    category: "local",
    industry: "all",
    region: "부산",
    deadline: "2024년 12월 15일",
    daysLeft: 2,
    isBookmarked: true,
    link: "https://example.com/busan-startup",
    organization: "부산시청",
    publishedAt: "2024-12-05"
  },
  {
    id: "4",
    title: "KB국민카드 연말 특별 할인 프로모션",
    summary: "연말을 맞아 전 업종에서 KB국민카드 결제 시 5% 즉시할인을 제공합니다. 건당 최대 2만원까지 할인 가능하며, 일부 온라인쇼핑몰도 포함됩니다.",
    category: "promotion",
    industry: "retail",
    region: "전국",
    deadline: "2024년 12월 31일",
    daysLeft: 18,
    isBookmarked: false,
    link: "https://example.com/kb-discount",
    organization: "KB국민카드",
    publishedAt: "2024-12-07"
  },
  {
    id: "5",
    title: "서울시 소상공인 디지털 전환 지원사업",
    summary: "키오스크, POS 시스템, 배달앱 연동 등 디지털 전환을 위한 비용을 80% 지원합니다. 최대 200만원까지 지원받을 수 있으며, 전문 컨설팅도 함께 제공됩니다.",
    category: "government",
    industry: "all",
    region: "서울",
    deadline: "2024년 12월 25일",
    daysLeft: 12,
    isBookmarked: false,
    link: "https://example.com/seoul-digital",
    organization: "서울시청",
    publishedAt: "2024-12-09"
  },
  {
    id: "6",
    title: "대구 동성로 상권 활성화 이벤트",
    summary: "동성로 일대 매장에서 구매 시 추가 적립금을 제공하는 이벤트입니다. 지역화폐 결제 시 10% 추가 적립되며, 주말에는 15%까지 적립 가능합니다.",
    category: "local",
    industry: "retail",
    region: "대구",
    deadline: "2024년 12월 22일",
    daysLeft: 9,
    isBookmarked: false,
    link: "https://example.com/daegu-dongseong",
    organization: "대구시 중구청",
    publishedAt: "2024-12-11"
  },
  {
    id: "7",
    title: "소상공인 배달 수수료 지원사업 연장",
    summary: "배달앱 이용 시 발생하는 중개수수료의 50%를 정부에서 지원합니다. 월 최대 10만원까지 지원받을 수 있으며, 기존 사업이 3개월 연장되었습니다.",
    category: "government",
    industry: "restaurant",
    region: "전국",
    deadline: "2024년 12월 28일",
    daysLeft: 15,
    isBookmarked: true,
    link: "https://example.com/delivery-fee-support",
    organization: "중소벤처기업부",
    publishedAt: "2024-12-06"
  },
  {
    id: "8",
    title: "현대카드 미용업종 특별 혜택",
    summary: "미용실, 네일샵, 피부관리실에서 현대카드 결제 시 15% 할인을 제공합니다. 월 3회까지 이용 가능하며, 건당 최대 3만원까지 할인됩니다.",
    category: "promotion",
    industry: "beauty",
    region: "전국",
    deadline: "2025년 1월 15일",
    daysLeft: 33,
    isBookmarked: false,
    link: "https://example.com/hyundai-beauty",
    organization: "현대카드",
    publishedAt: "2024-12-12"
  }
];

export function NewsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    industry: "all",
    region: "all",
    period: "all"
  });
  const [newsItems, setNewsItems] = useState<NewsItem[]>(sampleNewsItems);
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleBookmarkToggle = (id: string) => {
    setNewsItems(prev => prev.map(item => 
      item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
    ));
  };

  const handleViewDetails = (item: NewsItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleRemoveBookmark = (id: string) => {
    setNewsItems(prev => prev.map(item => 
      item.id === id ? { ...item, isBookmarked: false } : item
    ));
  };

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = newsItems;

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(item => item.category === activeTab);
    }

    // Filter by industry
    if (filters.industry !== "all") {
      filtered = filtered.filter(item => 
        item.industry === filters.industry || item.industry === "all"
      );
    }

    // Filter by region
    if (filters.region !== "all") {
      filtered = filtered.filter(item => 
        item.region === filters.region || item.region === "전국"
      );
    }

    // Filter by period
    if (filters.period !== "all") {
      const now = new Date();
      filtered = filtered.filter(item => {
        if (!item.daysLeft) return true;
        
        switch (filters.period) {
          case "this_week":
            return item.daysLeft <= 7;
          case "this_month":
            return item.daysLeft <= 30;
          case "next_month":
            return item.daysLeft > 30;
          default:
            return true;
        }
      });
    }

    // Sort by urgency (deadline first)
    return filtered.sort((a, b) => {
      if (!a.daysLeft && !b.daysLeft) return 0;
      if (!a.daysLeft) return 1;
      if (!b.daysLeft) return -1;
      return a.daysLeft - b.daysLeft;
    });
  }, [newsItems, activeTab, filters]);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    const counts = {
      all: newsItems.length,
      government: newsItems.filter(item => item.category === "government").length,
      promotion: newsItems.filter(item => item.category === "promotion").length,
      local: newsItems.filter(item => item.category === "local").length
    };
    return counts;
  }, [newsItems]);

  const bookmarkedItems = newsItems.filter(item => item.isBookmarked);

  return (
    <main className="p-6 bg-white min-h-screen">
      <NewsHeader filters={filters} onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-3">
          <NewsTabMenu 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            tabCounts={tabCounts}
          />
          
          {/* News List */}
          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <NewsCard
                  key={item.id}
                  item={item}
                  onBookmarkToggle={handleBookmarkToggle}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-sm text-gray-600">다른 필터 조건을 선택해보세요</p>
              </div>
            )}
          </div>
        </div>

        {/* Bookmark Section */}
        <div className="xl:col-span-1">
          <BookmarkSection
            bookmarkedItems={bookmarkedItems}
            onViewDetails={handleViewDetails}
            onRemoveBookmark={handleRemoveBookmark}
          />
        </div>
      </div>

      {/* Detail Modal */}
      <NewsDetailModal
        item={selectedItem}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        onBookmarkToggle={handleBookmarkToggle}
      />
    </main>
  );
}