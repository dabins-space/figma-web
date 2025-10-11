import { Card } from "../ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const visitData = [
  { day: "월", visits: 45 },
  { day: "화", visits: 52 },
  { day: "수", visits: 48 },
  { day: "목", visits: 61 },
  { day: "금", visits: 55 },
  { day: "토", visits: 67 },
  { day: "일", visits: 58 }
];

export function CustomerVisitsCard() {
  return (
    <Card className="p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div>
        <h3 className="text-sm text-gray-600 mb-3">고객 방문 추이</h3>
        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-900">156</span>
          <span className="text-sm text-gray-500 ml-1">명/일</span>
        </div>
        <div className="h-16 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visitData}>
              <Line 
                type="monotone" 
                dataKey="visits" 
                stroke="#3580FF" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: "#3580FF" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2">최근 7일 평균</p>
      </div>
    </Card>
  );
}