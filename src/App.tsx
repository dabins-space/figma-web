import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { StoreHealthIndex } from "./components/StoreHealthIndex";
import { MarketingManagement } from "./components/MarketingManagement";
import { ReservationManagement } from "./components/ReservationManagement";
import { AICoach } from "./components/AICoach";
import { NewsPage } from "./components/NewsPage";
import { SettingsPage } from "./components/SettingsPage";
import { FloatingActionButton } from "./components/FloatingActionButton";
import { Menu } from "lucide-react";
import { Button } from "./components/ui/button";

type PageType = "dashboard" | "health-index" | "sales-management" | "marketing" | "reservations" | "ai-coach" | "news" | "settings";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");

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
        return <StoreHealthIndex onNavigateToSales={() => handleNavigation("sales-management")} />;
      case "marketing":
        return <MarketingManagement />;
      case "reservations":
        return <ReservationManagement />;
      case "news":
        return <NewsPage />;
      case "settings":
        return <SettingsPage />;
      case "sales-management":
        return (
          <div className="p-6 bg-white min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">매출 / 고객 현황 관리</h1>
            <p className="text-gray-600">매출관리 페이지가 준비 중입니다.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Header />
      
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