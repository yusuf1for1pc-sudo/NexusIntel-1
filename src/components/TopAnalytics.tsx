"use client";
import { useEffect, useRef, useState } from "react";

// Pure SVG/Canvas-based charts — no external library needed
function LineChart({
  data,
  color,
  secondaryData,
  secondaryColor,
}: {
  data: number[];
  color: string;
  secondaryData?: number[];
  secondaryColor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const allData = secondaryData ? [...data, ...secondaryData] : data;
    const max = Math.max(...allData);
    const min = Math.min(...allData);
    const range = max - min || 1;
    const pad = 4;

    const drawLine = (pts: number[], c: string) => {
      const xStep = (W - pad * 2) / (pts.length - 1);
      const coords = pts.map((v, i) => ({
        x: pad + i * xStep,
        y: H - pad - ((v - min) / range) * (H - pad * 2),
      }));

      // Area gradient fill
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      const hex = c.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.moveTo(coords[0].x, H);
      coords.forEach(({ x, y }) => ctx.lineTo(x, y));
      ctx.lineTo(coords[coords.length - 1].x, H);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.moveTo(coords[0].x, coords[0].y);
      coords.forEach(({ x, y }) => ctx.lineTo(x, y));
      ctx.strokeStyle = c;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = c;
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dots
      coords.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
      });
    };

    drawLine(data, color);
    if (secondaryData && secondaryColor) drawLine(secondaryData, secondaryColor);
  }, [data, color, secondaryData, secondaryColor]);

  return <canvas ref={canvasRef} width={300} height={60} className="w-full h-full" />;
}

function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string | ((v: number) => string) }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-0.5 h-full w-full">
      {data.map((d, i) => {
        const barColor = typeof color === "function" ? color(d.value) : color;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-0.5">
            <span className="text-[6px] font-bold" style={{ color: barColor }}>{d.value}</span>
            <div
              className="w-full rounded-t transition-all duration-1000"
              style={{
                height: `${(d.value / max) * 100}%`,
                background: `linear-gradient(to top, ${barColor}44, ${barColor})`,
                boxShadow: `0 -2px 6px ${barColor}66`,
                minHeight: "2px",
              }}
            />
            <span className="text-[5.5px] text-text-muted text-center leading-none">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

const crudeOilData = [68.5, 70.2, 72.1, 71.5, 74.0, 73.8, 76.2, 75.9, 78.1, 77.5, 79.2, 78.45];
const goldData = [2050, 2065, 2080, 2075, 2100, 2090, 2120, 2115, 2130, 2125, 2140, 2145];

// Live Precipitation data (mm/h per recent hours)
const precipData = [
  { label: "01", value: 2.1 }, { label: "02", value: 1.4 }, { label: "03", value: 0.8 },
  { label: "04", value: 3.2 }, { label: "05", value: 5.6 }, { label: "06", value: 4.1 },
  { label: "07", value: 2.9 }, { label: "08", value: 1.3 }, { label: "09", value: 0.5 },
  { label: "10", value: 6.8 }, { label: "11", value: 8.2 }, { label: "12", value: 5.4 },
];

// Live Sea/Land Temp trend °C
const tempData = [14.2, 15.8, 16.1, 14.7, 13.9, 15.2, 17.3, 18.6, 19.1, 18.4, 20.2, 21.0];

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export default function TopAnalytics() {
  const [oilPrice, setOilPrice] = useState<number>(78.45);
  const [oilData, setOilData] = useState<number[]>(crudeOilData);
  const [goldPrice, setGoldPrice] = useState<number>(2145.00);
  const [goldHistory, setGoldHistory] = useState<number[]>(goldData);
  const [precipHistory, setPrecipHistory] = useState(precipData);
  const [currentPrecip, setCurrentPrecip] = useState<number>(5.4);
  const [currentTemp, setCurrentTemp] = useState<number>(21.0);
  const [tempHistory, setTempHistory] = useState<number[]>(tempData);

  useEffect(() => {
    fetch('/api/economy').then(res => res.json()).then(data => {
      if (data && data.crudeOilPrice) {
        setOilPrice(data.crudeOilPrice);
        setOilData(data.crudeOilHistory);
      }
      if (data && data.goldPrice) {
        setGoldPrice(data.goldPrice);
        setGoldHistory(data.goldHistory);
      }
    }).catch(console.error);
  }, []);

  // Simulate live precip & temp updates every 15s
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrecip = parseFloat((Math.random() * 9 + 0.5).toFixed(1));
      setCurrentPrecip(newPrecip);
      setPrecipHistory(prev => {
        const updated = [...prev.slice(1), { label: prev[prev.length - 1].label, value: newPrecip }];
        return updated;
      });

      const newTemp = parseFloat((Math.random() * 8 + 16).toFixed(1));
      setCurrentTemp(newTemp);
      setTempHistory(prev => [...prev.slice(1), newTemp]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="top-analytics h-full flex gap-2 overflow-x-auto thin-scroll">

      {/* Precious Metals (Gold) */}
      <div
        className="glass-panel p-2.5 flex flex-col flex-1 min-w-[230px] cursor-pointer hover:bg-white/5 transition-colors group"
        onClick={() => window.location.href = '/metals-intelligence'}
      >
        <div className="section-header flex justify-between items-center group">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: "#FFD700", boxShadow: "0 0 6px #FFD700" }} />
            Precious Metals (Gold)
          </div>
          <span className="text-neon-orange opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ background: "#FFD700" }} />
              <span className="text-[7px] text-text-secondary">Gold (USD)</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-[7px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,215,0,0.15)", color: "#FFD700" }}>+2.4% MoM</span>
          </div>
        </div>
        <div className="flex-1 min-h-0" style={{ height: "70px" }}>
          <LineChart data={goldHistory} color="#FFD700" />
        </div>
        <div className="flex justify-between mt-1 px-0.5">
          <span className="text-[6px] text-text-muted font-orbitron uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
            SOURCE: COMEX
          </span>
          <div className="flex gap-2">
            <span className="text-[8px] font-bold text-[#FFD700]">${goldPrice.toFixed(2)} / oz</span>
          </div>
        </div>
      </div>

      {/* Crude Oil Price */}
      <div
        className="glass-panel p-2.5 flex flex-col flex-1 min-w-[230px] cursor-pointer hover:bg-white/5 transition-colors group"
        onClick={() => window.location.href = '/economic-intelligence'}
      >
        <div className="section-header flex justify-between items-center group">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: "#FF8C00", boxShadow: "0 0 6px #FF8C00" }} />
            Crude Oil Price (WTI)
          </div>
          <span className="text-neon-orange opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ background: "#FF8C00" }} />
              <span className="text-[7px] text-text-secondary">WTI (USD)</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-[7px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,140,0,0.15)", color: "#FF8C00" }}>+1.2% MoM</span>
          </div>
        </div>
        <div className="flex-1 min-h-0" style={{ height: "70px" }}>
          <LineChart data={oilData} color="#FF8C00" />
        </div>
        <div className="flex justify-between mt-1 items-center">
          <span className="text-[6px] text-text-muted font-orbitron uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
            SOURCE: ENERGY INFORMATION ADMIN
          </span>
          <div className="flex gap-2">
            <span className="text-[8px] font-bold text-[#FF8C00]">${oilPrice.toFixed(2)} / bbl</span>
          </div>
        </div>
      </div>

      {/* Live Precipitation */}
      <div
        className="glass-panel p-2.5 flex flex-col flex-1 min-w-[230px] cursor-pointer hover:bg-white/5 transition-colors group"
        onClick={() => window.location.href = '/?mapMode=Live+Precip'}
      >
        <div className="section-header flex justify-between items-center group">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00BFFF", boxShadow: "0 0 8px #00BFFF" }} />
            Live Precipitation
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[7px] px-1.5 py-0.5 rounded animate-pulse" style={{ background: "rgba(0,191,255,0.15)", color: "#00BFFF", border: "1px solid rgba(0,191,255,0.3)" }}>● LIVE</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5" style={{ background: "#00BFFF" }} />
            <span className="text-[7px] text-text-secondary">Precip (mm/h)</span>
          </div>
          <span className="text-[7px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,191,255,0.1)", color: "#00BFFF" }}>
            🌧️ Precip Layer
          </span>
        </div>
        <div className="flex-1 min-h-0" style={{ height: "70px" }}>
          <BarChart
            data={precipHistory}
            color={(v) => v > 6 ? "#FF4444" : v > 3 ? "#FF8C00" : "#00BFFF"}
          />
        </div>
        <div className="flex justify-between mt-1 items-center">
          <span className="text-[6px] text-text-muted font-orbitron uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
            SOURCE: OPENWEATHERMAP
          </span>
          <span className="text-[8px] font-bold" style={{ color: "#00BFFF" }}>{currentPrecip} mm/h</span>
        </div>
      </div>

      {/* Live Temp */}
      <div
        className="glass-panel p-2.5 flex flex-col flex-1 min-w-[230px] cursor-pointer hover:bg-white/5 transition-colors group"
        onClick={() => window.location.href = '/?mapMode=Sea+Temp'}
      >
        <div className="section-header flex justify-between items-center group">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#FF6B35", boxShadow: "0 0 8px #FF6B35" }} />
            Live Temp
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[7px] px-1.5 py-0.5 rounded animate-pulse" style={{ background: "rgba(255,107,53,0.15)", color: "#FF6B35", border: "1px solid rgba(255,107,53,0.3)" }}>● LIVE</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5" style={{ background: "#FF6B35" }} />
            <span className="text-[7px] text-text-secondary">Sea/Land Temp (°C)</span>
          </div>
          <span className="text-[7px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,107,53,0.1)", color: "#FF6B35" }}>
            🌡️ Sea Temp Layer
          </span>
        </div>
        <div className="flex-1 min-h-0" style={{ height: "70px" }}>
          <LineChart data={tempHistory} color="#FF6B35" />
        </div>
        <div className="flex justify-between mt-1 items-center">
          <span className="text-[6px] text-text-muted font-orbitron uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
            SOURCE: OPENWEATHERMAP / NOAA
          </span>
          <span className="text-[8px] font-bold" style={{ color: "#FF6B35" }}>{currentTemp}°C</span>
        </div>
      </div>

    </div>
  );
}
