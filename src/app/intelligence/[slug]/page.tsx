"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const domainConfigs: Record<string, any> = {
  technology: {
    title: "Technology & Innovation",
    color: "#8B5CF6",
    subtitle: "Strategic Tech Monitoring & R&D Intelligence",
    description: "Deep-dive analysis into semiconductor lithography trends, AI compute clusters, and global patent momentum.",
    stats: [
      { label: 'Compute Capacity', val: '4.2 ExaFLOPS', delta: '+15%' },
      { label: 'Fab Utilization', val: '94.2%', delta: '-0.5%' },
      { label: 'R&D Spend', val: '$1.2T', delta: '+8.2%' }
    ]
  },
  agriculture: {
    title: "Agriculture & Food Security",
    color: "#00FF88",
    stats: [
      { label: 'Wheat Deficit', val: '-4.2M Tons', delta: 'Risk' },
      { label: 'Fertilizer Index', val: '142.4', delta: '+2.1%' }
    ]
  },
  climate: {
    title: "Climate & Environment",
    color: "#00D4FF",
    stats: [
      { label: 'Carbon Delta', val: '+2.1 ppm', delta: '+0.5%' },
      { label: 'Ocean Temp', val: '21.4°C', delta: '+0.2°C' }
    ]
  },
  economy: {
    title: "Global Economy",
    color: "#FFD700",
    stats: [
      { label: 'GDP Growth', val: '2.4%', delta: 'Stable' },
      { label: 'Trade Velocity', val: 'High', delta: '+4.2%' }
    ]
  },
  cyber: {
    title: "Cyber & Digital Security",
    color: "#FF2244",
    stats: [
      { label: 'Active BOTs', val: '12.4M', delta: '+8.4%' },
      { label: 'Infra Probes', val: 'High', delta: '+12%' }
    ]
  },
  science: {
    title: "Global Research & Science",
    color: "#8B5CF6",
    stats: [
      { label: 'Space Launches', val: '22/mo', delta: '+5%' },
      { label: 'Bio Patents', val: '142k', delta: '+1.2%' }
    ]
  }
};

export default function IntelligenceDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const config = domainConfigs[slug] || domainConfigs.technology;
  const [insight, setInsight] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsight = () => {
    setIsGenerating(true);
    setInsight("");
    const text = `Analyzing ${config.title} patterns... Detected anomaly in regional supply chains. Projecting 12% drift in market stability over Q3. Recommendation: Increase strategic reserves and monitor Tier-2 suppliers. Neural network confidence: 92.4%.`;
    
    let i = 0;
    const interval = setInterval(() => {
      setInsight(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 20);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0B0F19] overflow-hidden font-inter">
      <Header />
      
      <main className="flex-1 overflow-y-auto p-6 md:p-10 thin-scroll">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          
          {/* Back Navigation */}
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-text-muted hover:text-white transition-colors w-fit group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">Return to Dashboard</span>
          </button>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 rounded-full" style={{ background: config.color }} />
                <h1 className="text-4xl font-orbitron font-black text-white tracking-tight uppercase">
                  {config.title} <span className="text-text-muted">Intel</span>
                </h1>
              </div>
              <p className="text-text-secondary text-sm max-w-2xl font-medium tracking-wide">
                {config.subtitle || "Comprehensive monitoring of global indicators, tactical alerts, and strategic foresight."}
              </p>
            </div>
            
            <div className="flex gap-4">
              {config.stats.map((stat: any) => (
                <div key={stat.label} className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg flex flex-col">
                  <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-orbitron font-bold text-white leading-none">{stat.val}</span>
                    <span className="text-[10px] font-bold text-neon-green">{stat.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: AI Insight Generator */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="glass-panel p-6 border-neon-blue/20 bg-neon-blue/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-[3px]">AI Insight Generator</h3>
                  </div>
                  <button 
                    onClick={generateInsight}
                    disabled={isGenerating}
                    className="p-2 rounded bg-neon-blue/20 border border-neon-blue/40 text-neon-blue hover:bg-neon-blue/30 transition-all disabled:opacity-50"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3-3.5 3.5z"/>
                    </svg>
                  </button>
                </div>
                
                <div className="bg-black/60 rounded border border-white/5 p-4 min-h-[220px] font-mono text-[11px] leading-relaxed text-neon-blue/80 overflow-y-auto">
                  {insight ? (
                    <div className="space-y-4">
                      <p>{insight}</p>
                      {!isGenerating && (
                        <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                          <span className="text-[9px] text-text-muted uppercase">Recommended Actions:</span>
                          <ul className="list-disc list-inside text-white/60 space-y-1">
                            <li>Re-route supply chain via Atlantic corridor</li>
                            <li>Hedge currency exposure in East Asian markets</li>
                            <li>Deploy defensive protocol Zeta-9</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 italic">
                      Click the generator icon to synthesize predictive intelligence...
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-panel p-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-[3px] mb-4">Strategic Alerts</h3>
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-3 border-l-2 border-neon-orange bg-white/5 flex flex-col gap-1">
                      <span className="text-[10px] text-white font-bold uppercase">Sector Drift Warning</span>
                      <p className="text-[10px] text-text-secondary">Unusual volatility detected in {config.title} secondary markets.</p>
                      <span className="text-[8px] text-neon-orange font-bold mt-1">2h ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Deep Analysis Charts */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="glass-panel p-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-[3px] mb-6">Historical Trend Analysis</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={spaceData}>
                      <defs>
                        <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="year" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#64748B' }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#64748B' }} 
                      />
                      <Tooltip 
                        contentStyle={{ background: '#0F172A', border: `1px solid ${config.color}44`, borderRadius: '8px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="launches"
                        stroke={config.color} 
                        fillOpacity={1} 
                        fill="url(#colorMain)" 
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-6">
                  <h3 className="text-xs font-bold text-white uppercase tracking-[3px] mb-6">Regional Distribution</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={researchData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="field" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                        <Tooltip contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '4px' }} />
                        <Bar dataKey="delta" fill={config.color} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="glass-panel p-6 flex flex-col">
                  <h3 className="text-xs font-bold text-white uppercase tracking-[3px] mb-6">Data Source Integrity</h3>
                  <div className="flex flex-col gap-4">
                    {[
                      { s: 'Satellite Imagery (Sentinel)', val: 98, c: 'green' },
                      { s: 'Ground Sensor Network', val: 84, c: 'blue' },
                      { s: 'Social NLP Stream', val: 62, c: 'orange' }
                    ].map(src => (
                      <div key={src.s} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-text-secondary font-medium">{src.s}</span>
                          <span className="text-[10px] text-white font-bold">{src.val}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full bg-neon-${src.c}`} style={{ width: `${src.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ background: config.color }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full blur-[100px]" style={{ background: 'var(--neon-blue)' }} />
      </div>
    </div>
  );
}

// Mock data for the charts in detail page
const spaceData = [
  { year: '2020', launches: 114 },
  { year: '2021', launches: 146 },
  { year: '2022', launches: 186 },
  { year: '2023', launches: 223 },
  { year: '2024', launches: 285 },
  { year: '2025', launches: 312 },
];

const researchData = [
  { field: 'APAC', delta: 82 },
  { field: 'NA', delta: 65 },
  { field: 'EU', delta: 54 },
  { field: 'LATAM', delta: 32 },
  { field: 'AFRICA', delta: 28 },
];
