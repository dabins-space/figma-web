import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const generateReservationData = (days: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseReservations = isWeekend ? 35 : 25;
    const variance = Math.random() * 10 - 5;
    const reservations = Math.max(0, Math.round(baseReservations + variance));
    const noShows = Math.round(reservations * (0.05 + Math.random() * 0.1));
    
    data.push({
      date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      reservations,
      noShows,
      isWeekend
    });
  }
  
  return data;
};

type FilterType = "1주" | "1개월" | "3개월";

export function ReservationTrendChart() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("1개월");
  
  const getDataForFilter = (filter: FilterType) => {
    switch (filter) {
      case "1주":
        return generateReservationData(7);
      case "1개월":
        return generateReservationData(30);
      case "3개월":
        return generateReservationData(90);
      default:
        return generateReservationData(30);
    }
  };

  const data = getDataForFilter(selectedFilter);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-[#FF7A00]">
            예약건수: <span className="font-semibold">{data.reservations}건</span>
          </p>
          <p className="text-red-500">
            노쇼건수: <span className="font-semibold">{data.noShows}건</span>
          </p>
          {data.isWeekend && (
            <p className="text-xs text-gray-500 mt-1">주말</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-white rounded-2xl border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">날짜별 예약 추이</h3>
        <div className="flex items-center space-x-2">
          {(["1주", "1개월", "3개월"] as FilterType[]).map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className={selectedFilter === filter 
                ? "bg-[#FF7A00] hover:bg-[#E86E00] text-white" 
                : "hover:border-[#FF7A00] hover:text-[#FF7A00]"
              }
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Weekend highlighting */}
            {data.map((item, index) => 
              item.isWeekend ? (
                <ReferenceLine 
                  key={index} 
                  x={item.date} 
                  stroke="#FFE0C2" 
                  strokeWidth={20}
                  strokeOpacity={0.3}
                />
              ) : null
            )}
            
            <Line 
              type="monotone" 
              dataKey="reservations" 
              stroke="#FF7A00" 
              strokeWidth={3}
              dot={{ fill: "#FF7A00", r: 4 }}
              activeDot={{ r: 6, fill: "#FF7A00" }}
              name="예약건수"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#FF7A00] rounded-full"></div>
          <span>예약건수</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#FFE0C2] rounded-full"></div>
          <span>주말</span>
        </div>
      </div>
    </Card>
  );
}