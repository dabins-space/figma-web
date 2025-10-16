// src/features/marketing-health/pages/Schedule.tsx
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AIChatSidebar } from "../components/AIChatSidebar";
import type { ActionPlan, CalendarRegistrationResult } from "@/types/actionPlan";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Target, AlertCircle, CheckCircle, XCircle } from "lucide-react";

// Google API 타입 정의
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
    gapi?: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: { discoveryDocs: string[] }) => Promise<void>;
        setToken: (token: { access_token: string } | null) => void;
        calendar: {
          events: {
            list: (params: {
              calendarId: string;
              timeMin: string;
              timeMax: string;
              singleEvents: boolean;
              orderBy: string;
            }) => Promise<{ result: { items?: GoogleCalendarEvent[] } }>;
            insert: (params: {
              calendarId: string;
              resource: GoogleCalendarEventResource;
            }) => Promise<void>;
          };
        };
      };
    };
  }
}

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

interface GoogleCalendarEventResource {
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  colorId?: string;
  attendees?: { email: string }[];
  reminders?: {
    useDefault: boolean;
    overrides?: { method: string; minutes: number }[];
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
}

const SCOPES =
  "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];


export default function Schedule() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [myEvents, setMyEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [registrationResult, setRegistrationResult] = useState<CalendarRegistrationResult | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedActionIds, setSelectedActionIds] = useState<Set<string>>(new Set());
  const [strategySummary, setStrategySummary] = useState<string>("");
  const [chatWidth, setChatWidth] = useState<number>(33.33); // 챗봇 영역 너비 (1:2 비율)
  const [isResizing, setIsResizing] = useState(false);
  
  type TokenClient = {
    requestAccessToken: (options?: { prompt?: string }) => void;
  };
  const tokenClientRef = useRef<TokenClient | null>(null);

  // 리사이즈 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const container = document.querySelector('.resize-container') as HTMLElement;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
    
    // 최소 20%, 최대 80%로 제한
    const clampedWidth = Math.min(Math.max(newWidth, 20), 80);
    setChatWidth(clampedWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // 마우스 이벤트 리스너 등록
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // 1) GIS & gapi 로드
  useEffect(() => {
    console.log("📡 Google API 스크립트 로딩 시작...");
    
    const gisScript = document.createElement("script");
    gisScript.src = "https://accounts.google.com/gsi/client";
    gisScript.async = true;
    gisScript.onload = () => {
      console.log("✅ Google Identity Services (GIS) 로드 완료");
      
      const gapiScript = document.createElement("script");
      gapiScript.src = "https://apis.google.com/js/api.js";
      gapiScript.async = true;
      gapiScript.onload = () => {
        console.log("✅ Google API (gapi) 로드 완료");
        if (window.gapi) {
          window.gapi.load("client", async () => {
            if (window.gapi) {
              try {
                await window.gapi.client.init({ discoveryDocs: DISCOVERY_DOCS });
                console.log("✅ Google Calendar API 초기화 완료");
              } catch (error) {
                console.error("❌ Google Calendar API 초기화 실패:", error);
              }
            }
          });
        }
      };
      gapiScript.onerror = () => {
        console.error("❌ Google API 스크립트 로드 실패");
      };
      document.body.appendChild(gapiScript);
    };
    gisScript.onerror = () => {
      console.error("❌ Google Identity Services 스크립트 로드 실패");
    };
    document.body.appendChild(gisScript);
  }, []);

  // 2) Token Client 준비 (+ setToken으로 gapi에 토큰 주입)
  const ensureTokenClient = () => {
    if (!tokenClientRef.current && window.google?.accounts?.oauth2) {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
        scope: SCOPES,
        callback: (resp) => {
          if (resp?.access_token) {
            // ✅ 중요: gapi에 토큰을 주입해야 calendar API가 인증됨
            if (window.gapi?.client) {
              (window.gapi.client as any).setToken({ access_token: resp.access_token });
            }
            setIsSignedIn(true);
            loadMyCalendar();
          } else if (resp?.error) {
            console.error("Google OAuth error:", resp.error);
            alert("Google 로그인 실패");
          }
        },
      });
    }
  };

  const signIn = () => {
    console.log("🔑 Google 로그인 버튼 클릭됨");
    
    // 환경 변수 체크
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("❌ VITE_GOOGLE_CLIENT_ID가 설정되지 않음");
      alert("Google Client ID가 설정되지 않았습니다. 관리자에게 문의하세요.");
      return;
    }
    
    // Google API 로딩 상태 체크
    if (!window.google?.accounts?.oauth2) {
      console.error("❌ Google OAuth API가 로드되지 않음");
      alert("Google 로그인 API가 아직 로드 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    
    console.log("✅ 환경 변수 및 API 상태 정상, 토큰 클라이언트 초기화 중...");
    ensureTokenClient();
    
    if (!tokenClientRef.current) {
      console.error("❌ 토큰 클라이언트 초기화 실패");
      alert("Google 로그인 클라이언트 초기화에 실패했습니다.");
      return;
    }
    
    console.log("🚀 Google OAuth 토큰 요청 시작");
    tokenClientRef.current?.requestAccessToken({ prompt: "consent" });
  };

  const signOut = () => {
    console.log("🚪 Google 로그아웃 시작");
    setIsSignedIn(false);
    setMyEvents([]);
    // gapi 토큰 제거
    if (window.gapi?.client) {
      (window.gapi.client as any).setToken(null);
    }
    console.log("✅ Google 로그아웃 완료");
  };

  // 3) 내 구글 캘린더 불러오기
  const loadMyCalendar = async () => {
    if (!window.gapi?.client?.calendar) {
      console.error("Google Calendar API not loaded");
      return;
    }

    try {
      const now = new Date();
      const timeMin = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 30일 전
      const timeMax = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(); // 90일 후
      
      const res = await window.gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: "startTime",
      });
      const items = res.result.items || [];
      setMyEvents(
        items.map((e) => ({
          id: e.id,
          title: e.summary || "제목 없음",
          start: e.start?.dateTime || e.start?.date || "",
          end: e.end?.dateTime || e.end?.date || "",
        }))
      );
    } catch (error) {
      console.error("Failed to load calendar:", error);
      alert("캘린더 로드 실패");
    }
  };

  // 액션 플랜 처리 함수
  const handleActionPlanGenerated = (plan: ActionPlan) => {
    setActionPlan(plan);
    setRegistrationResult(null);
    // 모든 액션 아이템을 기본 선택
    setSelectedActionIds(new Set(plan.items.map(item => item.id)));
    
    // 전략 요약 설정 (GPT가 생성한 요약 또는 기본 요약)
    if (plan.strategy_summary) {
      setStrategySummary(plan.strategy_summary);
    } else {
      // Mock 데이터용 기본 전략 요약 생성
      const categories = [...new Set(plan.items.map(item => item.notes?.split(' | ')[0]?.replace('분류: ', '')).filter(Boolean))];
      const priorities = plan.items.reduce((acc, item) => {
        const priority = item.priority || 'P2';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      let summary = `📊 **전략 분석 요약**\n\n`;
      summary += `🎯 **주요 마케팅 영역**: ${categories.join(', ')}\n`;
      summary += `⚡ **우선순위 분포**: `;
      if (priorities.P0) summary += `긴급(${priorities.P0}개) `;
      if (priorities.P1) summary += `중요(${priorities.P1}개) `;
      if (priorities.P2) summary += `일반(${priorities.P2}개)`;
      summary += `\n\n`;
      
      summary += `💡 **전략적 접근**: `;
      if (categories.includes('소셜미디어')) summary += `디지털 네이티브 세대를 위한 소셜미디어 중심 마케팅으로 브랜드 인지도 향상. `;
      if (categories.includes('이벤트')) summary += `체험형 이벤트를 통한 고객 참여도 증대 및 재방문 유도. `;
      if (categories.includes('고객관리')) summary += `개인화된 고객 관리 시스템으로 장기적 관계 구축. `;
      if (categories.includes('브랜딩')) summary += `일관된 브랜드 아이덴티티로 차별화된 시장 포지셔닝. `;
      if (categories.includes('지역마케팅')) summary += `지역 커뮤니티 중심의 관계형 마케팅으로 신뢰도 구축.`;
      
      if (!summary.includes('전략적 접근')) {
        summary += `종합적인 마케팅 접근으로 다각도의 고객 유치 및 브랜드 강화.`;
      }
      
      summary += `\n\n🚀 **예상 효과**: 체계적인 실행을 통해 고객 유입 증가, 브랜드 인지도 향상, 매출 증대 효과 기대`;
      
      setStrategySummary(summary);
    }
  };

  // Google Calendar에 선택된 액션만 등록
  const handleRegisterToCalendar = async () => {
    if (!actionPlan || !isSignedIn) {
      alert("액션 플랜이 없거나 Google 로그인이 필요합니다.");
      return;
    }

    if (selectedActionIds.size === 0) {
      alert("등록할 액션을 선택해주세요.");
      return;
    }

    setIsRegistering(true);
    setRegistrationResult(null);

    try {
      // 현재 Google API 토큰 가져오기
      const token = (window.gapi?.client as any)?.getToken?.();
      if (!token?.access_token) {
        alert("Google 인증 토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      // 선택된 액션만 포함한 플랜 생성
      const selectedActionPlan = {
        ...actionPlan,
        items: actionPlan.items.filter(item => selectedActionIds.has(item.id))
      };

      // Google Calendar API를 사용하여 직접 등록
      const result = await registerActionPlanDirectly(selectedActionPlan, token.access_token);
      setRegistrationResult(result);

      // 성공적으로 등록된 경우 캘린더 새로고침
      if (result.success > 0) {
        await loadMyCalendar();
      }

      // 결과 메시지 표시
      let message = `✅ ${result.success}개 이벤트가 등록되었습니다.`;
      if (result.failed > 0) {
        message += `\n❌ ${result.failed}개 이벤트 등록 실패.`;
      }
      if (result.skipped > 0) {
        message += `\n⏭️ ${result.skipped}개 이벤트 스킵됨 (중복).`;
      }
      alert(message);

    } catch (error) {
      console.error('캘린더 등록 실패:', error);
      alert(`캘린더 등록 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsRegistering(false);
    }
  };

  // 액션 아이템 선택/해제
  const toggleActionSelection = (actionId: string) => {
    const newSet = new Set(selectedActionIds);
    if (newSet.has(actionId)) {
      newSet.delete(actionId);
    } else {
      newSet.add(actionId);
    }
    setSelectedActionIds(newSet);
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (!actionPlan) return;
    
    if (selectedActionIds.size === actionPlan.items.length) {
      setSelectedActionIds(new Set());
    } else {
      setSelectedActionIds(new Set(actionPlan.items.map(item => item.id)));
    }
  };

  // Google Calendar에 직접 액션 플랜 등록
  const registerActionPlanDirectly = async (actionPlan: ActionPlan, accessToken: string) => {
    if (!window.gapi?.client?.calendar) {
      throw new Error("Google Calendar API가 로드되지 않았습니다");
    }

    const result = {
      success: 0,
      failed: 0,
      skipped: 0,
      details: {
        success_items: [] as string[],
        failed_items: [] as { title: string; error: string }[],
        skipped_items: [] as string[],
      },
    };

    // 우선순위별 색상 매핑
    const priorityColors = {
      'P0': '11', // 빨간색 (긴급)
      'P1': '6',  // 주황색 (중요)
      'P2': '9',  // 파란색 (일반)
    };

    for (const item of actionPlan.items) {
      try {
        // 시작/종료 시간 설정
        let startTime: Date;
        let endTime: Date;
        let isAllDay = item.all_day || false;

        if (item.start && item.end) {
          startTime = new Date(item.start);
          endTime = new Date(item.end);
        } else {
          // 기본값: 다음 영업일 10:00-11:00
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1); // 일요일이면 월요일로
          if (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 2); // 토요일이면 월요일로
          tomorrow.setHours(10, 0, 0, 0);
          startTime = tomorrow;
          endTime = new Date(tomorrow.getTime() + 60 * 60 * 1000); // 1시간 후
        }

        // 기존 이벤트 중복 체크 (간단하게 시간 범위로만 체크)
        const existingEvents = await window.gapi.client.calendar.events.list({
          calendarId: 'primary',
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        });

        if (existingEvents.result.items && existingEvents.result.items.length > 0) {
          result.skipped++;
          result.details.skipped_items.push(item.title);
          continue;
        }

        // 이벤트 생성
        const event = {
          summary: item.title,
          description: [
            item.description || '',
            item.notes ? `\n추가 메모: ${item.notes}` : '',
            item.channel ? `\n채널: ${item.channel}` : '',
            `\n우선순위: ${item.priority || 'P2'}`,
          ].filter(Boolean).join('\n'),
          start: isAllDay 
            ? { date: startTime.toISOString().split('T')[0] }
            : { dateTime: startTime.toISOString() },
          end: isAllDay 
            ? { date: endTime.toISOString().split('T')[0] }
            : { dateTime: endTime.toISOString() },
          colorId: priorityColors[item.priority || 'P2'],
          reminders: {
            useDefault: false,
            overrides: item.reminders?.map(r => ({
              method: 'popup',
              minutes: r.minutes_before,
            })) || [{ method: 'popup', minutes: 30 }],
          },
          extendedProperties: {
            private: {
              clientRequestId: item.id,
              actionPlanId: actionPlan.plan_title,
            },
          },
        };

        // 이벤트 등록
        await window.gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: event,
        });

        result.success++;
        result.details.success_items.push(item.title);

      } catch (itemError) {
        console.error(`이벤트 등록 실패 (${item.title}):`, itemError);
        result.failed++;
        result.details.failed_items.push({
          title: item.title,
          error: itemError instanceof Error ? itemError.message : '알 수 없는 오류',
        });
      }
    }

    return result;
  };


  return (
    <div className="space-y-4 p-4">
      {/* Google 로그인 상태 및 버튼 */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-semibold">Google Calendar 연동</h4>
              <p className="text-sm text-gray-600">
                {isSignedIn ? "✅ Google Calendar에 연결되었습니다" : "Google Calendar 연동이 필요합니다"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isSignedIn ? (
              <Button 
                onClick={signIn}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Google 로그인
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={signOut}
                disabled={isLoading}
              >
                로그아웃
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 전략 요약 영역 */}
      {strategySummary && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-800 mb-2">마케팅 전략 분석</h3>
              <div className="text-sm text-blue-700 whitespace-pre-line leading-relaxed">
                {strategySummary}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 메인 콘텐츠 영역 - 리사이즈 가능 (데스크톱만) */}
      <div className="hidden lg:flex resize-container gap-2 h-[calc(100vh-16rem)]">
        {/* 좌: AI 채팅 사이드바 */}
        <div 
          className="h-full flex-shrink-0"
          style={{ width: `${chatWidth}%` }}
        >
          <AIChatSidebar 
            onActionPlanGenerated={handleActionPlanGenerated}
            isGoogleSignedIn={isSignedIn}
          />
        </div>

        {/* 리사이즈 핸들 */}
        <div 
          className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize flex-shrink-0 transition-colors relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 w-3 -left-1 bg-transparent hover:bg-blue-100/50 transition-colors" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-0.5 h-8 bg-blue-500 rounded-full" />
          </div>
        </div>

        {/* 우: Google Calendar */}
        <Card 
          className="p-3 h-full flex flex-col flex-1 min-w-0 calendar-container"
          style={{ width: `${100 - chatWidth}%` }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">내 Google Calendar</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadMyCalendar}
              disabled={!isSignedIn}
            >
              새로고침
            </Button>
          </div>
          <div className="flex-1">
            {isSignedIn ? (
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={myEvents}
                height="100%"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek'
                }}
                dayMaxEvents={3}
                moreLinkClick="popover"
                eventDisplay="block"
                eventTextColor="#ffffff"
                eventBackgroundColor="#3b82f6"
                eventBorderColor="#1d4ed8"
                dayHeaderFormat={{ weekday: 'short' }}
                nowIndicator={true}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEventRows={false}
                weekends={true}
                firstDay={1}
                locale="ko"
                buttonText={{
                  today: '오늘',
                  month: '월',
                  week: '주',
                  day: '일'
                }}
                titleFormat={{ year: 'numeric', month: 'long' }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Google 로그인이 필요합니다</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="lg:hidden space-y-4 h-[calc(100vh-16rem)]">
        <div className="h-[50%]">
          <AIChatSidebar 
            onActionPlanGenerated={handleActionPlanGenerated}
            isGoogleSignedIn={isSignedIn}
          />
        </div>
        <div className="h-[50%]">
          <Card className="p-3 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">내 Google Calendar</h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadMyCalendar}
                disabled={!isSignedIn}
              >
                새로고침
              </Button>
            </div>
            <div className="flex-1">
              {isSignedIn ? (
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={myEvents}
                  height="100%"
                  headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: 'today'
                  }}
                  dayMaxEvents={2}
                  moreLinkClick="popover"
                  eventDisplay="block"
                  eventTextColor="#ffffff"
                  eventBackgroundColor="#3b82f6"
                  eventBorderColor="#1d4ed8"
                  dayHeaderFormat={{ weekday: 'short' }}
                  nowIndicator={true}
                  firstDay={1}
                  locale="ko"
                  buttonText={{
                    today: '오늘'
                  }}
                  titleFormat={{ year: 'numeric', month: 'long' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Google 로그인이 필요합니다</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 액션 플랜 표시 영역 - 하단으로 이동 */}
      {actionPlan && (
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="text-lg font-bold text-orange-800">{actionPlan.plan_title}</h3>
                <p className="text-sm text-orange-600">
                  {selectedActionIds.size}/{actionPlan.items.length}개 선택됨
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={toggleSelectAll}
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                {selectedActionIds.size === actionPlan.items.length ? "전체 해제" : "전체 선택"}
              </Button>
              <Button
                onClick={handleRegisterToCalendar}
                disabled={!isSignedIn || isRegistering || selectedActionIds.size === 0}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isRegistering ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    등록 중...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    선택 항목 등록 ({selectedActionIds.size})
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 액션 아이템 리스트 - 체크박스 포함 */}
          <div className="space-y-3 mb-4">
            {actionPlan.items.map((item, index) => (
              <div 
                key={item.id} 
                className={`bg-white rounded-lg p-4 border-2 transition-all cursor-pointer ${
                  selectedActionIds.has(item.id) 
                    ? 'border-orange-400 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => toggleActionSelection(item.id)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedActionIds.has(item.id)}
                    onChange={() => toggleActionSelection(item.id)}
                    className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm">{item.title}</h4>
                      <Badge 
                        variant={item.priority === 'P0' ? 'destructive' : item.priority === 'P1' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {item.priority}
                      </Badge>
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-600 mb-2">
                        <p className="mb-1">{item.description.split(' | ')[0]}</p>
                        {item.description.includes('전략:') && (
                          <p className="text-orange-600 font-medium">
                            💡 {item.description.split('전략: ')[1]?.split(' | ')[0]}
                          </p>
                        )}
                        {item.description.includes('과정:') && (
                          <p className="text-blue-600 text-xs mt-1">
                            📋 {item.description.split('과정: ')[1]}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {item.channel && (
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {item.channel}
                        </span>
                      )}
                      {item.start && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.start).toLocaleDateString('ko-KR')}
                        </span>
                      )}
                      {item.notes && (
                        <span className="text-purple-600 font-medium">
                          {item.notes.split(' | ')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 등록 결과 표시 */}
          {registrationResult && (
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                등록 결과
              </h4>
              <div className="flex gap-4 text-sm">
                {registrationResult.success > 0 && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    성공: {registrationResult.success}개
                  </span>
                )}
                {registrationResult.failed > 0 && (
                  <span className="flex items-center gap-1 text-red-600">
                    <XCircle className="w-4 h-4" />
                    실패: {registrationResult.failed}개
                  </span>
                )}
                {registrationResult.skipped > 0 && (
                  <span className="flex items-center gap-1 text-yellow-600">
                    <AlertCircle className="w-4 h-4" />
                    스킵: {registrationResult.skipped}개
                  </span>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
