import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Settings, Link, Bell, Bot } from "lucide-react";

interface ReservationSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationSettings({ open, onOpenChange }: ReservationSettingsProps) {
  const [naverIntegration, setNaverIntegration] = useState(false);
  const [autoReminders, setAutoReminders] = useState(true);
  const [aiNotifications, setAiNotifications] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-[#FF7A00]/10 rounded-lg">
              <Settings className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <span>예약관리 설정</span>
          </DialogTitle>
          <DialogDescription>
            예약 연동 및 알림 설정을 관리할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Naver Integration */}
          <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg">
                <Link className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">네이버 예약 연동</h4>
                <p className="text-xs text-gray-600">네이버 예약 데이터를 자동으로 동기화</p>
              </div>
            </div>
            <Switch
              checked={naverIntegration}
              onCheckedChange={setNaverIntegration}
            />
          </div>

          {/* Auto Reminders */}
          <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">리마인드 자동 발송</h4>
                <p className="text-xs text-gray-600">예약 전 자동 알림 메시지 발송</p>
              </div>
            </div>
            <Switch
              checked={autoReminders}
              onCheckedChange={setAutoReminders}
            />
          </div>

          {/* AI Notifications */}
          <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg">
                <Bot className="w-4 h-4 text-[#FF7A00]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">AI 알림 활성화</h4>
                <p className="text-xs text-gray-600">AI 기반 예약 패턴 분석 알림</p>
              </div>
            </div>
            <Switch
              checked={aiNotifications}
              onCheckedChange={setAiNotifications}
            />
          </div>

          {/* Integration Status */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-2">연동 상태</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-700">네이버 예약</span>
                <span className="text-xs text-gray-500">연동 대기</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-700">SMS 발송</span>
                <span className="text-xs text-green-600">활성화</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-700">AI 분석</span>
                <span className="text-xs text-green-600">활성화</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              className="flex-1 bg-[#FF7A00] hover:bg-[#E86E00] text-white"
              onClick={() => onOpenChange(false)}
            >
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}