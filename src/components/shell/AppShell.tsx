"use client";

import ActivityBar from "./ActivityBar";
import Sidebar from "./Sidebar";
import BottomPanel from "./BottomPanel";
import MobileNav from "./MobileNav";
import { useWorkspace } from "@/store/workspace";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, bottomPanelOpen } = useWorkspace();

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-white text-gray-800">

      {/* ── 데스크탑: 왼쪽 ActivityBar ── */}
      <div className="hidden md:flex">
        <ActivityBar />
      </div>

      {/* ── 데스크탑: 사이드바 ── */}
      {!sidebarCollapsed && (
        <div className="hidden md:block w-56 shrink-0 border-r border-gray-200">
          <Sidebar />
        </div>
      )}

      {/* ── 메인 콘텐츠 영역 ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* 스크롤 가능한 콘텐츠 */}
        <div
          className="flex-1 overflow-y-auto pb-16 md:pb-0"
          style={{ scrollbarWidth: "thin" }}
        >
          {children}
        </div>

        {/* ── 데스크탑: 하단 패널 ── */}
        <div className="hidden md:block">
          {bottomPanelOpen ? (
            <div className="h-52 shrink-0">
              <BottomPanel />
            </div>
          ) : (
            <BottomPanel />
          )}
        </div>
      </div>

      {/* ── 모바일: 하단 탭 네비게이션 ── */}
      <MobileNav />
    </div>
  );
}
