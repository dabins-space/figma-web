import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface NewsTabMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabCounts: Record<string, number>;
}

const tabs = [
  { value: "all", label: "전체" },
  { value: "government", label: "정부지원금" },
  { value: "promotion", label: "카드사 프로모션" },
  { value: "local", label: "지역 이벤트" }
];

export function NewsTabMenu({ activeTab, onTabChange, tabCounts }: NewsTabMenuProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "default" : "outline"}
            onClick={() => onTabChange(tab.value)}
            className={`flex items-center space-x-2 whitespace-nowrap ${
              activeTab === tab.value
                ? "bg-[#FF7A00] hover:bg-[#E86E00] text-white"
                : "hover:border-[#FF7A00] hover:text-[#FF7A00]"
            }`}
          >
            <span>{tab.label}</span>
            <Badge 
              className={`${
                activeTab === tab.value
                  ? "bg-white/20 text-white border-white/20"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {tabCounts[tab.value] || 0}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
}