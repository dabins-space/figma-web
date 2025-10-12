// src/features/marketing-health/pages/Schedule.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createMarketingPlan, type MarketingPlan } from "@/api";

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

// ===== 유틸 함수 =====

// 날짜 유틸: 'YYYY-MM-DD' 반환
const toYMD = (d: Date) => {
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};

// ✅ 종일 이벤트 end 규칙 보정: end(YYYY-MM-DD)는 종료일 익일이어야 보임
function normalizeAllDayRange(startIsoOrDate: string, endIsoOrDate?: string) {
  // 입력이 ISO일 수 있으므로 date만 추출
  const start = new Date(startIsoOrDate);
  const end = endIsoOrDate ? new Date(endIsoOrDate) : new Date(start);
  // 만약 동일일 또는 end가 누락됐으면, end를 +1일로
  if (toYMD(start) >= toYMD(end)) {
    end.setDate(end.getDate() + 1);
  }
  return { startDate: toYMD(start), endDate: toYMD(end) };
}

// ✅ 플랜 기반 조회 윈도우 계산: plan 이벤트가 있으면 그 범위에 버퍼(±15일) 적용
function getPlanWindow(plan?: { events?: Array<{ start: string; end: string; all_day?: boolean }> }) {
  if (!plan?.events?.length) {
    const now = new Date();
    const min = new Date(now); min.setDate(min.getDate() - 30);
    const max = new Date(now); max.setDate(max.getDate() + 90);
    return { timeMin: min.toISOString(), timeMax: max.toISOString() };
  }
  let minDt = new Date(plan.events[0].start);
  let maxDt = new Date(plan.events[0].end || plan.events[0].start);
  for (const ev of plan.events) {
    const s = new Date(ev.start);
    const e = new Date(ev.end || ev.start);
    if (s < minDt) minDt = s;
    if (e > maxDt) maxDt = e;
  }
  // 버퍼 ±15일
  minDt.setDate(minDt.getDate() - 15);
  maxDt.setDate(maxDt.getDate() + 15);
  return { timeMin: minDt.toISOString(), timeMax: maxDt.toISOString() };
}

export default function Schedule() {
  const [brief, setBrief] = useState(
`이제 막 개업한 동네 카페입니다. 
최근 매출이 줄어 신규 고객을 늘리고 싶습니다.
우리 강점은 깔끔한 인테리어와 핸드드립 커피입니다.
한 달 홍보 스케줄 추천해주세요.`
  );
  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [myEvents, setMyEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set());
  
  type TokenClient = {
    requestAccessToken: (options?: { prompt?: string }) => void;
  };
  const tokenClientRef = useRef<TokenClient | null>(null);

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

  // 3) 내 구글 캘린더 불러오기 (플랜 기반 범위 자동 조정)
  const loadMyCalendar = async () => {
    if (!window.gapi?.client?.calendar) {
      console.error("Google Calendar API not loaded");
      return;
    }

    try {
      const { timeMin, timeMax } = getPlanWindow(plan || undefined);
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

  // 4) GPT로 스케줄 생성 (/api/plan 호출)
  const generatePlan = async () => {
    if (!brief.trim()) {
      alert("브리프를 입력해주세요");
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      console.log("📝 마케팅 플랜 생성 시작...");
      const data = await createMarketingPlan(brief);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`✅ 플랜 생성 완료 (${duration}초)`);
      
      setPlan(data);
      // 기본적으로 모든 이벤트 선택
      if (data.events) {
        setSelectedEventIds(new Set(data.events.map(e => e.id)));
      }
      
      // 성공 메시지
      alert(`✅ 마케팅 플랜이 생성되었습니다!\n\n${data.summary}\n이벤트: ${data.events.length}개`);
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`❌ 플랜 생성 실패 (${duration}초):`, error);
      
      const errorMessage = error instanceof Error ? error.message : "스케줄 생성 실패";
      
      // 상세한 에러 메시지
      let alertMessage = `❌ 스케줄 생성 실패\n\n${errorMessage}`;
      
      if (errorMessage.includes("시간 초과")) {
        alertMessage += "\n\n💡 팁: 브리프를 더 간단하게 작성해보세요.";
      } else if (errorMessage.includes("API_KEY")) {
        alertMessage += "\n\n💡 관리자: Vercel Dashboard에서 환경 변수를 확인하세요.";
      } else if (errorMessage.includes("503") || errorMessage.includes("502")) {
        alertMessage += "\n\n💡 서버 일시적 오류입니다. 잠시 후 다시 시도하세요.";
      }
      
      alert(alertMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 5) 선택된 이벤트만 구글 캘린더에 등록
  const insertSelected = async () => {
    if (!isSignedIn) {
      alert("먼저 Google 로그인해주세요");
      return;
    }
    if (!plan?.events?.length) {
      alert("등록할 이벤트가 없습니다");
      return;
    }
    if (selectedEventIds.size === 0) {
      alert("등록할 이벤트를 선택해주세요");
      return;
    }
    if (!window.gapi?.client?.calendar) {
      alert("Google Calendar API가 로드되지 않았습니다");
      return;
    }

    // ✅ 액세스 토큰 확인
    const token = (window.gapi.client as any).getToken?.();
    if (!token || !token.access_token) {
      alert("인증 토큰이 없습니다. 다시 로그인해주세요.");
      signOut();
      return;
    }

    const selectedEvents = plan.events.filter(ev => selectedEventIds.has(ev.id));
    
    setIsLoading(true);
    const errors: string[] = [];
    let successCount = 0;

    try {
      for (const ev of selectedEvents) {
        try {
          // ✅ 종일 이벤트 end 보정
          let startParam, endParam;
          if (ev.all_day) {
            const { startDate, endDate } = normalizeAllDayRange(ev.start, ev.end);
            startParam = { date: startDate };
            endParam = { date: endDate };
          } else {
            startParam = { dateTime: ev.start };
            endParam = { dateTime: ev.end };
          }

          await window.gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: {
              summary: ev.title,
              description: `[${ev.category}] ${ev.description || ""}\n\n📍 채널: ${ev.channel || "N/A"}\n📦 산출물: ${ev.deliverables?.join(", ") || "N/A"}`,
              start: startParam,
              end: endParam,
              colorId: getCategoryColorId(ev.category),
              attendees: Array.isArray(ev.attendees) && ev.attendees.length > 0
                ? ev.attendees.map((email) => ({ email }))
                : undefined,
              reminders:
                Array.isArray(ev.reminders_minutes) && ev.reminders_minutes.length > 0
                  ? {
                      useDefault: false,
                      overrides: ev.reminders_minutes.map((m) => ({
                        method: "popup",
                        minutes: m,
                      })),
                    }
                  : undefined,
            },
          });
          successCount++;
        } catch (err) {
          console.error(`Failed to insert event "${ev.title}":`, err);
          errors.push(ev.title);
        }
      }

      // ✅ 결과 안내
      let message = `✅ ${successCount}개 이벤트를 Google Calendar에 등록했습니다!`;
      if (errors.length > 0) {
        message += `\n\n⚠️ 실패 (${errors.length}개):\n${errors.join("\n")}`;
      }
      alert(message);

      // ✅ 플랜 범위 기반으로 재조회
      await loadMyCalendar();
    } catch (error) {
      console.error("Failed to insert events:", error);
      alert("캘린더 등록 실패");
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리별 Google Calendar 색상 ID
  const getCategoryColorId = (category: string): string => {
    const colorMap: Record<string, string> = {
      "Setup": "9",      // 파란색
      "R&D": "10",       // 초록색
      "Content": "5",    // 노란색
      "Influencer": "3", // 보라색
      "Paid": "11",      // 빨간색
      "Community": "4",  // 분홍색
      "Ops": "8"         // 회색
    };
    return colorMap[category] || "1";
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedEventIds.size === plan?.events.length) {
      setSelectedEventIds(new Set());
    } else {
      setSelectedEventIds(new Set(plan?.events.map(e => e.id) || []));
    }
  };

  // 개별 선택/해제
  const toggleEventSelection = (eventId: string) => {
    const newSet = new Set(selectedEventIds);
    if (newSet.has(eventId)) {
      newSet.delete(eventId);
    } else {
      newSet.add(eventId);
    }
    setSelectedEventIds(newSet);
  };

  const previewEvents = useMemo<CalendarEvent[]>(
    () =>
      (plan?.events || []).map((e, i) => ({
        id: `p-${i}`,
        title: e.title,
        start: e.start,
        end: e.end,
        backgroundColor: e.color || "#2563eb",
        borderColor: e.color || "#2563eb",
      })),
    [plan]
  );

  // 개발 모드 확인
  const isDev = import.meta.env.DEV;
  const hasApiKey = !!import.meta.env.VITE_OPENAI_API_KEY;
  const hasGoogleClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      {/* 좌: 입력/버튼/미리보기 */}
      <div className="space-y-3">
        {/* 개발 모드 안내 */}
        {isDev && (
          <div className={`px-4 py-3 rounded-lg text-sm ${hasApiKey ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
            {hasApiKey ? (
              <div className="flex items-start gap-2">
                <span className="text-lg">🤖</span>
                <div>
                  <div className="font-semibold">개발 모드: 실제 AI 호출</div>
                  <div className="text-xs mt-1">OpenAI API가 직접 호출됩니다 (비용 발생)</div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <span className="text-lg">🎭</span>
                <div>
                  <div className="font-semibold">개발 모드: Mock 데이터</div>
                  <div className="text-xs mt-1">
                    테스트용 샘플 데이터가 표시됩니다. 
                    <br />실제 AI를 사용하려면 <code className="bg-yellow-100 px-1 rounded">.env</code>에 <code className="bg-yellow-100 px-1 rounded">VITE_OPENAI_API_KEY</code>를 설정하세요.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Google 로그인 상태 안내 */}
        {!hasGoogleClientId && (
          <div className="px-4 py-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <div className="font-semibold">Google 로그인 불가</div>
                <div className="text-xs mt-1">
                  <code className="bg-red-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code>가 설정되지 않았습니다.
                  <br />Google 로그인 기능을 사용하려면 환경 변수를 설정하세요.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!isSignedIn ? (
            <button 
              className="px-3 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors" 
              onClick={signIn}
              disabled={isLoading}
            >
              Google 로그인
            </button>
          ) : (
            <button 
              className="px-3 py-2 rounded border hover:bg-gray-50 transition-colors" 
              onClick={signOut}
              disabled={isLoading}
            >
              로그아웃
            </button>
          )}
          <button 
            className="px-3 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed" 
            onClick={generatePlan}
            disabled={isLoading}
          >
            {isLoading ? "생성 중..." : "스케줄 생성(GPT)"}
          </button>
          <button 
            className="px-3 py-2 rounded bg-green-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed" 
            onClick={insertSelected}
            disabled={isLoading || !plan?.events?.length || selectedEventIds.size === 0}
          >
            {isLoading ? "등록 중..." : `선택 항목 등록 (${selectedEventIds.size})`}
          </button>
        </div>

        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          className="w-full h-32 p-3 rounded border text-sm"
          placeholder="예: 이제 막 개업한 동네 카페입니다. 신규 고객을 늘리고 싶습니다."
        />

        {/* 플랜 정보 표시 */}
        {plan && (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">{plan.summary}</h3>
              <div className="text-sm text-gray-700">
                <div className="mb-2">
                  <span className="font-semibold">기간:</span> {plan.timeframe.start} ~ {plan.timeframe.end}
                </div>
                {plan.assumptions && plan.assumptions.length > 0 && (
                  <div className="mb-2">
                    <span className="font-semibold">가정사항:</span>
                    <ul className="list-disc list-inside ml-2">
                      {plan.assumptions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <span className="font-semibold">전략:</span> {plan.strategy_pillars.join(" → ")}
                </div>
              </div>
            </div>

            {/* 이벤트 리스트 (체크박스) */}
            <div className="border rounded-lg p-3 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-3 sticky top-0 bg-white pb-2 border-b">
                <div className="font-semibold">일정 목록 ({plan.events.length}개)</div>
                <button 
                  onClick={toggleSelectAll}
                  className="text-sm px-3 py-1 rounded border hover:bg-gray-50"
                >
                  {selectedEventIds.size === plan.events.length ? "전체 해제" : "전체 선택"}
                </button>
              </div>
              <div className="space-y-2">
                {plan.events.map((event) => (
                  <label 
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 cursor-pointer border"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEventIds.has(event.id)}
                      onChange={() => toggleEventSelection(event.id)}
                      className="mt-1 w-4 h-4"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                        <span className="font-semibold text-sm">{event.title}</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{event.category}</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {event.start.slice(0, 16).replace('T', ' ')} ~ {event.end.slice(11, 16)}
                      </div>
                      {event.description && (
                        <div className="text-xs text-gray-700 mb-1">{event.description}</div>
                      )}
                      {event.channel && (
                        <div className="text-xs text-gray-500">
                          📍 {event.channel}
                        </div>
                      )}
                      {event.deliverables && event.deliverables.length > 0 && (
                        <div className="text-xs text-gray-500">
                          📦 {event.deliverables.join(", ")}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 캘린더 미리보기 */}
        {plan && (
          <div className="border rounded p-3">
            <div className="font-semibold mb-2">캘린더 미리보기</div>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={previewEvents}
              height={400}
            />
          </div>
        )}
      </div>

      {/* 우: 내 구글 캘린더 */}
      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">내 Google Calendar (30일)</div>
          <button className="px-3 py-1 rounded border" onClick={loadMyCalendar}>
            새로고침
          </button>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={myEvents}
          height={680}
        />
      </div>
    </div>
  );
}
