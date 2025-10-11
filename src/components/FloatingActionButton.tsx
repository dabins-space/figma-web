import { Plus } from "lucide-react";
import { Button } from "./ui/button";

export function FloatingActionButton() {
  return (
    <Button 
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#FF7A00] hover:bg-[#FF7A00]/90 shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      size="icon"
    >
      <Plus className="w-6 h-6 text-white" />
      <span className="sr-only">새 이벤트 만들기</span>
    </Button>
  );
}