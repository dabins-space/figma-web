// API 모듈 통합 내보내기
export { 
  createMarketingPlan,
  type PlanEvent,
  type MarketingPlan,
  type CreatePlanRequest
} from './plan.js';

// 개발 환경 전용
export { createMarketingPlanDev, getMockMarketingPlan } from './plan-dev.js';

// 사용 예시:
// import { createMarketingPlan } from '@/api';
// const plan = await createMarketingPlan('신메뉴 출시, SNS 홍보');
