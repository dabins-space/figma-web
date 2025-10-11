import { Search, Bell, Settings, User, Store } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Store className="h-6 w-6 text-[#FF7A00]" />
        <span className="text-xl font-bold text-gray-900">잘나가게</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="빠른 검색..."
            className="pl-10 bg-[#F5F6F8] border-none rounded-lg"
          />
        </div>
      </div>

      {/* Right side - Profile, Notifications, Settings */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF7A00] rounded-full text-xs"></span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>

        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-[#FF7A00] text-white">김</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">김점주</span>
        </div>
      </div>
    </header>
  );
}