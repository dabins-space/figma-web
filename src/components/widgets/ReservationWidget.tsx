import { Card } from "../ui/card";
import { Calendar, Clock, Users, MapPin } from "lucide-react";

export function ReservationWidget() {
  return (
    <Card className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">예약 현황 요약</h3>
        <div className="p-2 bg-[#3580FF]/10 rounded-lg">
          <Calendar className="w-5 h-5 text-[#3580FF]" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">23건</span>
          <span className="text-sm text-[#FF7A00] bg-[#FF7A00]/10 px-2 py-1 rounded-full">
            오늘
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">대기 중</span>
            </div>
            <span className="font-medium text-[#FF7A00]">5건</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">확정</span>
            </div>
            <span className="font-medium text-[#00B894]">18건</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">네이버 예약</span>
            </div>
            <span className="font-medium">연동됨</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-[#F5F6F8] rounded-lg">
          <p className="text-sm text-gray-600">다음 예약: 오후 2:30 (김고객님)</p>
        </div>
      </div>
    </Card>
  );
}