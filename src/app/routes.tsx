import type { PageType } from "@/types";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { StoreHealthIndex } from "@/features/store-health/StoreHealthIndex";
import { MarketingManagement } from "@/features/marketing/MarketingManagement";
import { ReservationManagement } from "@/features/reservations/ReservationManagement";
import { AICoach } from "@/features/ai-coach/AICoach";
import { NewsPage } from "@/features/news/NewsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";

/**
 * Page routing configuration
 */
export const pageComponents = {
  dashboard: Dashboard,
  "health-index": StoreHealthIndex,
  "sales-management": null, // Placeholder
  marketing: MarketingManagement,
  reservations: ReservationManagement,
  "ai-coach": AICoach,
  news: NewsPage,
  settings: SettingsPage,
} as const;

export function getPageComponent(page: PageType) {
  return pageComponents[page];
}

