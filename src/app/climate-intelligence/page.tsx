"use client";
import React from "react";
import Header from "@/components/Header";

export default function ClimateIntelligencePage() {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden" style={{ background: "#0B0F19" }}>
      <Header />
      <div className="flex-1 overflow-y-auto p-6 text-white thin-scroll">
        <h1 className="text-3xl font-orbitron font-bold text-neon-blue mb-2">CLIMATE & DISASTER INTELLIGENCE</h1>
        <p className="text-text-secondary mb-8">Extreme weather alerts, climate change indicators, wildfire monitoring, and disaster response alerts.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 h-[500px] flex items-center justify-center">
            <span className="text-text-muted font-bold tracking-widest uppercase animate-pulse">Syncing NASA / NOAA Satellite Data...</span>
          </div>
          <div className="glass-panel p-6 h-[500px] flex items-center justify-center">
            <span className="text-text-muted font-bold tracking-widest uppercase animate-pulse">Loading GDACS Alerts...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
