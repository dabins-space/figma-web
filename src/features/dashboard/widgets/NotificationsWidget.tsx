import { Card } from "@/components/ui/card";
import { Bell, Calendar, Gift, Info, ChevronRight } from "lucide-react";

export function NotificationsWidget() {
  const notifications = [
    {
      icon: Gift,
      title: "소상공인 지원금 신청",
      description: "디지털 전환 지원사업 마감 D-5",
      time: "오늘",
      type: "정부지원",
      color: "text-[#00B894] bg-[#00B894]/10"
    },
    {
      icon: Calendar,
      title: "세무 신고 알림",
      description: "부가세 신고 기한이 다가와요",
      time: "3일 후",
      type: "세무",
      color: "text-[#FF7A00] bg-[#FF7A00]/10"
    },
    {
      icon: Info,
      title: "새로운 기능 업데이트",
      description: "AI 분석 기능이 개선되었습니다",
      time: "1주일 전",
      type: "업데이트",
      color: "text-[#3580FF] bg-[#3580FF]/10"
    }
  ];

  return (
    <Card className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">알뜰소식</h3>
        <div className="p-2 bg-[#FF7A00]/10 rounded-lg">
          <Bell className="w-5 h-5 text-[#FF7A00]" />
        </div>
      </div>
      
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div 
            key={index}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#F5F6F8] transition-colors group cursor-pointer"
          >
            <div className={`p-2 rounded-lg ${notification.color} flex-shrink-0`}>
              <notification.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <p className="text-xs text-gray-600 mb-1">{notification.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{notification.time}</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {notification.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <button className="w-full text-sm text-[#FF7A00] hover:text-[#FF7A00]/80 transition-colors">
          모든 알림 보기
        </button>
      </div>
    </Card>
  );
}