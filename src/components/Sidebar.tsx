"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CheckSquare, 
  Bell, 
  Phone,
  Stethoscope,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useSidebar } from "./SidebarContext";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Follow-ups", href: "/followups", icon: Phone },
  { name: "Reminders", href: "/reminders", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-surface border-r border-border flex flex-col z-50 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors z-50"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Logo */}
      <div className={`p-4 border-b border-border ${isCollapsed ? "flex justify-center" : ""}`}>
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold text-foreground whitespace-nowrap">CuraClinic</h1>
              <p className="text-xs text-neutral whitespace-nowrap">Clinic Manager</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                isCollapsed 
                  ? "justify-center px-2 py-3" 
                  : "gap-3 px-4 py-3"
              } ${
                isActive
                  ? "bg-primary-100 text-primary shadow-sm"
                  : "text-neutral-dark hover:bg-primary-50 hover:text-primary"
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
              {!isCollapsed && (
                <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-foreground text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                  {item.name}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-foreground rotate-45" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className={`p-2 border-t border-border ${isCollapsed ? "flex justify-center" : ""}`}>
        <div className={`flex items-center rounded-xl bg-primary-50 ${isCollapsed ? "p-2" : "px-4 py-3 gap-3"}`}>
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            SM
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-semibold text-foreground truncate">Dr. Sarah Mitchell</p>
              <p className="text-xs text-neutral truncate">General Physician</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
