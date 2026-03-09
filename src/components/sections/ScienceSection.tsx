"use client";
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar
} from 'recharts';
import SectionHeader from '../SectionHeader';

const spaceData = [
  { year: '2020', launches: 114 },
  { year: '2021', launches: 146 },
  { year: '2022', launches: 186 },
  { year: '2023', launches: 223 },
  { year: '2024', launches: 285 },
  { year: '2025', launches: 340 },
];

const researchData = [
  { field: 'AI/ML', delta: 82 },
  { field: 'Biotech', delta: 65 },
  { field: 'Quantum', delta: 48 },
  { field: 'Fusion', delta: 35 },
  { field: 'Space', delta: 90 },
];

export default function ScienceSection() {
  return (
    <div id="science-intel" className="glass-panel p-4 min-h-[350px]">
      <SectionHeader 
        title="Global Research & Science" 
        subtitle="Space, Biotech & Deep-Field Exploration"
        href="/intelligence/science"
        color="#8B5CF6"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Space Launches Chart */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Global Space Launch Momentum</span>
            <span className="text-[10px] text-neon-blue font-bold">Orbit Density: HIGH</span>
          </div>
          <div className="h-48 w-full bg-black/20 rounded border border-white/5 p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spaceData}>
                <defs>
                  <linearGradient id="colorLaunch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#64748B' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#64748B' }} 
                />
                <Tooltip 
                  contentStyle={{ background: '#0F172A', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '4px', fontSize: '10px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="launches" 
                  stroke="#8B5CF6" 
                  fillOpacity={1} 
                  fill="url(#colorLaunch)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Research field delta */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Scientific Publication Delta (%)</span>
          </div>
          <div className="h-48 w-full bg-black/20 rounded border border-white/5 p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={researchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="field" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 8, fill: '#64748B' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#64748B' }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ background: '#0F172A', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '4px', fontSize: '10px' }}
                />
                <Bar dataKey="delta" fill="var(--neon-purple)" radius={[2, 2, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Discovery log */}
      <div className="mt-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
          <span className="text-[9px] font-bold text-white uppercase tracking-[2px]">Scientific Breakthrough Log</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { tag: 'SPACE', title: 'James Webb detects bio-signature on K2-18b', status: 'Verifying' },
            { tag: 'BIOTECH', title: 'CRISPR-Cas12 trial shows 98% efficacy', status: 'Phase III' },
            { tag: 'FUSION', title: 'ITER reports sustained plasma for 480s', status: 'Milestone' }
          ].map((log, i) => (
            <div key={i} className="p-3 rounded bg-white/5 border border-white/5 flex flex-col hover:bg-white/[0.08] transition-all">
              <span className="text-[7px] text-neon-purple font-bold tracking-widest mb-1">{log.tag}</span>
              <span className="text-[10px] text-white font-medium leading-tight mb-2">{log.title}</span>
              <div className="mt-auto pt-2 border-t border-white/5 flex justify-between items-center">
                <span className="text-[8px] text-text-muted italic">{log.status}</span>
                <span className="text-[8px] text-neon-blue font-bold">INFO [+]</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
