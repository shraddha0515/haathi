import React from "react";
import { Bell, Calendar, UserCircle } from "lucide-react";
export default function Header() {
  const today = new Date().toLocaleString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <header className="flex items-center justify-between bg-white shadow-sm border-b border-green-200 px-6 py-3 sticky top-0 z-50">
      {}
      <div className="flex items-center gap-3">
        {}
        
      </div>
      {}
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-sm text-green-700">
        <Calendar size={16} />
        {today}
      </div>
      {}
      <div className="flex items-center gap-5">
        <div className="relative cursor-pointer">
          <Bell className="text-green-700 hover:text-green-800" size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-[4px] py-[1px] rounded-full">
            3
          </span>
        </div>
        <div className="cursor-pointer">
          <UserCircle className="text-green-700 hover:text-green-800" size={26} />
        </div>
      </div>
    </header>
  );
}
