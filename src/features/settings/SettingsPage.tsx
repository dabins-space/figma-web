import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Store, 
  Bell, 
  Link as LinkIcon, 
  Lock, 
  Palette,
  Save,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export function SettingsPage() {
  const [storeName, setStoreName] = useState("우리 맛집");
  const [storeAddress, setStoreAddress] = useState("서울시 강남구 테헤란로 123");
  const [storePhone, setStorePhone] = useState("02-1234-5678");
  const [storeHours, setStoreHours] = useState("10:00 - 22:00");

  const [notifications, setNotifications] = useState({
    kakao: true,
    email: false,
    sms: true,
    push: true
  });

  const [integrations, setIntegrations] = useState({
    googleCalendar: false,
    naverReservation: false,
    shinhanCard: true,
    pos: true,
    ddanggyeo: false
  });

  return (
    <main className="p-6 bg-[#F5F6F8] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">설정 / 커스터마이징</h1>
        <p className="text-gray-600">매장 정보와 시스템 설정을 관리하세요</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl border border-gray-200">
          <TabsTrigger value="store" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">
            <Store className="w-4 h-4 mr-2" />
            매장 정보
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" />
            프로필
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" />
            알림 설정
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">
            <LinkIcon className="w-4 h-4 mr-2" />
            연동 관리
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">
            <Palette className="w-4 h-4 mr-2" />
            외관
          </TabsTrigger>
        </TabsList>

        {/* 매장 정보 */}
        <TabsContent value="store" className="space-y-4">
          <Card className="p-6 bg-white rounded-2xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">매장 기본 정보</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">매장명</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeAddress">주소</Label>
                <Input
                  id="storeAddress"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">전화번호</Label>
                  <Input
                    id="storePhone"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeHours">영업시간</Label>
                  <Input
                    id="storeHours"
                    value={storeHours}
                    onChange={(e) => setStoreHours(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <Button className="bg-[#FF7A00] hover:bg-[#E86E00] text-white">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* 프로필 */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="p-6 bg-white rounded-2xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">개인 정보</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-[#FF7A00]/10 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-[#FF7A00]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">김점주</h4>
                  <p className="text-sm text-gray-600">owner@example.com</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  defaultValue="김점주"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="owner@example.com"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">휴대폰 번호</Label>
                <Input
                  id="phone"
                  defaultValue="010-1234-5678"
                  className="rounded-xl"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">비밀번호 변경</h4>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">현재 비밀번호</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <Button className="bg-[#FF7A00] hover:bg-[#E86E00] text-white">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6 bg-white rounded-2xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">알림 채널 설정</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">카카오톡 알림</h4>
                    <p className="text-sm text-gray-600">중요한 알림을 카카오톡으로 받습니다</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.kakao}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, kakao: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">이메일 알림</h4>
                    <p className="text-sm text-gray-600">주간 리포트를 이메일로 받습니다</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">SMS 알림</h4>
                    <p className="text-sm text-gray-600">긴급 알림을 문자로 받습니다</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, sms: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bell className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">푸시 알림</h4>
                    <p className="text-sm text-gray-600">앱 내 실시간 알림을 받습니다</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 연동 관리 */}
        <TabsContent value="integrations" className="space-y-4">
          <Card className="p-6 bg-white rounded-2xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">외부 서비스 연동</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-xl">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-white rounded-lg">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">Google Calendar</h4>
                      {integrations.googleCalendar ? (
                        <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          연동됨
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          미연동
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">마케팅 일정 자동 동기화</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
                >
                  {integrations.googleCalendar ? "연동 해제" : "연동하기"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-xl">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-white rounded-lg">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">네이버 예약</h4>
                      {integrations.naverReservation ? (
                        <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          연동됨
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          미연동
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">예약 데이터 실시간 동기화</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
                >
                  {integrations.naverReservation ? "연동 해제" : "연동하기"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-xl">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-white rounded-lg">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">신한카드</h4>
                      {integrations.shinhanCard ? (
                        <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          연동됨
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          미연동
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">카드 매출 데이터 연동</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
                >
                  {integrations.shinhanCard ? "연동 해제" : "연동하기"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-xl">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-white rounded-lg">
                    <span className="text-2xl">🖥️</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">POS 시스템</h4>
                      {integrations.pos ? (
                        <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          연동됨
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          미연동
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">POS 매출 데이터 자동 수집</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
                >
                  {integrations.pos ? "연동 해제" : "연동하기"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-xl">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-white rounded-lg">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">땡겨요</h4>
                      {integrations.ddanggyeo ? (
                        <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          연동됨
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          미연동
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">배달 주문 데이터 연동</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
                >
                  {integrations.ddanggyeo ? "연동 해제" : "연동하기"}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 외관 */}
        <TabsContent value="appearance" className="space-y-4">
          <Card className="p-6 bg-white rounded-2xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">테마 설정</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-2 border-[#FF7A00] rounded-xl bg-white cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">라이트 모드</span>
                    <CheckCircle className="w-5 h-5 text-[#FF7A00]" />
                  </div>
                  <div className="h-20 bg-gradient-to-r from-white to-gray-100 rounded-lg"></div>
                </div>

                <div className="p-4 border-2 border-gray-200 rounded-xl bg-white cursor-pointer opacity-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">다크 모드</span>
                    <span className="text-xs text-gray-500">준비중</span>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg"></div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-gray-900 mb-3">액센트 컬러</h4>
                <div className="grid grid-cols-6 gap-3">
                  {[
                    { color: "#FF7A00", name: "오렌지" },
                    { color: "#3580FF", name: "블루" },
                    { color: "#00B894", name: "그린" },
                    { color: "#9B59B6", name: "퍼플" },
                    { color: "#E74C3C", name: "레드" },
                    { color: "#F39C12", name: "옐로우" }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`w-full aspect-square rounded-xl cursor-pointer border-2 ${
                        index === 0 ? "border-gray-900" : "border-transparent"
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}