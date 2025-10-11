import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from "recharts";
import { Bot, Cloud, Users, Clock, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

const seasonalData = [
  { period: "1월", reservations: 45, trend: 52 },
  { period: "2월", reservations: 38, trend: 45 },
  { period: "3월", reservations: 52, trend: 58 },
  { period: "4월", reservations: 48, trend: 55 },
  { period: "5월", reservations: 62, trend: 68 },
  { period: "6월", reservations: 58, trend: 65 }
];

const weeklyTrendData = [
  { day: "월", morning: 12, afternoon: 18, evening: 15 },
  { day: "화", morning: 10, afternoon: 22, evening: 18 },
  { day: "수", morning: 14, afternoon: 20, evening: 16 },
  { day: "목", morning: 16, afternoon: 25, evening: 20 },
  { day: "금", morning: 18, afternoon: 28, evening: 24 },
  { day: "토", morning: 25, afternoon: 35, evening: 30 },
  { day: "일", morning: 22, afternoon: 32, evening: 28 }
];

const aiReminders = [
  {
    icon: Cloud,
    type: "날씨 알림",
    message: "비 오는 날 예약률이 낮아요. 날씨 맞춤 쿠폰 발송 어때요?",
    priority: "medium",
    action: "쿠폰 이벤트 만들기"
  },
  {
    icon: Users,
    type: "노쇼 경고",
    message: "이번 주 노쇼율이 높습니다. 사전 알림 문자를 설정하세요.",
    priority: "high",
    action: "알림 설정하기"
  },
  {
    icon: Clock,
    type: "재예약 패턴",
    message: "단골 고객의 재예약 주기가 평균 10일이에요.",
    priority: "low",
    action: "리마케팅 설정"
  }
];

export function TrendAnalysisSection() {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [viewType, setViewType] = useState<"seasonal" | "weekly">("seasonal");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 text-red-600 border-red-200";
      case "medium": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "low": return "bg-blue-50 text-blue-600 border-blue-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return "🔴";
      case "medium": return "🟡";
      case "low": return "🔵";
      default: return "⚪";
    }
  };

  return (
    <Card className="p-6 bg-white rounded-2xl border border-gray-100 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">예약 트렌드 & 리마인드</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Charts */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Button
              variant={viewType === "seasonal" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("seasonal")}
              className={viewType === "seasonal" 
                ? "bg-[#FF7A00] hover:bg-[#E86E00] text-white" 
                : "hover:border-[#FF7A00] hover:text-[#FF7A00]"
              }
            >
              월별 트렌드
            </Button>
            <Button
              variant={viewType === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("weekly")}
              className={viewType === "weekly" 
                ? "bg-[#FF7A00] hover:bg-[#E86E00] text-white" 
                : "hover:border-[#FF7A00] hover:text-[#FF7A00]"
              }
            >
              요일별 시간대
            </Button>
          </div>

          <div className="h-64">
            {viewType === "seasonal" ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={seasonalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="period" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="reservations" 
                    fill="#FFE0C2" 
                    name="실제 예약"
                    radius={[2, 2, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="trend" 
                    stroke="#FF7A00" 
                    strokeWidth={2}
                    name="트렌드"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                  />
                  <Tooltip />
                  <Bar dataKey="morning" fill="#E5E7EB" name="오전" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="afternoon" fill="#FF7A00" name="오후" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="evening" fill="#FFE0C2" name="저녁" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* AI Reminders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-[#FF7A00]" />
              <h4 className="font-medium text-gray-900">AI 리마인드</h4>
            </div>
            <Button
              onClick={() => setShowReminderModal(true)}
              className="bg-[#FF7A00] hover:bg-[#E86E00] text-white text-sm"
            >
              리마인드 자동설정
            </Button>
          </div>

          <div className="space-y-3">
            {aiReminders.map((reminder, index) => (
              <div key={index} className="bg-[#F7F8FA] p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-lg">
                    <reminder.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">{reminder.type}</span>
                      <Badge className={getPriorityColor(reminder.priority)}>
                        {getPriorityIcon(reminder.priority)} {reminder.priority === "high" ? "긴급" : reminder.priority === "medium" ? "보통" : "정보"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{reminder.message}</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white text-xs"
                    >
                      {reminder.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auto Reminder Modal */}
      <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="p-2 bg-[#FF7A00]/10 rounded-lg">
                <Bell className="w-5 h-5 text-[#FF7A00]" />
              </div>
              <span>AI 리마인드 자동설정</span>
            </DialogTitle>
            <DialogDescription>
              AI가 예약 패턴을 분석하여 자동으로 리마인드를 설정합니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-[#F7F8FA] p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">설정 완료!</p>
              <p className="text-xs text-gray-500">
                AI가 예약 패턴을 분석하여 자동으로 리마인드 메시지를 설정합니다.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm">노쇼 방지 알림</span>
                <Badge className="bg-[#00B894]/10 text-[#00B894]">활성화</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm">날씨 기반 알림</span>
                <Badge className="bg-[#00B894]/10 text-[#00B894]">활성화</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm">재예약 추천</span>
                <Badge className="bg-[#00B894]/10 text-[#00B894]">활성화</Badge>
              </div>
            </div>
            
            <Button
              onClick={() => setShowReminderModal(false)}
              className="w-full bg-[#FF7A00] hover:bg-[#E86E00] text-white"
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}