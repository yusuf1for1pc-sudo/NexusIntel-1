"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [tensionIndex] = useState(8.4);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" }));
    };
    updateClock();
    const t = setInterval(updateClock, 1000);

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150);
    }, 8000);

    return () => { clearInterval(t); clearInterval(glitchInterval); };
  }, []);

  const tensionColor = tensionIndex >= 8 ? "#FF2244" : tensionIndex >= 6 ? "#FF8C00" : "#00FF88";

  return (
    <header className="glass-panel flex items-center justify-between px-4 py-2 h-14 shrink-0 relative overflow-hidden scan-effect">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

      {/* Logo & Title */}
      <div className="flex items-center gap-3 z-10">
        {/* Logo Icon */}
        <div className="relative w-9 h-9 animate-float">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="18" cy="18" r="16" stroke="#00D4FF" strokeWidth="1" opacity="0.4" />
            <circle cx="18" cy="18" r="10" stroke="#00D4FF" strokeWidth="1.5" opacity="0.7" />
            <circle cx="18" cy="18" r="4" fill="#00D4FF" opacity="0.9" />
            <line x1="18" y1="2" x2="18" y2="8" stroke="#00D4FF" strokeWidth="1.5" />
            <line x1="18" y1="28" x2="18" y2="34" stroke="#00D4FF" strokeWidth="1.5" />
            <line x1="2" y1="18" x2="8" y2="18" stroke="#00D4FF" strokeWidth="1.5" />
            <line x1="28" y1="18" x2="34" y2="18" stroke="#00D4FF" strokeWidth="1.5" />
            <path d="M8 8 L12 12 M24 24 L28 28 M8 28 L12 24 M24 12 L28 8" stroke="#00D4FF" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
        <div>
          <h1 className={`font-orbitron text-xl font-bold neon-text-blue tracking-widest leading-none ${glitching ? 'opacity-70' : ''}`}>
            NEXUSINTEL
          </h1>
          <p className="text-[9px] text-text-secondary tracking-[4px] uppercase leading-none mt-0.5">Global Intelligence Dashboard</p>
        </div>
      </div>

      {/* Center — Global Tension Index */}
      <div className="flex items-center gap-6 z-10">
        <div className="flex items-center gap-3 glass-panel px-4 py-1.5 rounded-md">
          <div>
            <p className="text-[8px] text-text-secondary uppercase tracking-widest">Global Tension Index</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-orbitron text-2xl font-bold" style={{ color: tensionColor, textShadow: `0 0 15px ${tensionColor}` }}>
                {tensionIndex}
              </span>
              <span className="text-[10px] text-text-secondary">/10</span>
              <span className="text-[10px] font-bold" style={{ color: tensionColor }}>— HIGH</span>
            </div>
          </div>
          <div className="w-24">
            <div className="tension-bar">
              <div className="h-full rounded-full absolute" style={{ left: 0, right: 0, background: "linear-gradient(90deg, #00FF88 0%, #FFD700 40%, #FF8C00 70%, #FF2244 100%)" }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white bg-white shadow-md"
                style={{ left: `${(tensionIndex / 10) * 100 - 5}%`, boxShadow: `0 0 8px ${tensionColor}` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[7px] text-text-muted">LOW</span>
              <span className="text-[7px] text-text-muted">HIGH</span>
            </div>
          </div>
        </div>

        {/* Active theaters */}
        <div className="flex gap-4">
          {[
            { label: "Active Conflicts", value: "23", color: "#FF2244" },
            { label: "Monitored Zones", value: "147", color: "#00D4FF" },
            { label: "Alerts Today", value: "58", color: "#FF8C00" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="font-orbitron text-base font-bold counter-animate" style={{ color: item.color, textShadow: `0 0 10px ${item.color}` }}>
                {item.value}
              </div>
              <div className="text-[7px] text-text-secondary uppercase tracking-wider leading-none mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Live + Clock */}
      <div className="flex items-center gap-4 z-10">
        <div className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-md">
          <div className="live-dot" />
          <span className="font-orbitron text-[10px] font-bold text-red-400 tracking-widest">LIVE</span>
        </div>
        <div className="text-right">
          <div className="font-orbitron text-base font-bold neon-text-blue">{time}</div>
          <div className="text-[8px] text-text-secondary tracking-wider">{date} · GMT+5:30</div>
        </div>
        {/* Rotating ring */}
        <div className="relative w-8 h-8">
          <svg className="w-full h-full" style={{ animation: "rotate-ring 6s linear infinite" }} viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="13" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="1" strokeDasharray="4 3" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-neon-blue" style={{ boxShadow: "0 0 8px #00D4FF" }} />
          </div>
        </div>
      </div>
    </header>
  );
}
