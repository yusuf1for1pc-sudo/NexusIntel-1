"use client";
import React from 'react';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import SectionHeader from '../SectionHeader';

const tempAnomalyData = [
  { year: '2019', temp: 0.95 },
  { year: '2020', temp: 1.02 },
  { year: '2021', temp: 0.85 },
  { year: '2022', temp: 0.89 },
  { year: '2023', temp: 1.15 },
  { year: '2024', temp: 1.28 },
];

const disasterData = [
  { region: 'East Asia', count: 12, risk: 85 },
  { region: 'N. America', count: 8, risk: 65 },
  { region: 'Europe', count: 5, risk: 45 },
  { region: 'S. Asia', count: 18, risk: 92 },
  { region: 'Africa', count: 14, risk: 78 },
];

export default function ClimateSection() {
  return (
    <div id="climate-intel" className="glass-panel p-4 min-h-[350px]">
      <SectionHeader 
        title="Climate & Environment" 
        subtitle="Anomaly Tracking & Disaster Monitoring"
        href="/climate-intelligence"
        color="#00D4FF"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Temp Anomaly Bars */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Global Temp Anomaly (°C)</span>
            <span className="text-[10px] text-neon-red font-bold">+1.28°C (Extreme)</span>
          </div>
          <div className="h-48 w-full bg-black/20 rounded border border-white/5 p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tempAnomalyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#94A3B8' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#94A3B8' }} 
                  domain={[0, 1.5]}
                  ticks={[0, 0.35, 0.7, 1.05, 1.4]}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{ background: '#0F172A', border: '1px solid rgba(0, 212, 255, 0.3)', borderRadius: '4px', fontSize: '10px' }}
                  formatter={(val: number) => [`${val}°C`, 'Temp Anomaly']}
                />
                <Bar dataKey="temp" radius={[3, 3, 0, 0]} barSize={22}>
                  {tempAnomalyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.temp > 1.2 ? '#FF2244' : entry.temp > 1.0 ? '#FF8C00' : '#FFFFFF'}
                      fillOpacity={entry.temp > 1.2 ? 0.9 : entry.temp > 1.0 ? 0.85 : 0.82}
                      stroke={entry.temp > 1.2 ? '#FF2244' : entry.temp > 1.0 ? '#FF8C00' : 'rgba(255,255,255,0.3)'}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disaster Alerts */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Disaster Event Cluster Map</span>
            <span className="text-[10px] text-neon-orange font-bold">18 ACTIVE ALERTS</span>
          </div>
          <div className="h-48 w-full bg-black/20 rounded border border-white/5 p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                <XAxis type="category" dataKey="region" name="Region" axisLine={false} tick={{fontSize: 8, fill: '#64748B'}} />
                <YAxis type="number" dataKey="count" name="Event Count" axisLine={false} tick={{fontSize: 8, fill: '#64748B'}} />
                <ZAxis type="number" dataKey="risk" range={[50, 400]} name="Risk Level" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ background: '#0F172A', border: '1px solid rgba(0, 212, 255, 0.3)', borderRadius: '4px', fontSize: '10px' }}
                />
                <Scatter name="Disasters" data={disasterData} fill="#FF8C00" opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Environmental Status */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: '🔥', label: 'Wildfire Risk', val: 'Extreme', color: 'red' },
          { icon: '🌊', label: 'Flood Surge', val: 'Moderate', color: 'blue' },
          { icon: '🌪️', label: 'Cyclone Path', val: '2 Active', color: 'orange' },
          { icon: '💨', label: 'Air Quality', val: '142 AQI', color: 'orange' }
        ].map(node => (
          <div key={node.label} className="p-3 rounded bg-white/5 border border-white/5 flex items-center gap-3 group hover:bg-white/[0.08] transition-all">
            <span className="text-lg">{node.icon}</span>
            <div className="flex flex-col">
              <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest">{node.label}</span>
              <span className={`text-[10px] font-orbitron font-bold ${node.color === 'red' ? 'text-neon-red' : (node.color === 'orange' ? 'text-neon-orange' : 'text-neon-blue')}`}>{node.val}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
