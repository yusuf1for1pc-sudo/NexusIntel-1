"use client";
import React from "react";
import Header from "@/components/Header";

export default function EconomicIntelligencePage() {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden" style={{ background: "#0B0F19" }}>
      <Header />
      <div className="flex-1 overflow-y-auto p-6 text-white thin-scroll">
        <h1 className="text-3xl font-orbitron font-bold text-[#FFD700] mb-2">GLOBAL ECONOMIC INTELLIGENCE</h1>
        <p className="text-text-secondary mb-8">Inflation monitoring, global trade flows, commodity prices, and supply chain disruptions.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 h-[500px] flex items-center justify-center">
            <span className="text-text-muted font-bold tracking-widest uppercase animate-pulse">Retrieving FRED & World Bank Index...</span>
          </div>
          <div className="glass-panel p-6 h-[500px] flex items-center justify-center">
            <span className="text-text-muted font-bold tracking-widest uppercase animate-pulse">Loading Currency Matrices...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
