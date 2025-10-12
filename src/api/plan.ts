/**
 * Plan API Client
 * Vercel 서버리스 함수 /api/plan.ts를 호출하는 클라이언트 함수
 */

export interface PlanEvent {
  title: string;
  description: string;
  start: string; // ISO8601 format
  end: string; // ISO8601 format
  all_day: boolean;
  color: string;
  attendees: string[];
  reminders_minutes: number[];
  labels: string[];
}

export interface MarketingPlan {
  plan_title: string;
  events: PlanEvent[];
}

export interface CreatePlanRequest {
  brief: string; // 마케팅 브리프 (목표, 기간, 제약사항, 채널 등)
}

/**
 * AI 마케팅 플랜 생성
 * @param brief - 마케팅 브리프 (예: "신메뉴 출시, 2주간, SNS 위주")
 * @returns AI가 생성한 마케팅 스케줄
 */
export const createMarketingPlan = async (brief: string): Promise<MarketingPlan> => {
  // 개발 환경에서는 직접 OpenAI API 호출
  if (import.meta.env.DEV) {
    const { createMarketingPlanDev, getMockMarketingPlan } = await import('./plan-dev.js');
    
    // VITE_OPENAI_API_KEY가 있으면 실제 API 호출, 없으면 Mock 데이터
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      console.log('🤖 개발 모드: OpenAI API 직접 호출');
      return await createMarketingPlanDev(brief);
    } else {
      console.log('🎭 개발 모드: Mock 데이터 사용 (VITE_OPENAI_API_KEY를 설정하면 실제 API 호출)');
      return getMockMarketingPlan(brief);
    }
  }

  // 프로덕션 환경에서는 Vercel 서버리스 함수 사용
  try {
    const response = await fetch('/api/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brief }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `Failed to create plan: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating marketing plan:', error);
    throw error;
  }
};

/**
 * 마케팅 플랜 생성 예시
 * 
 * @example
 * ```typescript
 * const plan = await createMarketingPlan(`
 *   목표: 신메뉴 홍보 및 매출 20% 증가
 *   기간: 2주 (2025-03-01 ~ 2025-03-15)
 *   제약: 예산 50만원, 직원 2명
 *   채널: 인스타그램, 네이버 블로그, 카카오톡 채널
 * `);
 * 
 * console.log(plan.plan_title);
 * plan.events.forEach(event => {
 *   console.log(event.title, event.start, event.end);
 * });
 * ```
 */
