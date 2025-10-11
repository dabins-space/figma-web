import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Settings, Save } from "lucide-react";

interface CustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enabledSections: string[];
  onSectionsChange: (sections: string[]) => void;
}

const availableSections = [
  { id: "review", label: "리뷰관리", default: true },
  { id: "loyalty", label: "단골관리", default: true },
  { id: "event", label: "이벤트관리", default: true },
  { id: "blog", label: "블로그관리", default: false },
  { id: "social", label: "SNS관리", default: false },
  { id: "ad", label: "광고관리", default: false }
];

export function CustomizationModal({
  open,
  onOpenChange,
  enabledSections,
  onSectionsChange
}: CustomizationModalProps) {
  const [tempEnabledSections, setTempEnabledSections] = useState<string[]>(enabledSections);

  useEffect(() => {
    setTempEnabledSections(enabledSections);
  }, [enabledSections]);

  const handleCheckboxChange = (sectionId: string, checked: boolean) => {
    if (checked) {
      setTempEnabledSections(prev => [...prev, sectionId]);
    } else {
      setTempEnabledSections(prev => prev.filter(id => id !== sectionId));
    }
  };

  const handleSave = () => {
    onSectionsChange(tempEnabledSections);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTempEnabledSections(enabledSections);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-[#FF7A00]/10 rounded-lg">
              <Settings className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <span>마케팅 관리 탭 구성 변경</span>
          </DialogTitle>
          <DialogDescription>
            표시할 마케팅 관리 섹션을 선택하고 구성을 변경할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            표시할 마케팅 관리 섹션을 선택하세요. 사용하지 않는 기능은 숨길 수 있습니다.
          </p>
          
          <div className="space-y-3">
            {availableSections.map((section) => {
              const isChecked = tempEnabledSections.includes(section.id);
              return (
                <div key={section.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#F7F8FA] transition-colors">
                  <Checkbox
                    id={section.id}
                    checked={isChecked}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(section.id, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={section.id}
                    className={`flex-1 text-sm cursor-pointer ${
                      isChecked ? 'text-gray-900 font-medium' : 'text-gray-600'
                    }`}
                  >
                    {section.label}
                  </label>
                  {section.default && (
                    <span className="text-xs text-[#FF7A00] bg-[#FF7A00]/10 px-2 py-1 rounded-full">
                      기본
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="bg-[#F7F8FA] p-3 rounded-lg">
            <p className="text-xs text-gray-600">
              💡 팁: 사용하지 않는 섹션을 숨기면 페이지가 더 깔끔해집니다. 
              언제든지 다시 활성화할 수 있어요.
            </p>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-[#FF7A00] hover:bg-[#E86E00] text-white flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>저장</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}