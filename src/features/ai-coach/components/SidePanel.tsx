import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, Lightbulb, Calendar, Users, BarChart3, MessageSquare, PlayCircle, CheckCircle, Clock } from "lucide-react";

const recommendedCommands = [
  {
    icon: TrendingUp,
    title: "매출 트렌드 분석해줘",
    description: "최근 매출 데이터를 분석합니다",
    category: "분석"
  },
  {
    icon: Lightbulb,
    title: "리뷰 이벤트 문구 만들어줘",
    description: "고객 참여를 유도하는 이벤트 문구를 생성합니다",
    category: "마케팅"
  },
  {
    icon: Calendar,
    title: "이번주 예약률 예측해줘",
    description: "예약 패턴을 분석해 예측합니다",
    category: "예측"
  },
  {
    icon: Users,
    title: "단골 고객 관리 방법",
    description: "고객 충성도를 높이는 전략을 제안합니다",
    category: "고객관리"
  },
  {
    icon: BarChart3,
    title: "경쟁사 분석 보고서",
    description: "업종 평균과 비교 분석합니다",
    category: "분석"
  },
  {
    icon: MessageSquare,
    title: "SNS 콘텐츠 아이디어",
    description: "소셜미디어용 콘텐츠를 제안합니다",
    category: "마케팅"
  }
];

const executionLog = [
  {
    id: "1",
    action: "리뷰 이벤트 생성",
    status: "completed",
    timestamp: "방금 전",
    result: "네이버 예약에 이벤트 등록 완료"
  },
  {
    id: "2",
    action: "SNS 포스트 발행",
    status: "running",
    timestamp: "2분 전",
    result: "인스타그램 스토리 업로드 중..."
  },
  {
    id: "3",
    action: "할인 쿠폰 발송",
    status: "completed",
    timestamp: "15분 전",
    result: "단골 고객 147명에게 발송 완료"
  },
  {
    id: "4",
    action: "예약 리마인드 설정",
    status: "completed",
    timestamp: "1시간 전",
    result: "자동 SMS 알림 활성화"
  }
];

interface SidePanelProps {
  onCommandSelect: (command: string) => void;
}

export function SidePanel({ onCommandSelect }: SidePanelProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-[#00B894]" />;
      case "running":
        return <PlayCircle className="w-4 h-4 text-[#FF7A00]" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20";
      case "running":
        return "bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/20";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="w-80 bg-[#F7F8FA] border-l border-gray-200 flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Recommended Commands */}
          <Card className="p-4 bg-white border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-[#FF7A00]" />
              <h3 className="font-semibold text-gray-900">추천 명령어</h3>
            </div>
            <div className="space-y-3">
              {recommendedCommands.map((command, index) => (
                <div
                  key={index}
                  onClick={() => onCommandSelect(command.title)}
                  className="p-3 rounded-lg border border-gray-100 hover:border-[#FF7A00]/30 hover:bg-[#FF7A00]/5 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-[#FF7A00]/10 rounded-lg group-hover:bg-[#FF7A00]/20">
                      <command.icon className="w-4 h-4 text-[#FF7A00]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {command.title}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {command.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {command.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Execution Log */}
          <Card className="p-4 bg-white border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <PlayCircle className="w-5 h-5 text-[#3580FF]" />
              <h3 className="font-semibold text-gray-900">AI 실행 로그</h3>
            </div>
            <div className="space-y-3">
              {executionLog.map((log) => (
                <div key={log.id} className="p-3 bg-[#F7F8FA] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(log.status)}
                      <span className="font-medium text-gray-900 text-sm">{log.action}</span>
                    </div>
                    <Badge className={getStatusColor(log.status)}>
                      {log.status === "completed" ? "완료" : log.status === "running" ? "실행중" : "대기"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{log.result}</p>
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Tips */}
          <Card className="p-4 bg-gradient-to-br from-[#3580FF]/5 to-[#00B894]/5 border border-[#3580FF]/20">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-[#3580FF]/10 rounded-lg">
                <Lightbulb className="w-4 h-4 text-[#3580FF]" />
              </div>
              <h3 className="font-semibold text-gray-900">잘코치 Tip</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white/80 rounded-lg">
                <p className="text-sm text-gray-800 leading-relaxed">
                  지난달보다 SNS 참여율이 8% 증가했어요. 비슷한 패턴의 콘텐츠를 추천할까요?
                </p>
                <Button 
                  size="sm" 
                  className="mt-2 bg-[#3580FF] hover:bg-[#2563EB] text-white text-xs"
                  onClick={() => onCommandSelect("SNS 콘텐츠 추천해줘")}
                >
                  콘텐츠 추천받기
                </Button>
              </div>
              
              <div className="p-3 bg-white/80 rounded-lg">
                <p className="text-sm text-gray-800 leading-relaxed">
                  이번 주 예약률이 평균보다 15% 높아요. 추가 마케팅으로 더 큰 효과를 노려보세요!
                </p>
                <Button 
                  size="sm" 
                  className="mt-2 bg-[#00B894] hover:bg-[#059669] text-white text-xs"
                  onClick={() => onCommandSelect("추가 마케팅 전략 추천해줘")}
                >
                  전략 보기
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}