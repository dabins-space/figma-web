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
  const [brief, setBrief] = useState(
`목표: Edge AI Controller 리드 50건/월
기간: 2025-10-13 ~ 2025-11-30
제약: 10월28일 보도자료, 11월5일 세일즈 킥오프
채널: 블로그, 뉴스룸, eDM, LinkedIn`
  );
  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [myEvents, setMyEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  type TokenClient = {
    requestAccessToken: (options?: { prompt?: string }) => void;
  };
  const tokenClientRef = useRef<TokenClient | null>(null);

  // 1) GIS & gapi 로드
  useEffect(() => {
    const gisScript = document.createElement("script");
    gisScript.src = "https://accounts.google.com/gsi/client";
    gisScript.async = true;
    gisScript.onload = () => {
      const gapiScript = document.createElement("script");
      gapiScript.src = "https://apis.google.com/js/api.js";
      gapiScript.async = true;
      gapiScript.onload = () => {
        if (window.gapi) {
          window.gapi.load("client", async () => {
            if (window.gapi) {
              await window.gapi.client.init({ discoveryDocs: DISCOVERY_DOCS });
            }
          });
        }
      };
      document.body.appendChild(gapiScript);
    };
    document.body.appendChild(gisScript);
  }, []);

  // 2) Token Client 준비
  const ensureTokenClient = () => {
    if (!tokenClientRef.current && window.google?.accounts?.oauth2) {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
        scope: SCOPES,
        callback: (resp) => {
          if (resp?.access_token) {
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
    ensureTokenClient();
    tokenClientRef.current?.requestAccessToken({ prompt: "consent" });
  };

  const signOut = () => {
    setIsSignedIn(false);
    setMyEvents([]);
  };

  // 3) 내 구글 캘린더(30일) 불러오기
  const loadMyCalendar = async () => {
    if (!window.gapi?.client?.calendar) {
      console.error("Google Calendar API not loaded");
      return;
    }

    try {
      const now = new Date();
      const max = new Date(Date.now() + 30 * 86400000);
      const res = await window.gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: now.toISOString(),
        timeMax: max.toISOString(),
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
    try {
      const data = await createMarketingPlan(brief);
      setPlan(data);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert(error instanceof Error ? error.message : "스케줄 생성 실패");
    } finally {
      setIsLoading(false);
    }
  };

  // 5) 생성된 이벤트를 내 구글 캘린더에 등록
  const insertAll = async () => {
    if (!isSignedIn) {
      alert("먼저 Google 로그인해주세요");
      return;
    }
    if (!plan?.events?.length) {
      alert("등록할 이벤트가 없습니다");
      return;
    }
    if (!window.gapi?.client?.calendar) {
      alert("Google Calendar API가 로드되지 않았습니다");
      return;
    }

    setIsLoading(true);
    try {
      for (const ev of plan.events) {
        await window.gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: {
            summary: ev.title,
            description: ev.description || "",
            start: ev.all_day
              ? { date: ev.start.slice(0, 10) }
              : { dateTime: ev.start },
            end: ev.all_day
              ? { date: ev.end.slice(0, 10) }
              : { dateTime: ev.end },
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
      }
      alert("Google Calendar에 등록 완료!");
      await loadMyCalendar();
    } catch (error) {
      console.error("Failed to insert events:", error);
      alert("캘린더 등록 실패");
    } finally {
      setIsLoading(false);
    }
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

        <div className="flex gap-2">
          {!isSignedIn ? (
            <button className="px-3 py-2 rounded bg-black text-white" onClick={signIn}>
              Google 로그인
            </button>
          ) : (
            <button className="px-3 py-2 rounded border" onClick={signOut}>
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
            onClick={insertAll}
            disabled={isLoading || !plan?.events?.length}
          >
            {isLoading ? "등록 중..." : "캘린더에 등록"}
          </button>
        </div>

        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          className="w-full h-44 p-3 rounded border"
          placeholder="목표/기간/채널/제약을 적어주세요"
        />

        <div className="border rounded p-3">
          <div className="font-semibold mb-2">미리보기</div>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={previewEvents}
            height={460}
          />
        </div>
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
