/**
 * Plan API Client
 * Vercel 서버리스 함수 /api/plan.ts를 호출하는 클라이언트 함수
 */

export interface PlanEvent {
  id: string;
  title: string;
  description?: string;
  start: string;  // ISO8601
  end: string;    // ISO8601
  all_day?: boolean;
  color?: string;
  category: "Setup" | "R&D" | "Content" | "Influencer" | "Paid" | "Community" | "Ops";
  channel?: string;
  deliverables?: string[];
  attendees?: string[];
  reminders_minutes?: number[];
  depends_on?: string[];
}

export interface MarketingPlan {
  timeframe: { start: string; end: string; timezone: string };
  summary: string;
  assumptions: string[];
  strategy_pillars: string[];
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
    const { createMarketingPlanDev, getMockMarketingPlan } = await import('./plan-dev');
    
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
  console.log('🚀 프로덕션 모드: Vercel 서버리스 함수 호출 (/api/plan)');
  
  // 프로덕션에서도 API 키가 없으면 Mock 데이터 사용
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    console.warn('⚠️ 프로덕션에서 VITE_OPENAI_API_KEY가 없음 - Mock 데이터 사용');
    const { getMockMarketingPlan } = await import('./plan-dev');
    return getMockMarketingPlan(brief);
  }
  
  try {
    // 클라이언트 타임아웃 (60초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch('/api/plan', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brief }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      
      console.error('❌ API Error:', {
        status: response.status,
        error: error.error,
        details: error.details,
        hint: error.hint
      });
      
      throw new Error(error.error || `API 호출 실패 (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ 플랜 생성 완료:', data.summary, `(${data.events?.length}개 이벤트)`);
    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('⏱️ 요청 시간 초과 (60초)');
      throw new Error('요청 시간이 초과되었습니다. 브리프를 더 간단하게 작성해주세요.');
    }
    
    console.error('❌ 마케팅 플랜 생성 실패:', error.message);
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
