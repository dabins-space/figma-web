import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const todayTrendData = [
  { hour: "09", count: 2 },
  { hour: "10", count: 4 },
  { hour: "11", count: 6 },
  { hour: "12", count: 8 },
  { hour: "13", count: 5 },
  { hour: "14", count: 7 }
];

const weeklyTrendData = [
  { day: "월", count: 18 },
  { day: "화", count: 22 },
  { day: "수", count: 19 },
  { day: "목", count: 25 },
  { day: "금", count: 28 },
  { day: "토", count: 35 },
  { day: "일", count: 31 }
];

const noShowTrendData = [
  { week: "1주", rate: 8 },
  { week: "2주", rate: 6 },
  { week: "3주", rate: 9 },
  { week: "4주", rate: 7 }
];

export function ReservationSummaryCards() {
  const todayReservations = 24;
  const weeklyChange = 12;
  const noShowRate = 7;

  const getNoShowColor = (rate: number) => {
    if (rate < 5) return "text-[#00B894]";
    if (rate > 10) return "text-red-500";
    return "text-yellow-600";
  };

  const getNoShowBadgeColor = (rate: number) => {
    if (rate < 5) return "bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20";
    if (rate > 10) return "bg-red-50 text-red-600 border-red-200";
    return "bg-yellow-50 text-yellow-600 border-yellow-200";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Today's Reservations */}
      <Card className="p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#FF7A00]" />
            <span className="text-sm text-gray-600">오늘 예약건수</span>
          </div>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">{todayReservations}</span>
          <span className="text-sm text-gray-500 ml-1">건</span>
        </div>
        <div className="h-12 -mx-2 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={todayTrendData}>
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#FF7A00" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: "#FF7A00" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500">오늘 시간대별 추이</p>
      </Card>

      {/* Weekly Change */}
      <Card className="p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#00B894]" />
            <span className="text-sm text-gray-600">이번주 예약률 변화</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-3xl font-bold text-gray-900">+{weeklyChange}</span>
          <span className="text-sm text-gray-500">%</span>
          <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
            증가
          </Badge>
        </div>
        <div className="h-12 -mx-2 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrendData}>
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#00B894" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: "#00B894" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500">지난주 대비</p>
      </Card>

      {/* No-show Rate */}
      <Card className="p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">노쇼율</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <span className={`text-3xl font-bold ${getNoShowColor(noShowRate)}`}>
            {noShowRate}
          </span>
          <span className="text-sm text-gray-500">%</span>
          <Badge className={getNoShowBadgeColor(noShowRate)}>
            {noShowRate < 5 ? "양호" : noShowRate > 10 ? "주의" : "보통"}
          </Badge>
        </div>
        <div className="h-12 -mx-2 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={noShowTrendData}>
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke={noShowRate < 5 ? "#00B894" : noShowRate > 10 ? "#E74C3C" : "#F39C12"} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500">최근 4주 추이</p>
      </Card>
    </div>
  );
}