"use client";
import React from "react";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  subtitle?: string;
  color?: string;
}

export default function SectionHeader({ title, href, icon, subtitle, color = "var(--neon-blue)" }: SectionHeaderProps) {
  return (
    <div className="flex flex-col mb-4 pt-8 first:pt-4 group cursor-pointer">
      <Link href={href}>
        <div className="flex items-center justify-between group-hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-3">
            {icon && <div style={{ color }}>{icon}</div>}
            <div>
              <h2 className="section-header !text-base !mb-0 !border-none !p-0" style={{ color }}>
                {title}
              </h2>
              {subtitle && (
                <p className="text-[10px] text-text-secondary font-orbitron tracking-widest uppercase mt-0.5 opacity-70">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted font-bold tracking-tighter uppercase group-hover:text-white transition-colors">
              DETAILED ANALYSIS
            </span>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform"
              style={{ color }}
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </Link>
      <div className="h-[1px] w-full mt-2 bg-gradient-to-r from-white/20 to-transparent" />
    </div>
  );
}
