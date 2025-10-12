/**
 * 개발 환경용 Plan API
 * 로컬에서 직접 OpenAI API를 호출합니다.
 */

import type { MarketingPlan } from './plan';

const SYSTEM_PROMPT = `
너는 소상공인(요식업)을 위한 마케팅 매니저다.
사용자의 목표/기간/제약/채널을 바탕으로 '기획→제작→발행→리뷰' 단계의 홍보 스케줄을 만든다.
아래 JSON 스키마로만 출력해. 모든 날짜는 +09:00 ISO8601 형식.
{
  "plan_title": "string",
  "events": [
    {
      "title": "string",
      "description": "string",
      "start": "YYYY-MM-DDTHH:MM:SS+09:00",
      "end": "YYYY-MM-DDTHH:MM:SS+09:00",
      "all_day": boolean,
      "color": "string",
      "attendees": ["email"],
      "reminders_minutes": [number],
      "labels": ["string"]
    }
  ]
}
규칙: 이벤트 5~10개, 제작은 발행 2~4일 전, 겹침 최소화, 출력은 JSON만.
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
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return {
    plan_title: "테스트 마케팅 플랜",
    events: [
      {
        title: "마케팅 전략 기획",
        description: "전체 마케팅 방향 설정 및 목표 수립",
        start: tomorrow.toISOString().slice(0, 19) + "+09:00",
        end: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 19) + "+09:00",
        all_day: false,
        color: "#3B82F6",
        attendees: [],
        reminders_minutes: [1440, 60],
        labels: ["기획"]
      },
      {
        title: "콘텐츠 제작",
        description: "SNS 게시물 및 이미지 제작",
        start: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19) + "+09:00",
        end: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString().slice(0, 19) + "+09:00",
        all_day: false,
        color: "#10B981",
        attendees: [],
        reminders_minutes: [60],
        labels: ["제작"]
      },
      {
        title: "SNS 게시물 발행",
        description: "인스타그램 및 블로그 포스팅",
        start: new Date(tomorrow.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19) + "+09:00",
        end: new Date(tomorrow.getTime() + 4 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString().slice(0, 19) + "+09:00",
        all_day: false,
        color: "#F59E0B",
        attendees: [],
        reminders_minutes: [30],
        labels: ["발행"]
      },
      {
        title: "성과 분석 및 리뷰",
        description: "1주차 마케팅 성과 분석",
        start: nextWeek.toISOString().slice(0, 19) + "+09:00",
        end: new Date(nextWeek.getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 19) + "+09:00",
        all_day: false,
        color: "#8B5CF6",
        attendees: [],
        reminders_minutes: [1440],
        labels: ["리뷰"]
      }
    ]
  };
};

