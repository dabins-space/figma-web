import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Settings, HelpCircle, Bot, Home, BarChart3, TrendingUp, Calendar, Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type PageType = "dashboard" | "health-index" | "sales-management" | "marketing" | "reservations" | "ai-coach" | "news" | "settings";

interface ChatHeaderProps {
  isLoading?: boolean;
  loadingProgress?: number;
  onNavigate?: (page: PageType) => void;
}

export function ChatHeader({ isLoading = false, loadingProgress = 0, onNavigate }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate?.("dashboard")}
            className="hover:bg-[#FF7A00]/10"
            title="대시보드로 돌아가기"
          >
            <Home className="w-5 h-5 text-gray-600 hover:text-[#FF7A00]" />
          </Button>
          <div className="p-2 bg-[#FF7A00]/10 rounded-xl">
            <Bot className="w-6 h-6 text-[#FF7A00]" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">AI 잘코치 🤖</h1>
        </div>

        {/* Menu Items */}
        <div className="flex items-center space-x-2">
          {/* Navigation Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Menu className="w-5 h-5 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onNavigate?.("dashboard")}>
                <Home className="w-4 h-4 mr-2" />
                대시보드
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.("health-index")}>
                <BarChart3 className="w-4 h-4 mr-2" />
                매장 건강지수
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.("reservations")}>
                <Calendar className="w-4 h-4 mr-2" />
                예약관리
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.("marketing")}>
                <TrendingUp className="w-4 h-4 mr-2" />
                마케팅 관리
              </DropdownMenuItem>
              <div className="h-px bg-gray-200 my-1"></div>
              <DropdownMenuItem disabled>
                <Bot className="w-4 h-4 mr-2 text-[#FF7A00]" />
                AI 잘코치 (현재)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <User className="w-5 h-5 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                마이페이지
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                AI 설정
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>

          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {isLoading && (
        <div className="mt-3">
          <Progress 
            value={loadingProgress} 
            className="h-1"
            style={{
              backgroundColor: '#FFE0C2'
            }}
          />
          <p className="text-xs text-[#FF7A00] mt-1">AI가 분석 중입니다...</p>
        </div>
      )}
    </div>
  );
}