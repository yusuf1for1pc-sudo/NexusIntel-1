"use client";
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import SectionHeader from '../SectionHeader';

const aiData = [
  { year: '2020', value: 45 },
  { year: '2021', value: 82 },
  { year: '2022', value: 110 },
  { year: '2023', value: 165 },
  { year: '2024', value: 240 },
  { year: '2025', value: 380 },
];

const semiData = [
  { region: 'Taiwan', capacity: 92, status: 'Stable' },
  { region: 'S. Korea', capacity: 85, status: 'Stable' },
  { region: 'USA', capacity: 65, status: 'Growing' },
  { region: 'EU', capacity: 58, status: 'Critical' },
  { region: 'Japan', capacity: 72, status: 'Stable' },
];

export default function TechSection() {
  return (
    <div id="tech-intel" className="glass-panel p-4 min-h-[350px]">
      <SectionHeader 
        title="Technology & Innovation Intelligence" 
        subtitle="Semiconductors, AI Investment & Cyber-Resilience"
        href="/technology-intelligence"
        color="var(--neon-purple)"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* AI Investment Chart */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Global AI Investment ($bn)</span>
            <span className="text-[10px] text-neon-green font-bold">+52% YoY</span>
          </div>
          <div className="h-48 w-full bg-black/20 rounded border border-white/5 p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aiData}>
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
                  itemStyle={{ color: 'var(--neon-purple)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--neon-purple)" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: 'var(--neon-purple)', strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Semiconductor Capacity Chart */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Semiconductor Fab Utilization (%)</span>
            <span className="text-[10px] text-neon-blue font-bold">Demand: HIGH</span>
          </div>
          <div className="h-48 w-full bg-black/20 rounded border border-white/5 p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semiData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="region" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  width={60}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ background: '#0F172A', border: '1px solid rgba(0, 212, 255, 0.3)', borderRadius: '4px', fontSize: '10px' }}
                />
                <Bar dataKey="capacity" radius={[0, 4, 4, 0]} barSize={12}>
                  {semiData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.status === 'Critical' ? 'var(--neon-red)' : (entry.status === 'Growing' ? 'var(--neon-green)' : 'var(--neon-blue)')} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cyber Section Summary */}
      <div className="mt-6 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-red animate-blink" />
          <span className="text-[9px] font-bold text-white uppercase tracking-[2px]">Cyber-Threat Hotspots</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Ransomware Avg', value: '$2.1M', delta: '+12%', color: 'red' },
            { label: 'Zero-Day Vulns', value: '14 Active', delta: '+3', color: 'orange' },
            { label: 'Network Integrity', value: '88.4%', delta: '-0.2%', color: 'blue' }
          ].map(stat => (
            <div key={stat.label} className="p-2 rounded bg-white/5 border border-white/5 flex flex-col">
              <span className="text-[8px] text-text-secondary uppercase font-bold">{stat.label}</span>
              <div className="flex items-end justify-between mt-1">
                <span className="text-sm font-orbitron font-bold text-white leading-none">{stat.value}</span>
                <span className={`text-[8px] font-bold ${stat.color === 'red' ? 'text-neon-red' : (stat.color === 'orange' ? 'text-neon-orange' : 'text-neon-blue')}`}>
                  {stat.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
