import { Card } from "../ui/card";
import { Star } from "lucide-react";

export function ReviewSummaryCard() {
  return (
    <Card className="p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div className="text-center">
        <h3 className="text-sm text-gray-600 mb-3">리뷰 평점 요약</h3>
        <div className="flex items-center justify-center space-x-1 mb-2">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="text-2xl font-bold text-gray-900">4.5</span>
        </div>
        <div className="flex items-center justify-center space-x-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= 4 
                  ? "text-yellow-400 fill-current" 
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-medium">128건</span>의 리뷰
        </p>
        <p className="text-xs text-gray-500 mt-1">이번 달 +12건</p>
      </div>
    </Card>
  );
}