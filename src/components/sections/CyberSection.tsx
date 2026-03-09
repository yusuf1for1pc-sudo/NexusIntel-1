"use client";
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import SectionHeader from '../SectionHeader';

const cyberAttackData = [
  { day: 'Mon', count: 420 },
  { day: 'Tue', count: 512 },
  { day: 'Wed', count: 680 },
  { day: 'Thu', count: 590 },
  { day: 'Fri', count: 720 },
  { day: 'Sat', count: 310 },
  { day: 'Sun', count: 280 },
];

const threatVectorData = [
  { subject: 'Ransomware', A: 120, B: 110, fullMark: 150 },
  { subject: 'Phishing', A: 98, B: 130, fullMark: 150 },
  { subject: 'DDoS', A: 86, B: 130, fullMark: 150 },
  { subject: 'Zero-Day', A: 99, B: 100, fullMark: 150 },
  { subject: 'Supply Chain', A: 85, B: 90, fullMark: 150 },
  { subject: 'Insider', A: 65, B: 85, fullMark: 150 },
];

export default function CyberSection() {
  return (
    <div id="cyber-intel" className="glass-panel p-4 min-h-[350px]">
      <SectionHeader 
        title="Cyber & Digital Security" 
        subtitle="Nation-State Activity & Infrastructure Threats"
        href="/cyber-intelligence"
        color="#FF2244"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Attack Frequency Bar Chart */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Global Attack Frequency (Weekly)</span>
            <span className="text-[10px] text-neon-red font-bold">Incursion Level: CRITICAL</span>
          </div>
          <div className="h-48 w-full bg-black/20 rounded border border-white/5 p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cyberAttackData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="day" 
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
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ background: '#0F172A', border: '1px solid rgba(255, 34, 68, 0.3)', borderRadius: '4px', fontSize: '10px' }}
                />
                <Bar dataKey="count" fill="var(--neon-red)" radius={[2, 2, 0, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Vector Radar Chart - Premium Version */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Active Threat Vector Matrix</span>
            <span className="text-[10px] text-neon-red font-bold animate-pulse">⚠ LIVE THREATS</span>
          </div>
          <div
            className="h-56 w-full rounded border flex items-center justify-center"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,34,68,0.04) 0%, rgba(10,15,30,0.9) 70%)',
              border: '1px solid rgba(255,34,68,0.2)',
              boxShadow: 'inset 0 0 30px rgba(255,34,68,0.04), 0 0 15px rgba(255,34,68,0.06)',
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="78%" data={threatVectorData}>
                <PolarGrid
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="4 3"
                />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 9, fill: '#94A3B8', fontWeight: 600 }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 150]}
                  tick={{ fontSize: 7, fill: 'rgba(255,255,255,0.3)' }}
                  tickCount={4}
                  stroke="rgba(255,255,255,0.05)"
                />
                <Radar
                  name="Current Month"
                  dataKey="A"
                  stroke="#FF2244"
                  strokeWidth={2}
                  fill="#FF2244"
                  fillOpacity={0.35}
                  dot={{ fill: '#FF2244', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#FF2244', stroke: '#FF224480', strokeWidth: 2 }}
                />
                <Radar
                  name="Prev Month"
                  dataKey="B"
                  stroke="#00D4FF"
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                  fill="#00D4FF"
                  fillOpacity={0.08}
                  dot={{ fill: '#00D4FF', r: 2, strokeWidth: 0 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{
                    fontSize: '9px',
                    bottom: 4,
                    paddingTop: '4px',
                    color: '#94A3B8',
                    fontWeight: 600,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,15,30,0.97)',
                    border: '1px solid rgba(255,34,68,0.4)',
                    borderRadius: '6px',
                    fontSize: '10px',
                    boxShadow: '0 4px 20px rgba(255,34,68,0.15)',
                  }}
                  labelStyle={{ color: '#FF2244', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '9px' }}
                  itemStyle={{ color: '#E2E8F0' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {/* Threat intensity scale */}
          <div className="flex items-center justify-center gap-3 mt-1.5">
            {[
              { label: 'Low', color: '#94A3B8' },
              { label: 'Medium', color: '#FF8C00' },
              { label: 'High', color: '#FF4444' },
              { label: 'Critical', color: '#FF0000' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 4px ${s.color}` }} />
                <span className="text-[7px]" style={{ color: s.color }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cyber Intelligence Ticker */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-red animate-blink" />
          <span className="text-[9px] font-bold text-white uppercase tracking-[2px]">High-Intensity Cyber-Events</span>
        </div>
        <div className="space-y-2">
          {[
            { id: 'CE-01', title: 'Critical Infrastructure Probe: EU Grids', severity: 'High', source: 'CISA Alert' },
            { id: 'CE-02', title: 'Nation-State APT Campaign: StealthNet identified', severity: 'Critical', source: 'FireEye' },
          ].map(event => (
            <div key={event.id} className="p-2.5 rounded bg-white/5 border border-white/5 flex items-center justify-between group hover:border-neon-red/30 transition-all">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[7px] text-neon-red font-bold font-orbitron">{event.id}</span>
                  <span className="text-[10px] text-white font-bold">{event.title}</span>
                </div>
                <span className="text-[8px] text-text-muted">Detected by {event.source}</span>
              </div>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${event.severity === 'Critical' ? 'bg-neon-red/20 text-neon-red border border-neon-red/40' : 'bg-neon-orange/20 text-neon-orange border border-neon-orange/40'}`}>
                {event.severity.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
