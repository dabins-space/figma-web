import { Card } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Lightbulb } from "lucide-react";

const eventData = [
  {
    event: "가을 할인",
    before: 68,
    after: 85,
    increase: 17
  },
  {
    event: "단골 쿠폰데이",
    before: 72,
    after: 89,
    increase: 17
  },
  {
    event: "신메뉴 런칭",
    before: 65,
    after: 78,
    increase: 13
  },
  {
    event: "주말 특가",
    before: 58,
    after: 71,
    increase: 13
  }
];

export function EventEffectAnalysis() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <p className="text-gray-600">
            이벤트 전: <span className="font-semibold">{data.before}%</span>
          </p>
          <p className="text-[#FF7A00]">
            이벤트 후: <span className="font-semibold">{data.after}%</span>
          </p>
          <p className="text-[#00B894] mt-1">
            증가율: <span className="font-semibold">+{data.increase}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-white rounded-2xl border border-gray-100 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">이벤트별 예약률 변화 분석</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eventData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="event" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#666" }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#666" }}
                  label={{ value: '예약률 (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="before" 
                  fill="#E5E7EB" 
                  name="이벤트 전"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="after" 
                  fill="#FF7A00" 
                  name="이벤트 후"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#FF7A00]/5 to-[#FFE0C2]/10 p-4 rounded-xl border border-[#FF7A00]/20">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-[#FF7A00]/10 rounded-lg">
                <Lightbulb className="w-4 h-4 text-[#FF7A00]" />
              </div>
              <span className="text-sm font-medium text-gray-900">AI 인사이트</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              지난 2주간 이벤트 진행 후 신규 예약 비율이 18% 증가했습니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              평일 오후 2시~5시대 예약이 가장 많았습니다.
            </p>
          </div>

          {/* Event Performance Summary */}
          <div className="bg-[#F7F8FA] p-4 rounded-xl border border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-3">성과 요약</h4>
            <div className="space-y-3">
              {eventData.map((event, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{event.event}</span>
                  <span className="text-sm font-medium text-[#00B894]">+{event.increase}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best Performing Event */}
          <div className="bg-[#00B894]/5 p-4 rounded-xl border border-[#00B894]/20">
            <h4 className="text-sm font-medium text-[#00B894] mb-2">최고 성과 이벤트</h4>
            <p className="text-sm text-gray-700">
              <span className="font-medium">가을 할인 이벤트</span>가 +17% 증가로 
              가장 높은 예약률 향상을 보였습니다.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}