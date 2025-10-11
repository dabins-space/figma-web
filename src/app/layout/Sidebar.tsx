import { useState } from "react";
import { 
  Home, 
  Bot, 
  Lightbulb, 
  Settings,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { marketingHealthNav } from "@/features/marketing-health/nav";

type PageType = "dashboard" | "health-index" | "sales-management" | "marketing" | "reservations" | "ai-coach" | "news" | "settings" | "schedule";

interface SidebarProps {
  className?: string;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

interface MenuItem {
  icon: any;
  label: string;
  key: PageType;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { icon: Home, label: "대시보드", key: "dashboard" },
  marketingHealthNav,
  { icon: Bot, label: "AI 잘코치", key: "ai-coach" },
  { icon: Lightbulb, label: "알뜰소식", key: "news" },
  { icon: Settings, label: "설정", key: "settings" },
];

export function Sidebar({ className, currentPage, onNavigate }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["health-index"]);

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const renderMenuItem = (item: MenuItem, index: number, isChild: boolean = false) => {
    const isActive = currentPage === item.key;
    const isExpanded = expandedItems.includes(item.key);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li key={index}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.key);
            }
            onNavigate(item.key);
          }}
          className={cn(
            "w-full flex items-center justify-between px-3 py-3 rounded-2xl text-left transition-all duration-200 group hover:bg-[#F5F6F8]",
            isChild && "ml-4 py-2",
            isActive 
              ? "bg-[#FF7A00] text-white" 
              : "text-gray-700 hover:text-gray-900"
          )}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={cn(
              "w-5 h-5",
              isChild && "w-4 h-4",
              isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
            )} />
            <span className={cn("font-medium", isChild && "text-sm")}>{item.label}</span>
          </div>
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className={cn(
                "w-4 h-4",
                isActive ? "text-white" : "text-gray-400"
              )} />
            ) : (
              <ChevronRight className={cn(
                "w-4 h-4",
                isActive ? "text-white" : "text-gray-400"
              )} />
            )
          ) : (
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform group-hover:translate-x-1",
              isActive ? "text-white" : "text-gray-400"
            )} />
          )}
        </button>
        
        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <ul className="mt-1 space-y-1">
            {item.children!.map((child, childIndex) => 
              renderMenuItem(child, childIndex, true)
            )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className={cn("w-64 bg-white border-r border-gray-200 h-screen sticky top-16 overflow-y-auto", className)}>
      <nav className="p-6">
        <ul className="space-y-2">
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </ul>
      </nav>
    </aside>
  );
}