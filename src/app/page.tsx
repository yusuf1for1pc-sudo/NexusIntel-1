"use client";
import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const LeftSidebar = dynamic(() => import("@/components/LeftSidebar"), { ssr: false });
const MapCenter = dynamic(() => import("@/components/MapCenter"), { ssr: false });
const RightSidebar = dynamic(() => import("@/components/RightSidebar"), { ssr: false });
const TopAnalytics = dynamic(() => import("@/components/TopAnalytics"), { ssr: false });
const BottomAnalytics = dynamic(() => import("@/components/BottomAnalytics"), { ssr: false });

export default function Home() {
  const [leftWidth, setLeftWidth] = useState(280);
  const [rightWidth, setRightWidth] = useState(280);
  const [isMapMaximized, setIsMapMaximized] = useState(false);

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  const startDragLeft = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingLeft(true);
  }, []);

  const startDragRight = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingRight(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingLeft) {
        const newWidth = Math.max(180, Math.min(e.clientX, 600));
        setLeftWidth(newWidth);
      } else if (isDraggingRight) {
        const newWidth = Math.max(180, Math.min(window.innerWidth - e.clientX, 600));
        setRightWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
    };

    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
    } else {
      document.body.style.cursor = "default";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight]);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden" style={{ background: "#0B0F19" }}>
      <Header />
      <div className="flex-1 overflow-hidden p-1.5 pt-0 flex relative">
        
        {/* LEFT SIDEBAR */}
        <div style={{ width: leftWidth, minWidth: leftWidth }} className="h-full shrink-0 flex flex-col relative z-10 transition-none">
          <LeftSidebar />
        </div>

        {/* LEFT DRAG HANDLE */}
        <div 
          onMouseDown={startDragLeft}
          className="w-2 cursor-col-resize shrink-0 group flex flex-col items-center justify-center relative z-20 hover:bg-neon-blue/10 transition-colors"
        >
          <div className={`w-[2px] h-12 rounded-full transition-colors ${isDraggingLeft ? "bg-neon-blue" : "bg-white/10 group-hover:bg-neon-blue/60"}`} />
        </div>

        {/* MIDDLE SECTION (Map + Analytics) */}
        <div className="flex-1 h-full min-w-[300px] flex flex-col relative py-0">
          {!isMapMaximized && (
            <div className="h-[105px] shrink-0 mb-1.5">
              <TopAnalytics />
            </div>
          )}
          <div className="flex-1 min-h-0 relative">
            <MapCenter isMaximized={isMapMaximized} onToggleMaximize={() => setIsMapMaximized(!isMapMaximized)} />
            {/* Active overlay indicator if resizing to prevent iframes/maps from catching mouse events */}
            {(isDraggingLeft || isDraggingRight) && (
              <div className="absolute inset-0 z-50 bg-transparent" />
            )}
          </div>
          {!isMapMaximized && (
            <div className="h-[120px] shrink-0 mt-1.5">
              <BottomAnalytics />
            </div>
          )}
        </div>

        {/* RIGHT DRAG HANDLE */}
        <div 
          onMouseDown={startDragRight}
          className="w-2 cursor-col-resize shrink-0 group flex flex-col items-center justify-center relative z-20 hover:bg-neon-blue/10 transition-colors"
        >
          <div className={`w-[2px] h-12 rounded-full transition-colors ${isDraggingRight ? "bg-neon-blue" : "bg-white/10 group-hover:bg-neon-blue/60"}`} />
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ width: rightWidth, minWidth: rightWidth }} className="h-full shrink-0 flex flex-col relative z-10 transition-none">
          <RightSidebar />
        </div>

      </div>
    </div>
  );
}
