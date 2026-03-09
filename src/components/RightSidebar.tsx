"use client";
import { useState } from "react";

// Defence budgets (2024 SIPRI estimates, USD billions)
const defenceBudgets = [
  { flag: "🇺🇸", name: "United States", code: "USA", budget: 886, change: "+3.2%", color: "#00D4FF", rank: 1 },
  { flag: "🇨🇳", name: "China", code: "CHN", budget: 296, change: "+7.2%", color: "#FF4444", rank: 2 },
  { flag: "🇷🇺", name: "Russia", code: "RUS", budget: 109, change: "+24%", color: "#FF8C00", rank: 3 },
  { flag: "🇮🇳", name: "India", code: "IND", budget: 83, change: "+4.2%", color: "#00FF88", rank: 4 },
  { flag: "🇸🇦", name: "Saudi Arabia", code: "KSA", budget: 75, change: "+2.9%", color: "#FFD700", rank: 5 },
  { flag: "🇬🇧", name: "United Kingdom", code: "GBR", budget: 68, change: "+1.8%", color: "#8B5CF6", rank: 6 },
  { flag: "🇩🇪", name: "Germany", code: "DEU", budget: 66, change: "+9.4%", color: "#00BFFF", rank: 7 },
  { flag: "🇰🇷", name: "South Korea", code: "KOR", budget: 47, change: "+3.9%", color: "#FF6B35", rank: 8 },
  { flag: "🇫🇷", name: "France", code: "FRA", budget: 46, change: "+2.1%", color: "#A78BFA", rank: 9 },
  { flag: "🇯🇵", name: "Japan", code: "JPN", budget: 45, change: "+26%", color: "#34D399", rank: 10 },
];

const maxBudget = Math.max(...defenceBudgets.map(d => d.budget));

const alliances = [
  { name: "NATO", members: 31, color: "#00D4FF", active: true },
  { name: "SCO", members: 9, color: "#8B5CF6", active: true },
  { name: "CSTO", members: 6, color: "#FF2244", active: true },
  { name: "QUAD", members: 4, color: "#00FF88", active: false },
  { name: "BRICS", members: 11, color: "#FF8C00", active: true },
];

export default function RightSidebar() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-1.5 h-full overflow-hidden">
      {/* Defence Budget Rankings */}
      <div className="glass-panel p-2.5 flex flex-col flex-1 overflow-hidden">
        <div className="section-header flex items-center gap-2">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 10,10 0,10" stroke="#FF8C00" strokeWidth="1" fill="none" />
            <circle cx="5" cy="6.5" r="1.5" fill="#FF8C00" />
          </svg>
          Defence Budget Rankings
          <span className="ml-auto text-[6px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold uppercase tracking-widest">
            SIPRI 2024
          </span>
        </div>

        <div className="flex-1 overflow-y-auto thin-scroll space-y-1 mt-1">
          {defenceBudgets.map((country, i) => {
            const isExpanded = expanded === i;
            const barWidth = `${(country.budget / maxBudget) * 100}%`;
            const isPositive = country.change.startsWith("+");
            return (
              <div
                key={country.code}
                className="rounded p-1.5 cursor-pointer transition-all"
                style={{
                  background: isExpanded ? `rgba(${country.color === '#FF4444' ? '255,68,68' : '0,212,255'},0.06)` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isExpanded ? country.color + '55' : 'rgba(255,255,255,0.05)'}`,
                }}
                onClick={() => setExpanded(isExpanded ? null : i)}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-bold font-orbitron" style={{ color: country.color, minWidth: "14px" }}>
                    #{country.rank}
                  </span>
                  <span className="text-sm leading-none">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-text-primary truncate">{country.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        <span className="text-[8px] font-bold font-orbitron" style={{ color: country.color }}>
                          ${country.budget}B
                        </span>
                        <span className="text-[7px] font-bold" style={{ color: isPositive ? "#FF4444" : "#00FF88" }}>
                          {country.change}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 h-1 rounded-full overflow-hidden bg-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: barWidth,
                          background: `linear-gradient(90deg, ${country.color}66, ${country.color})`,
                          boxShadow: `0 0 4px ${country.color}88`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-1.5 pt-1.5 border-t border-white/10 grid grid-cols-2 gap-1">
                    <div className="text-center">
                      <div className="text-[8px] font-bold" style={{ color: country.color }}>{country.code}</div>
                      <div className="text-[6px] text-text-muted">Country Code</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[8px] font-bold" style={{ color: isPositive ? "#FF4444" : "#00FF88" }}>{country.change}</div>
                      <div className="text-[6px] text-text-muted">YoY Change</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alliance Network */}
      <div className="glass-panel p-2.5">
        <div className="section-header">
          <span>⚡</span> Alliance Network
        </div>
        <div className="space-y-1.5">
          {alliances.map((a) => (
            <div key={a.name} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: a.color, boxShadow: `0 0 6px ${a.color}` }} />
              <span className="text-[9px] font-bold" style={{ color: a.color }}>{a.name}</span>
              <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div style={{ width: `${Math.min(a.members * 6, 100)}%`, background: a.color, height: '100%' }} />
              </div>
              <span className="text-[8px] text-text-secondary">{a.members}</span>
              {a.active && <div className="w-1 h-1 rounded-full bg-neon-green animate-blink" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
