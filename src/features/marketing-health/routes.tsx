import type { PageType } from "@/types";
import { lazy, Suspense } from "react";

// Lazy load pages for better performance
const IndexPage = lazy(() => import("./pages/index"));
const SalesPage = lazy(() => import("./pages/sales"));
const ReservationPage = lazy(() => import("./pages/reservation"));
const CampaignPage = lazy(() => import("./pages/campaign"));
const SchedulePage = lazy(() => import("./pages/schedule"));

interface MarketingHealthRouterProps {
  page: PageType;
  onNavigate?: (page: PageType) => void;
}

export function MarketingHealthRouter({ page, onNavigate }: MarketingHealthRouterProps) {
  const renderPage = () => {
    switch (page) {
      case "health-index":
        return <IndexPage onNavigateToSales={() => onNavigate?.("sales-management")} />;
      case "sales-management":
        return <SalesPage />;
      case "reservations":
        return <ReservationPage />;
      case "marketing":
        return <CampaignPage />;
      case "schedule":
        return <SchedulePage />;
      default:
        return null;
    }
  };

  return (
    <Suspense fallback={
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    }>
      {renderPage()}
    </Suspense>
  );
}

