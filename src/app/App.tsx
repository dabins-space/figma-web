import { useState, useEffect } from "react";
import { LoginPage } from "@/features/auth";
import OAuthCallback from "@/features/auth/OAuthCallback";
import { Header, Sidebar, FloatingActionButton } from "./layout";
import { Dashboard } from "@/features/dashboard";
import { MarketingHealthRouter } from "@/features/marketing-health";
import { AICoach } from "@/features/ai-coach/AICoach";
import { NewsPage } from "@/features/news/NewsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { EnvWarningBanner } from "@/components/EnvWarningBanner";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageType } from "@/types";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");

  // URL 기반 라우팅 처리
  useEffect(() => {
    const path = window.location.pathname;
    
    // OAuth 콜백 처리
    if (path === "/oauth/callback") {
      // OAuthCallback 컴포넌트에서 처리하도록 플래그 설정
      return;
    }
  }, []);

  // OAuth 콜백 페이지 처리
  if (window.location.pathname === "/oauth/callback") {
    return <OAuthCallback />;
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleNavigation = (page: PageType) => {
    setCurrentPage(page);
    setSidebarOpen(false); // Close mobile sidebar on navigation
  };

  // AI Coach page has its own full-screen layout
  if (currentPage === "ai-coach") {
    return <AICoach onNavigate={handleNavigation} />;
  }

  const renderMainContent = () => {
    switch (currentPage) {
      case "health-index":
      case "sales-management":
      case "reservations":
      case "marketing":
      case "schedule":
        return <MarketingHealthRouter page={currentPage} onNavigate={handleNavigation} />;
      case "news":
        return <NewsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Header />
      
      {/* 환경 변수 경고 배너 */}
      <div className="lg:ml-64">
        <EnvWarningBanner />
      </div>
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar currentPage={currentPage} onNavigate={handleNavigation} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)}
            />
            <Sidebar currentPage={currentPage} onNavigate={handleNavigation} className="relative z-50" />
          </div>
        )}

        {/* Mobile Menu Button */}
        <Button
          variant="ghost" 
          size="icon"
          className="lg:hidden fixed top-20 left-4 z-40 bg-white shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {renderMainContent()}
        </div>
      </div>

      <FloatingActionButton />
    </div>
  );
}