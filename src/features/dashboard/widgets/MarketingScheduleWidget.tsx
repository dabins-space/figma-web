import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, ExternalLink, RefreshCw } from "lucide-react";

interface MarketingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "event" | "campaign" | "sns" | "review";
  status: "upcoming" | "today" | "completed";
  color: string;
}

// Mock data - 실제로는 Google Calendar API에서 가져올 데이터
const mockEvents: MarketingEvent[] = [
  {
    id: "1",
    title: "주말 특가 이벤트 시작",
    date: "2025-01-15",
    time: "10:00",
    type: "event",
    status: "today",
    color: "#FF7A00"
  },
  {
    id: "2",
    title: "인스타그램 신메뉴 포스팅",
    date: "2025-01-16",
    time: "14:00",
    type: "sns",
    status: "upcoming",
    color: "#3580FF"
  },
  {
    id: "3",
    title: "리뷰 이벤트 마감",
    date: "2025-01-17",
    time: "23:59",
    type: "review",
    status: "upcoming",
    color: "#00B894"
  },
  {
    id: "4",
    title: "단골고객 감사 쿠폰 발송",
    date: "2025-01-18",
    time: "09:00",
    type: "campaign",
    status: "upcoming",
    color: "#9B59B6"
  },
  {
    id: "5",
    title: "블로그 콘텐츠 발행",
    date: "2025-01-20",
    time: "15:00",
    type: "sns",
    status: "upcoming",
    color: "#3580FF"
  }
];

export function MarketingScheduleWidget() {
  const [events, setEvents] = useState<MarketingEvent[]>(mockEvents);
  const [isConnected, setIsConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Google Calendar API 호출 시뮬레이션
    setTimeout(() => {
      setIsRefreshing(false);
      // 실제로는 API에서 최신 데이터를 가져옴
    }, 1000);
  };

  const handleConnectCalendar = () => {
    // Google Calendar OAuth 연동 시뮬레이션
    alert("Google Calendar 연동 준비 중입니다.\n\n실제 구현 시:\n1. Google OAuth 인증\n2. Calendar API 권한 요청\n3. 이벤트 동기화");
    setIsConnected(true);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "event": return "이벤트";
      case "campaign": return "캠페인";
      case "sns": return "SNS";
      case "review": return "리뷰";
      default: return "기타";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "today":
        return "bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/20";
      case "upcoming":
        return "bg-[#3580FF]/10 text-[#3580FF] border-[#3580FF]/20";
      case "completed":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // 오늘과 다가오는 이벤트 필터링
  const todayEvents = events.filter(e => e.status === "today");
  const upcomingEvents = events.filter(e => e.status === "upcoming").slice(0, 4);

  return (
    <Card className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#FF7A00]/10 rounded-xl">
            <Calendar className="w-5 h-5 text-[#FF7A00]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">마케팅 스케줄</h3>
            <p className="text-xs text-gray-500">Google Calendar 연동</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20 text-xs">
                연동됨
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                className="w-8 h-8"
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectCalendar}
              className="flex items-center space-x-2 text-xs border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
            >
              <ExternalLink className="w-3 h-3" />
              <span>연동하기</span>
            </Button>
          )}
        </div>
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-[#FF7A00]" />
            <h4 className="font-medium text-gray-900">오늘</h4>
          </div>
          <div className="space-y-2">
            {todayEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 bg-[#FF7A00]/5 rounded-lg border border-[#FF7A00]/20"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: event.color }}
                    ></div>
                    <span className="font-medium text-gray-900 text-sm">{event.title}</span>
                  </div>
                  <Badge className={getStatusBadge(event.status)}>
                    오늘
                  </Badge>
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-600 ml-4">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.time}</span>
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>{getTypeLabel(event.type)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">예정된 일정</h4>
        <div className="space-y-2">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 bg-[#F7F8FA] rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: event.color }}
                    ></div>
                    <span className="font-medium text-gray-900 text-sm">{event.title}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-600 ml-4">
                  <span>{new Date(event.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })}</span>
                  <span className="text-gray-400">•</span>
                  <span>{event.time}</span>
                  <span className="text-gray-400">•</span>
                  <span>{getTypeLabel(event.type)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">예정된 일정이 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Event Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center space-x-2 border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
        >
          <Plus className="w-4 h-4" />
          <span>일정 추가</span>
        </Button>
      </div>

      {/* API Info */}
      {!isConnected && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            📅 Google Calendar와 연동하면 자동으로 마케팅 일정이 동기화됩니다
          </p>
        </div>
      )}
    </Card>
  );
}