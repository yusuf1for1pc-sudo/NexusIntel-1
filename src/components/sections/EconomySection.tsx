"use client";
import React from 'react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend
} from 'recharts';
import SectionHeader from '../SectionHeader';

const economyData = [
  { month: 'Jul', inflation: 5.2, trade: 120 },
  { month: 'Aug', inflation: 4.8, trade: 135 },
  { month: 'Sep', inflation: 5.5, trade: 110 },
  { month: 'Oct', inflation: 6.2, trade: 95 },
  { month: 'Nov', inflation: 5.9, trade: 105 },
  { month: 'Dec', inflation: 6.5, trade: 88 },
];

const commodityData = [
  { label: 'Crude Oil', price: '$82.4', change: '+1.2%', trend: 'up' },
  { label: 'Gold', price: '$2,145', change: '-0.4%', trend: 'down' },
  { label: 'Natural Gas', price: '$2.85', change: '+5.7%', trend: 'up' },
  { label: 'Copper', price: '$3.82', change: '+0.8%', trend: 'up' },
];

export default function EconomySection() {
  return (
    <div id="economic-intel" className="glass-panel p-4 min-h-[350px]">
      <SectionHeader 
        title="Global Economic Intelligence" 
        subtitle="Inflation, Trade Flows & Sovereign Debt"
        href="/economic-intelligence"
        color="#FFD700"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Inflation & Trade Mixed Chart */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Inflation vs. Trade Momentum</span>
            <span className="text-[10px] text-neon-orange font-bold">Stagflation Risk: MODERATE</span>
          </div>
          <div className="h-48 w-full bg-black/20 rounded border border-white/5 p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={economyData}>
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
                  contentStyle={{ background: '#0F172A', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '4px', fontSize: '10px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
                <Bar dataKey="trade" name="Trade Volume" fill="rgba(0, 212, 255, 0.2)" radius={[2, 2, 0, 0]} barSize={20} />
                <Line dataKey="inflation" name="Inflation (%)" stroke="#FFD700" strokeWidth={2} dot={{ r: 3, fill: '#FFD700' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commodity Ticker Cards */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Global Commodity Spot Prices</span>
          </div>
          <div className="grid grid-cols-2 gap-3 h-48 content-start">
            {commodityData.map(item => (
              <div key={item.label} className="p-3 rounded bg-white/3 border border-white/5 flex flex-col justify-between hover:bg-white/5 transition-colors">
                <span className="text-[8px] text-text-muted font-bold uppercase">{item.label}</span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-sm font-orbitron font-bold text-white">{item.price}</span>
                  <span className={`text-[8px] font-bold ${item.trend === 'up' ? 'text-neon-red' : 'text-neon-green'}`}>
                    {item.trend === 'up' ? '▲' : '▼'} {item.change}
                  </span>
                </div>
              </div>
            ))}
            <div className="col-span-2 p-3 rounded bg-neon-blue/5 border border-neon-blue/20 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] text-neon-blue font-bold uppercase tracking-wider">Sovereign Debt Warning</span>
                <span className="text-[9px] text-white font-medium mt-0.5">3 Emerging Markets at High Re-financing Risk</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-neon-blue/30 flex items-center justify-center animate-pulse">
                <span className="text-neon-blue text-xs">⚠️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Economic Pulse */}
      <div className="mt-6 flex gap-4 overflow-x-auto thin-scroll pb-2">
        {[
          { label: 'USD Index (DXY)', val: '104.2', sub: '+0.15%' },
          { label: 'Global GDP Delta', val: '2.4%', sub: 'IMF Forecast' },
          { label: 'Baltic Dry Index', val: '1,842', sub: '-14% Shock' },
          { label: 'Semi-Lead Time', val: '24.2 wks', sub: '+0.5 wks' }
        ].map(stat => (
          <div key={stat.label} className="min-w-[140px] p-2 rounded bg-black/40 border-l border-white/10">
            <span className="text-[7px] text-text-muted font-bold tracking-widest block uppercase">{stat.label}</span>
            <span className="text-[12px] font-orbitron font-bold text-white block mt-0.5">{stat.val}</span>
            <span className="text-[7px] text-neon-blue block mt-0.5">{stat.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
