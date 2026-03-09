"use client";
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import SectionHeader from '../SectionHeader';

const yieldData = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 98 },
  { month: 'Mar', value: 95 },
  { month: 'Apr', value: 92 },
  { month: 'May', value: 88 },
  { month: 'Jun', value: 85 },
];

const riskData = [
  { name: 'Low Risk', value: 45, color: '#00FF88' },
  { name: 'Monitor', value: 30, color: '#FFD700' },
  { name: 'Extreme', value: 25, color: '#FF2244' },
];

export default function AgriSection() {
  return (
    <div id="agri-intel" className="glass-panel p-4 min-h-[350px]">
      <SectionHeader 
        title="Agriculture & Food Security" 
        subtitle="Crop Yield Forecasts & Market Stability"
        href="/agriculture-intelligence"
        color="#00FF88"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Crop Yield Forecast */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Global Wheat Price Index</span>
            <span className="text-[10px] text-neon-red font-bold">+18.4% (Volatility High)</span>
          </div>
          <div className="h-48 w-full bg-black/20 rounded border border-white/5 p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldData}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="month" 
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
                  contentStyle={{ background: '#0F172A', border: '1px solid rgba(0, 255, 136, 0.3)', borderRadius: '4px', fontSize: '10px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00FF88" 
                  fillOpacity={1} 
                  fill="url(#colorYield)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Drought Risk Pie */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Global Arable Land Risk Profile</span>
          </div>
          <div className="h-48 w-full bg-black/20 rounded border border-white/5 flex items-center justify-center p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#0F172A', border: '1px solid rgba(0, 255, 136, 0.3)', borderRadius: '4px', fontSize: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-orbitron font-bold text-white">25%</span>
              <span className="text-[7px] text-neon-red font-bold uppercase tracking-tighter">Extreme Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agri Supply Chain Stats */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
          <span className="text-[9px] font-bold text-white uppercase tracking-[2px]">Market Disruption Alerts</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Fertilizer Cost', val: '+24%', status: 'Critical' },
            { label: 'Logistics Delay', val: '8.2 Days', status: 'Warning' },
            { label: 'Soil Health', val: '64%', status: 'Stable' },
            { label: 'Export Bans', val: '12 Nations', status: 'Risk' }
          ].map(stat => (
            <div key={stat.label} className="p-2 rounded bg-white/5 border border-white/5">
              <span className="text-[8px] text-text-muted font-bold block">{stat.label}</span>
              <span className="text-[11px] font-orbitron font-bold text-white block mt-0.5">{stat.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
