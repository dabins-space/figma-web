import { Card } from "../ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface HealthScoreCardProps {
  score: number;
  trend: "up" | "down";
  change: number;
}

export function HealthScoreCard({ score, trend, change }: HealthScoreCardProps) {
  const isPositive = trend === "up";
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <Card className="p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div className="text-center">
        <h3 className="text-sm text-gray-600 mb-3">매출 건강 점수</h3>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-4xl font-bold text-gray-900">{score}</span>
          <span className="text-lg text-gray-500">점</span>
        </div>
        <div className={`flex items-center justify-center space-x-1 ${
          isPositive ? "text-[#00B894]" : "text-red-500"
        }`}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isPositive ? "+" : ""}{change}점
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">지난주 대비</p>
      </div>
    </Card>
  );
}