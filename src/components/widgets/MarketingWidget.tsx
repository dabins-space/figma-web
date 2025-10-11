import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar, Clock, Gift, Megaphone, Star, TrendingUp, PlayCircle, ArrowRight, Share2, Users } from "lucide-react";

interface MarketingActivity {
  id: string;
  title: string;
  type: "event" | "campaign" | "review" | "sns";
  status: "today" | "upcoming" | "running";
  date: string;
  timeRemaining?: string;
  description: string;
  icon: any;
  color: string;
}

const upcomingActivities: MarketingActivity[] = [
  {
    id: "1",
    title: "주말 특가 이벤트",
    type: "event",
    status: "today",
    date: "오늘",
    timeRemaining: "2시간 후 시작",
    description: "30% 할인 + 무료배송",
    icon: Gift,
    color: "text-[#FF7A00]"
  },
  {
    id: "2", 
    title: "리뷰 쓰고 쿠폰받기",
    type: "review",
    status: "running",
    date: "진행중",
    description: "리뷰 작성 시 5,000원 쿠폰",
    icon: Star,
    color: "text-[#00B894]"
  },
  {
    id: "3",
    title: "인스타 신메뉴 포스팅",
    type: "sns",
    status: "upcoming",
    date: "내일",
    timeRemaining: "1일 후",
    description: "겨울 시즌 한정 메뉴 홍보",
    icon: Megaphone,
    color: "text-[#3580FF]"
  }
];

export function MarketingWidget() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "today":
        return "bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/20";
      case "running":
        return "bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20";
      case "upcoming":
        return "bg-[#3580FF]/10 text-[#3580FF] border-[#3580FF]/20";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "today":
        return "오늘";
      case "running":
        return "진행중";
      case "upcoming":
        return "예정";
      default:
        return "대기";
    }
  };

  const todayActivities = upcomingActivities.filter(activity => activity.status === "today" || activity.status === "running");
  const upcomingInWeek = upcomingActivities.filter(activity => activity.status === "upcoming");

  return (
    <Card className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">마케팅 관리</h3>
        <div className="p-2 bg-[#00B894]/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-[#00B894]" />
        </div>
      </div>
      
      <div className="space-y-5">
        {/* Marketing Performance Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">마케팅 성과</h4>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">4.8</div>
              <div className="text-xs text-gray-600 flex items-center justify-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>평점</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">127</div>
              <div className="text-xs text-gray-600">리뷰</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Megaphone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">광고 노출</span>
              </div>
              <span className="font-medium text-[#3580FF]">2,340회</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">SNS 참여</span>
              </div>
              <span className="font-medium text-[#00B894]">89회</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">신규 팔로워</span>
              </div>
              <span className="font-medium">+24명</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200"></div>

        {/* Upcoming Activities Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">예정된 활동</h4>
            <Badge className="bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/20 text-xs">
              {upcomingActivities.length}개
            </Badge>
          </div>

          {/* Today & Running Activities */}
          {todayActivities.length > 0 && (
            <div className="space-y-2 mb-3">
              {todayActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="p-2 bg-[#F7F8FA] rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-white rounded">
                          <IconComponent className={`w-3 h-3 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1 mb-0.5">
                            <h5 className="font-medium text-gray-900 text-xs truncate">
                              {activity.title}
                            </h5>
                            <Badge className={`${getStatusBadge(activity.status)} text-xs px-1 py-0`}>
                              {getStatusText(activity.status)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{activity.description}</p>
                          {activity.timeRemaining && (
                            <p className="text-xs text-[#FF7A00]">{activity.timeRemaining}</p>
                          )}
                        </div>
                      </div>
                      {activity.status === "today" && (
                        <Button size="sm" className="bg-[#FF7A00] hover:bg-[#E86E00] text-white h-6 px-2 text-xs">
                          <PlayCircle className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Upcoming in 7 days */}
          {upcomingInWeek.length > 0 && (
            <div className="space-y-2">
              {upcomingInWeek.slice(0, 1).map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="p-2 bg-[#F7F8FA] rounded-lg border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-white rounded">
                        <IconComponent className={`w-3 h-3 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 mb-0.5">
                          <h5 className="font-medium text-gray-900 text-xs truncate">
                            {activity.title}
                          </h5>
                          <Badge className={`${getStatusBadge(activity.status)} text-xs px-1 py-0`}>
                            {activity.date}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{activity.description}</p>
                        {activity.timeRemaining && (
                          <p className="text-xs text-gray-500">{activity.timeRemaining}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Success Message */}
        <div className="p-3 bg-[#00B894]/5 rounded-lg border border-[#00B894]/20">
          <p className="text-sm text-[#00B894]">이번 주 마케팅 효과가 좋아요! 🎉</p>
        </div>

        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white flex items-center justify-center space-x-2"
        >
          <span>전체 마케팅 관리</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}