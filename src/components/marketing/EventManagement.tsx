import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, Clock, Lightbulb, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const upcomingEvents = [
  {
    title: "주말 특가 이벤트",
    date: "12월 14일",
    status: "진행중",
    type: "할인"
  },
  {
    title: "신메뉴 출시 기념",
    date: "12월 20일",
    status: "예정",
    type: "프로모션"
  }
];

const pastEvents = [
  {
    title: "단골 감사 이벤트",
    date: "11월 28일",
    status: "완료",
    performance: "매출 +23%"
  }
];

export function EventManagement() {
  return (
    <Card className="p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">이벤트관리</h3>
            <p className="text-sm text-gray-600">AI 일정 연동</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Lightbulb className="w-4 h-4 text-[#FF7A00]" />
              </TooltipTrigger>
              <TooltipContent>
                <p>AI가 자동 일정 제안합니다</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button className="bg-[#FF7A00] hover:bg-[#E86E00] text-white flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>AI로 이벤트 생성하기</span>
        </Button>
      </div>

      {/* Timeline View */}
      <div className="space-y-6">
        {/* Upcoming Events */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="w-4 h-4 text-[#3580FF]" />
            <h4 className="font-medium text-gray-900">진행중/예정 이벤트</h4>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-[#FF7A00] rounded-full"></div>
                    <div>
                      <h5 className="font-medium text-gray-900">{event.title}</h5>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{event.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-[#FFD8B0]/20 text-[#FF7A00] border-[#FF7A00]/20">
                      {event.type}
                    </Badge>
                    <Badge 
                      className={event.status === "진행중" 
                        ? "bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20"
                        : "bg-[#3580FF]/10 text-[#3580FF] border-[#3580FF]/20"
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <h4 className="font-medium text-gray-900">지난 이벤트</h4>
          </div>
          <div className="space-y-3">
            {pastEvents.map((event, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <h5 className="font-medium text-gray-900">{event.title}</h5>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{event.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
                      {event.performance}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                      {event.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Integration Note */}
      <div className="mt-6 p-3 bg-[#3580FF]/5 rounded-lg border border-[#3580FF]/20">
        <p className="text-sm text-[#3580FF]">
          📅 Google 캘린더 및 네이버 캘린더와 연동되어 있습니다
        </p>
      </div>
    </Card>
  );
}