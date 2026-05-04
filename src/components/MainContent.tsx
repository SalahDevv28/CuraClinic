"use client";

import { useSidebar } from "@/components/SidebarContext";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <main 
      className={`flex-1 min-h-screen p-8 transition-all duration-300 ease-in-out ${
        isCollapsed ? "ml-16" : "ml-64"
      }`}
    >
      {children}
    </main>
  );
}
