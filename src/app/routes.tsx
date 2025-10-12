import type { PageType } from "@/types";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { MarketingHealthRouter } from "@/features/marketing-health";
import { AICoach } from "@/features/ai-coach/AICoach";
import { NewsPage } from "@/features/news/NewsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
/**
 * Page routing configuration
 */
export const pageComponents = {
  dashboard: Dashboard,
  "health-index": MarketingHealthRouter,
  "sales-management": MarketingHealthRouter,
  marketing: MarketingHealthRouter,
  reservations: MarketingHealthRouter,
  schedule: MarketingHealthRouter,
  "ai-coach": AICoach,
  news: NewsPage,
  settings: SettingsPage,
} as const;

export function getPageComponent(page: PageType) {
  return pageComponents[page];
}

