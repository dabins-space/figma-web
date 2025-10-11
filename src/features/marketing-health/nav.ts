import { 
  BarChart3, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  CalendarClock 
} from "lucide-react";

export const marketingHealthNav = {
  icon: BarChart3,
  label: "마케팅 건강지수",
  key: "health-index" as const,
  children: [
    { 
      icon: DollarSign, 
      label: "매출 / 고객 현황 관리", 
      key: "sales-management" as const,
      href: "/marketing-health/sales"
    },
    { 
      icon: Calendar, 
      label: "예약 관리", 
      key: "reservations" as const,
      href: "/marketing-health/reservation"
    },
    { 
      icon: TrendingUp, 
      label: "캠페인 관리", 
      key: "marketing" as const,
      href: "/marketing-health/campaign"
    },
    { 
      icon: CalendarClock, 
      label: "마케팅 스케줄 관리", 
      key: "schedule" as const,
      href: "/marketing-health/schedule"
    }
  ]
};

