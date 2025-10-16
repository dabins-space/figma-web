// 마케팅 액션 플랜 타입 정의
export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  start?: string;   // ISO 8601 (예: 2025-10-17T10:00:00+09:00)
  end?: string;
  all_day?: boolean;
  priority?: "P0" | "P1" | "P2";
  channel?: string; // 예: SNS, EDM, Blog 등
  reminders?: { minutes_before: number }[];
  notes?: string;
}

export interface ActionPlan {
  plan_title: string;
  strategy_summary?: string;
  items: ActionItem[];
}

export interface CalendarRegistrationResult {
  success: number;
  failed: number;
  skipped: number;
  details: {
    success_items: string[];
    failed_items: { title: string; error: string }[];
    skipped_items: string[];
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface ActionPlanGenerationRequest {
  messages: ChatMessage[];
  user_context?: {
    business_type?: string;
    target_audience?: string;
    current_challenges?: string;
    conversation_context?: {
      total_messages: number;
      previous_topics: string;
      current_focus: string;
    };
  };
}

