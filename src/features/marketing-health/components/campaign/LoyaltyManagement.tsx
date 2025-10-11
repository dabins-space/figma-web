import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Repeat, Gift, TrendingUp } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const visitData = [
  { month: "1월", rate: 65 },
  { month: "2월", rate: 72 },
  { month: "3월", rate: 68 },
  { month: "4월", rate: 78 },
  { month: "5월", rate: 82 }
];

const loyalCustomers = [
  { name: "김고객", avatar: "K", lastVisit: "2일 전" },
  { name: "이단골", avatar: "L", lastVisit: "1주일 전" },
  { name: "박단골", avatar: "P", lastVisit: "3일 전" }
];

export function LoyaltyManagement() {
  return (
    <Card className="p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">단골관리</h3>
          <p className="text-sm text-gray-600">POS/땡겨요 기반</p>
        </div>
        <Button className="bg-[#FF7A00] hover:bg-[#E86E00] text-white">
          단골 이벤트 만들기
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Loyal Customers */}
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-[#3580FF]" />
            <span className="text-sm text-gray-600">단골 수</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">147</span>
            <span className="text-sm text-[#00B894]">+8 (신규)</span>
          </div>
        </div>

        {/* Revisit Rate */}
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <Repeat className="w-5 h-5 text-[#00B894]" />
            <span className="text-sm text-gray-600">재방문율</span>
          </div>
          <div className="h-12 mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitData}>
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#00B894" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-lg font-bold text-gray-900">82%</div>
        </div>

        {/* Coupon Usage */}
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <Gift className="w-5 h-5 text-[#FF7A00]" />
            <span className="text-sm text-gray-600">쿠폰 사용률</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">64%</div>
          <div className="text-xs text-gray-500 mt-1">이번 달 89매 사용</div>
        </div>
      </div>

      {/* Loyal Customer List */}
      <div className="bg-white p-4 rounded-xl border border-gray-100">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">단골 고객 목록</span>
        </div>
        <div className="space-y-3">
          {loyalCustomers.map((customer, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-[#FF7A00]/10 text-[#FF7A00]">
                    {customer.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900">{customer.name}</span>
              </div>
              <span className="text-xs text-gray-500">{customer.lastVisit}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}