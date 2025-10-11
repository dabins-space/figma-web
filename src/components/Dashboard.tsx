import { HealthIndexWidget } from "./widgets/HealthIndexWidget";
import { AICoachWidget } from "./widgets/AICoachWidget";
import { MarketingScheduleWidget } from "./widgets/MarketingScheduleWidget";
import { AICoachBanner } from "./marketing/AICoachBanner";

export function Dashboard() {
  return (
    <main className="p-6 bg-[#F5F6F8] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">대시보드</h1>
        <p className="text-gray-600">오늘도 화이팅! 매장 운영 현황을 한눈에 확인하세요.</p>
      </div>

      <div className="space-y-4">
        {/* Top Row - AI Coach (Full Width) */}
        <AICoachWidget />

        {/* Bottom Row - Health Index & Marketing Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
          <HealthIndexWidget />
          <div className="lg:col-span-3">
            <MarketingScheduleWidget />
          </div>
        </div>
      </div>

      {/* AI Coach Floating Banner */}
      <AICoachBanner />
    </main>
  );
}