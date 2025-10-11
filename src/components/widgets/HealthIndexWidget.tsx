import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

export function HealthIndexWidget() {
  const score = 83;
  const trend = "up";
  const change = 5;
  const isPositive = trend === "up";

  return (
    <Card className="h-full p-4 bg-gradient-to-r from-[#3580FF]/5 to-[#3580FF]/10 rounded-2xl border border-[#3580FF]/20 hover:shadow-md transition-shadow cursor-pointer">
      <div className="h-full flex items-center space-x-4">
        {/* Icon */}
        <div className="p-3 bg-[#3580FF]/20 rounded-xl flex-shrink-0">
          <BarChart3 className="w-6 h-6 text-[#3580FF]" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">매장 건강지수</h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900">{score}</span>
              <span className="text-lg text-gray-500">점</span>
            </div>
            <div className={`flex items-center space-x-1 ${
              isPositive ? "text-[#00B894]" : "text-red-500"
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isPositive ? "+" : ""}{change}점
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">지난주 대비</p>
        </div>

        {/* Badge */}
        <div className="flex-shrink-0">
          <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20 px-3 py-1">
            상위 15%
          </Badge>
        </div>
      </div>
    </Card>
  );
}