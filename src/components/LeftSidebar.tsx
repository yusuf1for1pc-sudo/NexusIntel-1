"use client";
import { useEffect, useRef, useState } from "react";
import DefenseModal from "./DefenseModal";
import AllDealsModal from "./AllDealsModal";

const tickerItems = [
  "⚡ BREAKING: Joint military exercise begins in Baltic region",
  "📡 INTEL: Satellite imagery reveals new missile silos",
  "🌐 ALERT: Global internet disruption traced to submarine cable cut",
  "🛢 UPDATE: OPEC+ emergency meeting called over price collapse",
  "🚀 BREAKING: Intercontinental ballistic missile test confirmed",
];

export default function LeftSidebar() {
  const feedRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  
  // States for API data
  const [newsEvents, setNewsEvents] = useState<any[]>([]);
  const [defenseDeals, setDefenseDeals] = useState<any[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [showAllDeals, setShowAllDeals] = useState(false);

  useEffect(() => {
    // Fetch live news
    fetch('/api/news').then(res => res.json()).then(data => {
      setNewsEvents(data);
    }).catch(console.error);

    // Fetch live defense deals
    fetch('/api/defense').then(res => res.json()).then(data => {
      setDefenseDeals(data);
    }).catch(console.error);
  }, []);

  // Auto-scroller for news feed
  useEffect(() => {
    if (newsEvents.length === 0) return;
    const interval = setInterval(() => {
      setScrollPos(prev => {
        const el = feedRef.current;
        if (!el) return prev;
        const max = el.scrollHeight / 2;
        const next = prev + 0.3; // slightly slower scroll
        return next >= max ? 0 : next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [newsEvents]);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = scrollPos;
  }, [scrollPos]);

  // Map our smart colors to tailwind/hex UI colors
  const colorMap: Record<string, string> = {
    "red": "#FF2244",
    "green": "#00FF88",
    "orange": "#FF8C00",
    "yellow-orange": "#FFD700",
    "light-blue": "#00D4FF"
  };

  const tagMap: Record<string, string> = {
    "red": "CRITICAL",
    "green": "POSITIVE",
    "orange": "DOMESTIC ALERT",
    "yellow-orange": "UPCOMING RISK",
    "light-blue": "NATION POSITIVE"
  };

  // Helper for relative time
  const getRelativeTime = (isoString: string) => {
    if(!isoString) return "just now";
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if(diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff/60)}h ago`;
  };

  return (
    <>
      <div className="flex flex-col gap-1.5 h-full overflow-hidden relative">
        {/* Live Events Feed */}
        <div className="glass-panel p-2.5 flex flex-col flex-1 overflow-hidden min-h-0 relative">
          <div className="section-header">
            <div className="live-dot" />
            Global Live News Feed
          </div>

          {newsEvents.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[10px] text-neon-blue animate-pulse">Establishing secure link...</span>
            </div>
          ) : (
            <div className="overflow-hidden flex-1 mask-fade" ref={feedRef} style={{ overflowY: 'hidden', position: 'relative' }}>
              <div style={{ animation: "none" }}>
                {/* Duplicated for seamless loop */}
                {[...newsEvents, ...newsEvents].map((e, i) => {
                  const uiColor = colorMap[e.colorNode] || "#00D4FF";
                  return (
                    <div
                      key={`${e.id}-${i}`}
                      className="mb-2 p-3 rounded bg-white/5 border-l-2 border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all group relative overflow-hidden"
                      style={{ borderLeftColor: uiColor }}
                    >
                      {/* Source Branding */}
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {e.logo ? (
                            <img src={e.logo} alt={e.source} className="h-3 w-auto object-contain brightness-110" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: uiColor }} />
                          )}
                          <span className="font-orbitron font-bold text-[8px] tracking-[2px]" style={{ color: uiColor }}>
                            {e.source.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[7px] text-text-muted font-medium">{getRelativeTime(e.publishedAt)}</span>
                      </div>

                      {/* Content */}
                      <p className="text-[10.5px] font-bold text-white leading-tight mb-1 group-hover:text-neon-blue transition-colors">
                        {e.title}
                      </p>
                      <p className="text-[9px] text-text-secondary leading-normal mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        {e.description}
                      </p>

                      {/* Footer Actions */}
                      <div className="flex justify-between items-center">
                        <span className="status-badge text-[6px] py-0.5 px-1.5" style={{ color: uiColor, background: `${uiColor}15`, border: `1px solid ${uiColor}30` }}>
                          {tagMap[e.colorNode] || "INTEL UPDATE"}
                        </span>
                        <a 
                          href={e.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[7px] font-bold text-neon-blue hover:text-white flex items-center gap-1 uppercase tracking-widest bg-neon-blue/10 px-2 py-0.5 rounded border border-neon-blue/20 invisible group-hover:visible transition-all"
                        >
                          Source [↗]
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live Defense Deals */}
        <div className="glass-panel p-2.5 flex flex-col" style={{ flexBasis: '40%' }}>
          <div className="section-header">
            <span className="text-neon-orange">⚔</span> Defense News & Strategic Deals
          </div>
          
          {defenseDeals.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[10px] text-neon-orange animate-pulse">Decrypting defense logs...</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto thin-scroll space-y-1.5 pr-1">
              {defenseDeals.map((deal) => (
                <div 
                  key={deal.id} 
                  className="bg-black/20 border border-white/5 rounded p-2 cursor-pointer hover:border-neon-orange/40 hover:bg-neon-orange/5 transition-all group"
                  onClick={() => setSelectedDeal(deal)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5 text-[8px] text-text-secondary uppercase tracking-widest">
                      <span>{deal.country1}</span>
                      <span>→</span>
                      <span>{deal.country2}</span>
                    </div>
                    <span className="text-[8px] text-text-muted">{getRelativeTime(deal.date)}</span>
                  </div>
                  <div className="text-[9px] font-bold text-white group-hover:text-neon-orange transition-colors">
                    {deal.title}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[7px] text-neon-blue px-1 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20">
                      {deal.category}
                    </span>
                    <span className="font-orbitron text-[9px] font-bold text-neon-green">{deal.value}</span>
                  </div>
                  <div className="mt-1 text-[8px] text-text-muted line-clamp-2 leading-tight">
                    {deal.details}
                  </div>
                </div>
              ))}
              <div className="pt-2 pb-1 flex justify-center sticky bottom-0 bg-gradient-to-t from-[#0B0F19] to-transparent">
                <button 
                  onClick={() => setShowAllDeals(true)}
                  className="text-[9px] font-bold text-neon-orange uppercase tracking-widest px-3 py-1.5 rounded-full border border-neon-orange/30 hover:bg-neon-orange/10 hover:border-neon-orange/60 transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(255,140,0,0.1)]"
                >
                  See More Deals
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Ticker */}
        <div className="glass-panel-red p-1.5 overflow-hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold text-red-400 shrink-0 animate-blink font-orbitron">INTEL</span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-8 animate-ticker whitespace-nowrap" style={{ width: "max-content" }}>
                {[...tickerItems, ...tickerItems].map((item, i) => (
                  <span key={i} className="text-[8px] text-text-secondary shrink-0">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Defense Deal Detail Modal */}
      {selectedDeal && (
        <DefenseModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
      )}

      {/* Full Deals List Overlay */}
      {showAllDeals && (
        <AllDealsModal deals={defenseDeals} onClose={() => setShowAllDeals(false)} onSelectDeal={(d: any) => setSelectedDeal(d)} />
      )}
    </>
  );
}
