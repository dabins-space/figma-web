/**
 * 개발 환경용 Plan API
 * 로컬에서 직접 OpenAI API를 호출합니다.
 */

import type { MarketingPlan } from './plan.js';

const SYSTEM_PROMPT = `
너는 '소상공인 요식업(카페)' 전문 마케팅 PM이다.
입력은 자유로운 한국어 한 문단일 수 있다. 누락된 정보는 상식적으로 가정하되, 가정 사항을 "assumptions"에 적어라.

반드시 다음 7단계 흐름을 한 달 타임라인에 녹여라:
1. 기본 셋업(Setup): 네이버플레이스/카카오채널/구글지도/리뷰요청 세팅
2. 메뉴 R&D: 시그니처 메뉴 개발/시식/개선
3. 콘텐츠(Content): 촬영/에디팅/게시 캘린더(주 2-3회)
4. 인플루언서/UGC(Influencer): 모집/방문/콘텐츠 게시/리포스팅
5. 유료광고(Paid): 네이버 키워드/로컬광고/리타겟팅
6. 커뮤니티(Community): 오픈채팅/쿠폰/스탬프 이벤트
7. 운영(Ops): 재고관리/현장POP/리뷰답글

일정은 ISO8601(Asia/Seoul), 평일 저녁/주말 피크를 고려해 배치.
이벤트마다 category, color, deliverables, reminders_minutes(1440, 120, 30) 포함.
일정 ID는 "ev-YYYYMMDD-<slug>-<idx>" 형태.

출력 JSON 스키마:
{
  "timeframe": { "start": "2025-MM-DD", "end": "2025-MM-DD", "timezone": "Asia/Seoul" },
  "summary": "한 줄 요약",
  "assumptions": ["가정1", "가정2"],
  "strategy_pillars": ["Setup", "R&D", "Content", "Influencer", "Paid", "Community", "Ops"],
  "events": [{
    "id": "ev-20250101-setup-1",
    "title": "작업명",
    "description": "상세설명",
    "start": "2025-01-01T10:00:00+09:00",
    "end": "2025-01-01T12:00:00+09:00",
    "all_day": false,
    "color": "#3B82F6",
    "category": "Setup",
    "channel": "Naver Place",
    "deliverables": ["체크리스트"],
    "attendees": [],
    "reminders_minutes": [1440, 120],
    "depends_on": []
  }]
}
`;

/**
 * 개발 환경용 - 직접 OpenAI API 호출
 */
export const createMarketingPlanDev = async (brief: string): Promise<MarketingPlan> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("VITE_OPENAI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `브리프:\n${brief}` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API 에러 (${response.status}): ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? "";

    if (!text) {
      throw new Error("OpenAI로부터 빈 응답을 받았습니다.");
    }

    const plan = JSON.parse(text);
    return plan;
  } catch (error) {
    console.error("OpenAI API 호출 실패:", error);
    throw error;
  }
};

/**
 * Mock 데이터 (API 키가 없을 때 사용)
 */
export const getMockMarketingPlan = (brief: string): MarketingPlan => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() + 1);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);

  const formatISO = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const createEvent = (dayOffset: number, startHour: number, endHour: number, data: any) => {
    const eventDate = addDays(startDate, dayOffset);
    const dateStr = formatISO(eventDate);
    const start = `${dateStr}T${String(startHour).padStart(2, '0')}:00:00+09:00`;
    const end = `${dateStr}T${String(endHour).padStart(2, '0')}:00:00+09:00`;
    return { ...data, start, end };
  };

  return {
    timeframe: {
      start: formatISO(startDate),
      end: formatISO(endDate),
      timezone: "Asia/Seoul"
    },
    summary: "동네 카페 신규 고객 유치 1개월 마케팅 플랜",
    assumptions: [
      "네이버플레이스 미등록 상태",
      "SNS 계정은 있으나 활성화 안됨",
      "시그니처 메뉴 부재"
    ],
    strategy_pillars: ["Setup", "R&D", "Content", "Influencer", "Paid", "Community", "Ops"],
    events: [
      createEvent(0, 10, 12, {
        id: "ev-" + formatISO(addDays(startDate, 0)).replace(/-/g, '') + "-setup-1",
        title: "네이버플레이스 등록 및 최적화",
        description: "네이버플레이스 신규 등록, 사진 업로드, 메뉴/영업시간 입력",
        all_day: false,
        color: "#3B82F6",
        category: "Setup" as const,
        channel: "Naver Place",
        deliverables: ["플레이스 등록 완료", "메뉴판 사진 10장", "영업정보 입력"],
        reminders_minutes: [1440, 120],
        depends_on: []
      }),
      createEvent(1, 14, 16, {
        id: "ev-" + formatISO(addDays(startDate, 1)).replace(/-/g, '') + "-setup-2",
        title: "카카오채널 & 지도 등록",
        description: "카카오톡 채널 개설, 카카오맵/구글맵 등록",
        all_day: false,
        color: "#3B82F6",
        category: "Setup" as const,
        channel: "Kakao/Google Maps",
        deliverables: ["카카오채널 오픈", "지도 등록 완료"],
        reminders_minutes: [1440],
        depends_on: ["ev-" + formatISO(addDays(startDate, 0)).replace(/-/g, '') + "-setup-1"]
      }),
      createEvent(3, 10, 18, {
        id: "ev-" + formatISO(addDays(startDate, 3)).replace(/-/g, '') + "-rnd-1",
        title: "시그니처 메뉴 개발 & 시식",
        description: "핸드드립 스페셜티 메뉴 개발 및 내부 시식 평가",
        all_day: true,
        color: "#10B981",
        category: "R&D" as const,
        channel: "오프라인",
        deliverables: ["신메뉴 레시피", "원가 계산서", "시식 피드백"],
        reminders_minutes: [2880, 1440],
        depends_on: []
      }),
      createEvent(7, 14, 17, {
        id: "ev-" + formatISO(addDays(startDate, 7)).replace(/-/g, '') + "-content-1",
        title: "메뉴 사진 촬영 & 편집",
        description: "신메뉴 포함 대표 메뉴 전문 촬영",
        all_day: false,
        color: "#F59E0B",
        category: "Content" as const,
        channel: "Instagram/Blog",
        deliverables: ["제품 사진 30장", "편집본 10장"],
        reminders_minutes: [1440, 120],
        depends_on: ["ev-" + formatISO(addDays(startDate, 3)).replace(/-/g, '') + "-rnd-1"]
      }),
      createEvent(9, 19, 20, {
        id: "ev-" + formatISO(addDays(startDate, 9)).replace(/-/g, '') + "-content-2",
        title: "인스타그램 첫 게시",
        description: "신메뉴 소개 릴스 & 피드 게시",
        all_day: false,
        color: "#F59E0B",
        category: "Content" as const,
        channel: "Instagram",
        deliverables: ["릴스 1개", "피드 2개"],
        reminders_minutes: [120, 30],
        depends_on: ["ev-" + formatISO(addDays(startDate, 7)).replace(/-/g, '') + "-content-1"]
      }),
      createEvent(10, 10, 12, {
        id: "ev-" + formatISO(addDays(startDate, 10)).replace(/-/g, '') + "-influencer-1",
        title: "마이크로 인플루언서 모집",
        description: "지역 인플루언서 3-5명 섭외 메시지 발송",
        all_day: false,
        color: "#8B5CF6",
        category: "Influencer" as const,
        channel: "DM",
        deliverables: ["인플루언서 리스트", "협찬 제안서"],
        reminders_minutes: [1440],
        depends_on: []
      }),
      createEvent(14, 15, 17, {
        id: "ev-" + formatISO(addDays(startDate, 14)).replace(/-/g, '') + "-influencer-2",
        title: "인플루언서 방문 & 콘텐츠 제작",
        description: "선정된 인플루언서 매장 방문 및 체험",
        all_day: false,
        color: "#8B5CF6",
        category: "Influencer" as const,
        channel: "Instagram/Blog",
        deliverables: ["인플루언서 포스팅 3-5개"],
        reminders_minutes: [2880, 1440, 120],
        depends_on: ["ev-" + formatISO(addDays(startDate, 10)).replace(/-/g, '') + "-influencer-1"]
      }),
      createEvent(15, 10, 11, {
        id: "ev-" + formatISO(addDays(startDate, 15)).replace(/-/g, '') + "-paid-1",
        title: "네이버 키워드 광고 세팅",
        description: "지역 키워드 광고 캠페인 설정 및 시작",
        all_day: false,
        color: "#EF4444",
        category: "Paid" as const,
        channel: "Naver Ads",
        deliverables: ["광고 캠페인 3개", "예산 배분표"],
        reminders_minutes: [1440, 120],
        depends_on: ["ev-" + formatISO(addDays(startDate, 0)).replace(/-/g, '') + "-setup-1"]
      }),
      createEvent(17, 10, 12, {
        id: "ev-" + formatISO(addDays(startDate, 17)).replace(/-/g, '') + "-community-1",
        title: "오픈채팅방 개설 & 웰컴 쿠폰",
        description: "단골 커뮤니티 오픈채팅방 개설, 첫 방문 할인 쿠폰",
        all_day: false,
        color: "#EC4899",
        category: "Community" as const,
        channel: "KakaoTalk",
        deliverables: ["오픈채팅방 링크", "쿠폰 이미지", "공지사항"],
        reminders_minutes: [1440],
        depends_on: []
      }),
      createEvent(20, 11, 12, {
        id: "ev-" + formatISO(addDays(startDate, 20)).replace(/-/g, '') + "-ops-1",
        title: "주간 리뷰 답글 & 피드백 정리",
        description: "네이버플레이스/구글 리뷰 답글 작성 및 개선사항 정리",
        all_day: false,
        color: "#6366F1",
        category: "Ops" as const,
        channel: "Naver Place/Google",
        deliverables: ["리뷰 답글 완료", "피드백 리포트"],
        reminders_minutes: [1440],
        depends_on: []
      }),
      createEvent(25, 14, 16, {
        id: "ev-" + formatISO(addDays(startDate, 25)).replace(/-/g, '') + "-ops-2",
        title: "월말 성과 분석 & 다음 달 계획",
        description: "1개월 마케팅 성과 분석 및 개선 방향 수립",
        all_day: false,
        color: "#6366F1",
        category: "Ops" as const,
        channel: "내부",
        deliverables: ["성과 리포트", "다음 달 계획안"],
        reminders_minutes: [2880, 1440],
        depends_on: []
      })
    ]
  };
};
