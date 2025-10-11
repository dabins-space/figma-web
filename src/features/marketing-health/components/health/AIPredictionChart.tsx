import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Bot } from "lucide-react";

const predictionData = [
  { week: "1주 전", actual: 2450000, predicted: null },
  { week: "2주 전", actual: 2720000, predicted: null },
  { week: "3주 전", actual: 2440000, predicted: null },
  { week: "4주 전", actual: 2890000, predicted: null },
  { week: "현재", actual: 2450000, predicted: 2450000 },
  { week: "1주 후", actual: null, predicted: 2680000 },
  { week: "2주 후", actual: null, predicted: 2750000 }
];

export function AIPredictionChart() {
  const formatCurrency = (value: number) => {
    return `₩${(value / 10000).toFixed(0)}만`;
  };

  return (
    <Card className="p-6 bg-white rounded-2xl border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-[#FF7A00]/10 rounded-lg">
          <Bot className="w-5 h-5 text-[#FF7A00]" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">AI 매출 예측</h3>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={predictionData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="week" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), ""]}
              labelStyle={{ color: "#666" }}
              contentStyle={{ 
                backgroundColor: "white", 
                border: "1px solid #e0e0e0", 
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              }}
            />
            <ReferenceLine x="현재" stroke="#FF7A00" strokeDasharray="2 2" />
            
            {/* Actual sales line */}
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#3580FF" 
              strokeWidth={3}
              dot={{ fill: "#3580FF", r: 4 }}
              name="실제 매출"
              connectNulls={false}
            />
            
            {/* Predicted sales line */}
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#00B894" 
              strokeWidth={3}
              strokeDasharray="8 4"
              dot={{ fill: "#00B894", r: 4 }}
              name="예측 매출"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-4 bg-[#00B894]/5 rounded-lg border border-[#00B894]/20">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-[#00B894] rounded-full"></div>
          <span className="text-sm font-medium text-[#00B894]">AI 예측 분석</span>
        </div>
        <p className="text-sm text-gray-700">
          향후 2주간 매출이 <span className="font-medium text-[#00B894]">9% 증가</span>할 것으로 예측됩니다.
          신뢰도: 87%
        </p>
      </div>
    </Card>
  );
}