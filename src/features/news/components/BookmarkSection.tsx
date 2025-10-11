import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bookmark, MessageCircle, Bell, BellOff, Calendar, ExternalLink } from "lucide-react";
import type { NewsItem } from "./NewsCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface BookmarkSectionProps {
  bookmarkedItems: NewsItem[];
  onViewDetails: (item: NewsItem) => void;
  onRemoveBookmark: (id: string) => void;
}

export function BookmarkSection({ bookmarkedItems, onViewDetails, onRemoveBookmark }: BookmarkSectionProps) {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    kakaoTalk: true,
    email: false,
    push: true,
    reminderDays: 3
  });

  // Sort by deadline (urgent first)
  const sortedItems = [...bookmarkedItems].sort((a, b) => {
    if (!a.daysLeft && !b.daysLeft) return 0;
    if (!a.daysLeft) return 1;
    if (!b.daysLeft) return -1;
    return a.daysLeft - b.daysLeft;
  });

  const getDeadlineColor = (daysLeft?: number) => {
    if (!daysLeft) return "bg-gray-100 text-gray-600 border-gray-200";
    if (daysLeft <= 3) return "bg-red-50 text-red-600 border-red-200";
    if (daysLeft <= 7) return "bg-yellow-50 text-yellow-600 border-yellow-200";
    return "bg-blue-50 text-blue-600 border-blue-200";
  };

  const urgentItems = sortedItems.filter(item => item.daysLeft && item.daysLeft <= 3);

  return (
    <Card className="p-6 bg-white rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bookmark className="w-5 h-5 text-[#FF7A00]" />
          <h3 className="font-semibold text-gray-900">저장한 소식</h3>
          <Badge className="bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/20">
            {bookmarkedItems.length}개
          </Badge>
        </div>
        
        <Button
          onClick={() => setShowNotificationModal(true)}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
        >
          <MessageCircle className="w-4 h-4" />
          <span>카카오톡 알림 설정</span>
        </Button>
      </div>

      {/* Urgent Items Alert */}
      {urgentItems.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 mb-1">
            <Bell className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">
              긴급! 마감 임박 ({urgentItems.length}개)
            </span>
          </div>
          <p className="text-xs text-red-700">
            3일 이내 마감되는 지원금이 있습니다. 지금 바로 확인하세요!
          </p>
        </div>
      )}

      {/* Bookmarked Items List */}
      <ScrollArea className="h-80">
        {sortedItems.length > 0 ? (
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-[#F7F8FA] rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-wrap">
                    {item.daysLeft !== undefined && (
                      <Badge className={getDeadlineColor(item.daysLeft)}>
                        {item.daysLeft === 0 ? "오늘 마감" : `D-${item.daysLeft}`}
                      </Badge>
                    )}
                    <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                      {item.category === "government" ? "정부지원금" : 
                       item.category === "promotion" ? "카드사 프로모션" : "지역 이벤트"}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveBookmark(item.id)}
                    className="w-6 h-6 text-gray-400 hover:text-red-500"
                  >
                    <Bookmark className="w-3 h-3 fill-current" />
                  </Button>
                </div>

                <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                  {item.title}
                </h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>마감: {item.deadline || "상시"}</span>
                  </div>
                  
                  <Button
                    onClick={() => onViewDetails(item)}
                    size="sm"
                    className="bg-[#FF7A00] hover:bg-[#E86E00] text-white h-6 px-2 text-xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bookmark className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">저장한 소식이 없습니다</p>
            <p className="text-xs text-gray-400 mt-1">관심있는 소식을 북마크해보세요</p>
          </div>
        )}
      </ScrollArea>

      {/* Notification Status */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            {notificationSettings.kakaoTalk ? (
              <Bell className="w-4 h-4 text-[#00B894]" />
            ) : (
              <BellOff className="w-4 h-4 text-gray-400" />
            )}
            <span>
              알림: {notificationSettings.kakaoTalk ? "ON" : "OFF"}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            마감 {notificationSettings.reminderDays}일 전 알림
          </span>
        </div>
      </div>

      {/* Notification Settings Modal */}
      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-[#FF7A00]" />
              <span>알림 설정</span>
            </DialogTitle>
            <DialogDescription>
              북마크한 소식의 마감일에 따라 알림을 받을 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="bg-[#F7F8FA] p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">알림 예시</h4>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800 leading-relaxed">
                  📅 [밀양시 소상공인 전기요금 지원] 마감이 3일 남았어요! 지금 바로 신청해보세요 👇
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#F7F8FA] rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">카카오톡 알림</h4>
                  <p className="text-xs text-gray-600">마감일 기준 알림 발송</p>
                </div>
                <Switch
                  checked={notificationSettings.kakaoTalk}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, kakaoTalk: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F7F8FA] rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">이메일 알림</h4>
                  <p className="text-xs text-gray-600">주간 요약 발송</p>
                </div>
                <Switch
                  checked={notificationSettings.email}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F7F8FA] rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">푸시 알림</h4>
                  <p className="text-xs text-gray-600">앱 내 실시간 알림</p>
                </div>
                <Switch
                  checked={notificationSettings.push}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-2">📱 카카오톡 API 연동</p>
              <p className="text-xs text-blue-700">
                카카오톡으로 알림을 받으려면 계정 연동이 필요합니다.
              </p>
            </div>

            <Button
              onClick={() => setShowNotificationModal(false)}
              className="w-full bg-[#FF7A00] hover:bg-[#E86E00] text-white"
            >
              설정 저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}