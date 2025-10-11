import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Store, TrendingUp, Users, BarChart3 } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <Store className="h-8 w-8 text-[#FF7A00]" />
              <h1 className="text-3xl font-bold text-gray-900">잘나가게</h1>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              소상공인을 위한 AI 마케팅 플랫폼
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              AI 기반 데이터 분석으로<br />
              매장 운영을 더 쉽고 효율적으로
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-3 bg-[#3580FF]/10 rounded-xl">
                <BarChart3 className="w-6 h-6 text-[#3580FF]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">실시간 매출 분석</h3>
                <p className="text-sm text-gray-600">통합 데이터로 한눈에 확인</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-3 bg-[#00B894]/10 rounded-xl">
                <Users className="w-6 h-6 text-[#00B894]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI 마케팅 코치</h3>
                <p className="text-sm text-gray-600">맞춤형 마케팅 전략 제안</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-3 bg-[#FF7A00]/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-[#FF7A00]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">스마트 예약관리</h3>
                <p className="text-sm text-gray-600">노쇼 방지 & 예약률 향상</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Store className="h-8 w-8 text-[#FF7A00]" />
                <h1 className="text-2xl font-bold text-gray-900">잘나가게</h1>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인</h2>
              <p className="text-gray-600">계정에 로그인하여 시작하세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 rounded-xl border-gray-300 focus:border-[#FF7A00] focus:ring-[#FF7A00]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-gray-300 focus:border-[#FF7A00] focus:ring-[#FF7A00]"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    로그인 상태 유지
                  </label>
                </div>
                <Button 
                  type="button"
                  variant="ghost" 
                  className="text-sm text-[#FF7A00] hover:text-[#E86E00] p-0 h-auto"
                >
                  비밀번호 찾기
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#FF7A00] hover:bg-[#E86E00] text-white rounded-xl font-semibold"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  아직 계정이 없으신가요?{" "}
                  <Button 
                    type="button"
                    variant="ghost" 
                    className="text-[#FF7A00] hover:text-[#E86E00] p-0 h-auto font-semibold"
                  >
                    회원가입
                  </Button>
                </p>
              </div>
            </form>

            {/* Demo Login Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                💡 데모용: 아무 아이디나 입력 후 로그인하세요
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>© 2025 잘나가게. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}