import { Card } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Badge } from "../ui/badge";

const salesData = [
  {
    month: "1주",
    신한카드: 1200000,
    POS: 850000,
    땡겨요: 400000
  },
  {
    month: "2주",
    신한카드: 1350000,
    POS: 920000,
    땡겨요: 450000
  },
  {
    month: "3주",
    신한카드: 1180000,
    POS: 880000,
    땡겨요: 380000
  },
  {
    month: "4주",
    신한카드: 1420000,
    POS: 950000,
    땡겨요: 520000
  }
];

export function IntegratedSalesChart() {
  const formatCurrency = (value: number) => {
    return `₩${(value / 10000).toFixed(0)}만`;
  };

  return (
    <Card className="p-6 bg-white rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">통합 매출 분석</h3>
        <Badge variant="secondary" className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
          업종 평균 대비 +12%
        </Badge>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={salesData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
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
            <Legend />
            <Bar 
              dataKey="신한카드" 
              fill="#FF7A00" 
              name="신한카드"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="POS" 
              fill="#3580FF" 
              name="POS"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="땡겨요" 
              fill="#00B894" 
              name="땡겨요"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}