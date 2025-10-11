import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, MessageCircle, Users, TrendingUp, Lightbulb } from "lucide-react";

const platforms = [
  {
    name: "Instagram",
    icon: Instagram,
    posts: 24,
    engagement: "4.2%",
    followers: "+15"
  },
  {
    name: "카카오톡",
    icon: MessageCircle,
    posts: 12,
    engagement: "8.7%",
    followers: "+8"
  },
  {
    name: "네이버 Post",
    icon: TrendingUp,
    posts: 8,
    engagement: "2.1%",
    followers: "+3"
  }
];

export function SocialMediaManagement() {
  return (
    <Card className="p-6 bg-[#F7F8FA] rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">SNS관리</h3>
          <p className="text-sm text-gray-600">소셜미디어 통합 관리</p>
        </div>
        <Button className="bg-[#FF7A00] hover:bg-[#E86E00] text-white">
          AI 포스트 생성
        </Button>
      </div>

      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {platforms.map((platform, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center space-x-2 mb-3">
              <platform.icon className="w-5 h-5 text-[#3580FF]" />
              <span className="text-sm font-medium text-gray-900">{platform.name}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">게시물</span>
                <span className="text-sm font-medium">{platform.posts}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">참여율</span>
                <span className="text-sm font-medium text-[#00B894]">{platform.engagement}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">팔로워</span>
                <span className="text-sm font-medium text-[#FF7A00]">{platform.followers}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
          <Users className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">2,347</div>
          <div className="text-xs text-gray-600">총 팔로워</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
          <TrendingUp className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">5.1%</div>
          <div className="text-xs text-gray-600">평균 참여율</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
          <MessageCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">156</div>
          <div className="text-xs text-gray-600">월간 상호작용</div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-[#FF7A00]/5 to-[#FFD8B0]/10 p-4 rounded-xl border border-[#FF7A00]/20">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-[#FF7A00]/10 rounded-lg flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-[#FF7A00]" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800 font-medium mb-1">AI 마케팅 제안</p>
            <p className="text-sm text-gray-700">
              2030 고객이 많은 매장입니다. Reels 중심 캠페인을 제안할까요? 
              해시태그 #맛집추천 #신메뉴 활용을 권장합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-4 bg-white p-4 rounded-xl border border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 mb-3">최근 활동</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-2">
              <Instagram className="w-4 h-4 text-pink-500" />
              <span className="text-sm text-gray-700">새 메뉴 홍보 포스트</span>
            </div>
            <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
              좋아요 84개
            </Badge>
          </div>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-700">카카오톡 이벤트 공지</span>
            </div>
            <Badge className="bg-[#3580FF]/10 text-[#3580FF] border-[#3580FF]/20">
              조회 234회
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}