import { Card } from "@/components/ui/card";
import { TrendingUp, CreditCard, Smartphone, ShoppingCart } from "lucide-react";

export function SalesWidget() {
  return (
    <Card className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">오늘의 매출 요약</h3>
        <div className="p-2 bg-[#3580FF]/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-[#3580FF]" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">₩2,450,000</span>
          <span className="text-sm text-[#00B894] bg-[#00B894]/10 px-2 py-1 rounded-full">
            +12.5%
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">신한카드</span>
            </div>
            <span className="font-medium">₩1,200,000</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">POS</span>
            </div>
            <span className="font-medium">₩850,000</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">땡겨요</span>
            </div>
            <span className="font-medium">₩400,000</span>
          </div>
        </div>
      </div>
    </Card>
  );
}