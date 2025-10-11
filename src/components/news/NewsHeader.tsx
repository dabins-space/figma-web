import { useState } from "react";
import { Button } from "../ui/button";
import { Filter, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface NewsHeaderProps {
  filters: {
    industry: string;
    region: string;
    period: string;
  };
  onFilterChange: (type: string, value: string) => void;
}

const industries = [
  { value: "all", label: "전체 업종" },
  { value: "restaurant", label: "음식점" },
  { value: "retail", label: "소매업" },
  { value: "service", label: "서비스업" },
  { value: "beauty", label: "미용업" }
];

const regions = [
  { value: "all", label: "전체 지역" },
  { value: "seoul", label: "서울" },
  { value: "busan", label: "부산" },
  { value: "daegu", label: "대구" },
  { value: "incheon", label: "인천" },
  { value: "gwangju", label: "광주" },
  { value: "daejeon", label: "대전" },
  { value: "ulsan", label: "울산" },
  { value: "gyeonggi", label: "경기" },
  { value: "gangwon", label: "강원" },
  { value: "chungbuk", label: "충북" },
  { value: "chungnam", label: "충남" },
  { value: "jeonbuk", label: "전북" },
  { value: "jeonnam", label: "전남" },
  { value: "gyeongbuk", label: "경북" },
  { value: "gyeongnam", label: "경남" },
  { value: "jeju", label: "제주" }
];

const periods = [
  { value: "all", label: "전체 기간" },
  { value: "this_week", label: "이번 주" },
  { value: "this_month", label: "이번 달" },
  { value: "next_month", label: "다음 달 마감" }
];

export function NewsHeader({ filters, onFilterChange }: NewsHeaderProps) {
  const getFilterLabel = (type: string, value: string) => {
    const options = type === "industry" ? industries : type === "region" ? regions : periods;
    return options.find(option => option.value === value)?.label || "전체";
  };

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">💡 알뜰 소식</h1>
          <p className="text-gray-600">정부지원금·이벤트·정책 소식을 한눈에</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          
          {/* Industry Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2 min-w-[100px]">
                <span className="text-sm">{getFilterLabel("industry", filters.industry)}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {industries.map((industry) => (
                <DropdownMenuItem
                  key={industry.value}
                  onClick={() => onFilterChange("industry", industry.value)}
                  className={filters.industry === industry.value ? "bg-[#FF7A00]/10 text-[#FF7A00]" : ""}
                >
                  {industry.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Region Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2 min-w-[100px]">
                <span className="text-sm">{getFilterLabel("region", filters.region)}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
              {regions.map((region) => (
                <DropdownMenuItem
                  key={region.value}
                  onClick={() => onFilterChange("region", region.value)}
                  className={filters.region === region.value ? "bg-[#FF7A00]/10 text-[#FF7A00]" : ""}
                >
                  {region.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Period Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2 min-w-[100px]">
                <span className="text-sm">{getFilterLabel("period", filters.period)}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {periods.map((period) => (
                <DropdownMenuItem
                  key={period.value}
                  onClick={() => onFilterChange("period", period.value)}
                  className={filters.period === period.value ? "bg-[#FF7A00]/10 text-[#FF7A00]" : ""}
                >
                  {period.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}