"use client";
import { useEffect, useRef, useState } from "react";

// TILE LAYERS
const TILE_LAYERS = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri",
    label: "🛰 Satellite",
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap & CARTO",
    label: "🌐 Intel Dark",
  },
  hybrid: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    attribution: "Labels &copy; Esri",
    label: "🔭 Hybrid",
  },
};

// Map color codes to hex for leaflet
const COLOR_MAP: Record<string, string> = {
  "red": "#FF2244",           // Wars, attacks
  "green": "#00FF88",         // Positive global news
  "orange": "#FF8C00",        // India domestic (terror/riot/disaster)
  "yellow-orange": "#FFD700", // Upcoming issues/floods
  "light-blue": "#00D4FF"     // Good news nationwide/economy
};

const filterOptions = ["All News Nodes", "Critical (Red)", "Warnings (Orange)", "Positive (Green)", "Economy (Blue)"];
const mapModes = ["Standard", "Satellite Clouds 🛰️", "Live Precip 🌧️", "Live Ships 🚢", "Sea Temp 🌡️"];

interface MapCenterProps {
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

export default function MapCenter({ isMaximized = false, onToggleMaximize }: MapCenterProps) {
  const mapRef = useRef<any>(null);
  
  // Base layers
  const tileLayerRef = useRef<any>(null);
  const satLabelLayerRef = useRef<any>(null);
  
  // Overlay mode layer (clouds/weather/ships)
  const modeOverlayLayerRef = useRef<any>(null);
  const modeRefLayerRef = useRef<any>(null); // Reference borders for satellite mode

  // Markers groups
  const markersGroupRef = useRef<any>(null);
  
  // State
  const [activeFilter, setActiveFilter] = useState("All News Nodes");
  const [currentMode, setCurrentMode] = useState("Standard");
  const [activeLayer, setActiveLayer] = useState<keyof typeof TILE_LAYERS>("satellite");
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newsMarkers, setNewsMarkers] = useState<any[]>([]);
  const [conflictMarkers, setConflictMarkers] = useState<any[]>([]);
  const [liveShips, setLiveShips] = useState<any[]>([]);
  const conflictGroupRef = useRef<any>(null);
  const shipsGroupRef = useRef<any>(null);

  // Fetch live news from API
  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNewsMarkers(data))
      .catch(console.error);
  }, []);

  // Poll live ships if mode is active
  useEffect(() => {
    if (currentMode !== "Live Ships 🚢") {
      setLiveShips([]); // Clear ships if not in ship mode
      // Fetch news and conflict data once when mode changes away from "Live Ships" or on initial load
      fetch('/api/news').then(res => res.json()).then(setNewsMarkers).catch(console.error);
      fetch('/api/conflict').then(res => res.json()).then(setConflictMarkers).catch(console.error);
      return;
    }
    
    // If in "Live Ships" mode, poll for ships and conflict
    // User Request: Force map to Intel Dark mode when Ships layer is activated
    if (activeLayer !== 'dark') {
      setActiveLayer('dark');
      switchLayer('dark'); // Call the switch function to apply immediately
    }

    const fetchConflict = () => {
      fetch('/api/conflict').then(res => res.json()).then(setConflictMarkers).catch(console.error);
    };
    fetchConflict(); // Initial fetch

    const fetchShips = () => {
      fetch('/api/ships').then(res => res.json()).then(setLiveShips).catch(console.error);
    };
    fetchShips(); // Initial fetch

    const interval = setInterval(() => {
      fetchShips();
      fetchConflict();
    }, 5000); // 5-second live ping for ships and conflict
    return () => clearInterval(interval);
  }, [currentMode, refreshKey]);

  // Initialize Maps
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    let mapInstance: any = null;

    import("leaflet").then((L) => {
      const container = document.getElementById("nexusintel-map");
      if (!container) return;

      // Check if map is already initialized on this container
      // Leaflet attaches a _leaflet_id to the container
      if ((container as any)._leaflet_id) {
        return;
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(container, {
        center: [25, 18],
        zoom: 3,
        zoomControl: false,
        attributionControl: true,
        minZoom: 2,
        maxZoom: 18,
        preferCanvas: true,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);
      map.getContainer().style.background = "#050C1A";

      const tile = L.tileLayer(TILE_LAYERS[activeLayer].url, {
        attribution: TILE_LAYERS[activeLayer].attribution,
        maxZoom: 18,
      }).addTo(map);
      tileLayerRef.current = tile;

      mapRef.current = map;
      mapInstance = map;
      setIsLoaded(true);
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        mapRef.current = null;
      }
    };
  }, [refreshKey]);

  // Build Intelligence Markers (News & Conflict)
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    import("leaflet").then((L) => {
      // Clear previous
      if (markersGroupRef.current) mapRef.current.removeLayer(markersGroupRef.current);
      if (conflictGroupRef.current) mapRef.current.removeLayer(conflictGroupRef.current);

      const nexusGroup = L.layerGroup();
      
      // 1. News Markers
      newsMarkers.forEach((news) => {
        // Filter logic
        if (activeFilter === "Critical (Red)" && news.colorNode !== "red") return;
        if (activeFilter === "Warnings (Orange)" && !["orange", "yellow-orange"].includes(news.colorNode)) return;
        if (activeFilter === "Positive (Green)" && news.colorNode !== "green") return;
        if (activeFilter === "Economy (Blue)" && news.colorNode !== "light-blue") return;

        const color = COLOR_MAP[news.colorNode] || "#00D4FF";
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center; cursor:pointer;">
              <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:transparent;border:2px solid ${color};animation:nexus-pulse 2s ease-out infinite;opacity:0.7;"></div>
              <div style="width:8px;height:8px;border-radius:50%;background:${color};box-shadow:0 0 10px ${color};z-index:10;"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([news.lat, news.lng], { icon });
        const sourceBranding = news.logo ? `<img src="${news.logo}" style="height:12px;width:auto;object-fit:contain;margin-right:6px;" />` : `<div style="width:8px;height:8px;border-radius:50%;background:${color};margin-right:6px;"></div>`;

        marker.bindPopup(`
          <div style="background:rgba(10,15,25,0.98);border:1px solid ${color};border-radius:12px;padding:12px;min-width:260px;color:#E2E8F0;font-family:Inter,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,0.5);backdrop-filter:blur(10px);">
            <div style="display:flex;align-items:center;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">
              ${sourceBranding}
              <strong style="font-family:Orbitron;font-size:10px;color:${color};letter-spacing:1px;text-transform:uppercase;">${news.source}</strong>
            </div>
            <h4 style="font-size:13px;font-weight:800;color:#FFF;margin-bottom:8px;line-height:1.3;">${news.title}</h4>
            <p style="font-size:10.5px;color:#94A3B8;line-height:1.5;margin-bottom:12px;">${news.description}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;">
              <span style="color:#00D4FF;font-weight:bold;">📍 ${news.country}</span>
              <span style="color:#64748B;">${new Date(news.publishedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        `, { className: "nexusintel-popup" });
        nexusGroup.addLayer(marker);
      });

      // 2. Conflict Markers (ACLED Pattern)
      conflictMarkers.forEach((event) => {
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;inset:0;border:1px dashed #FF2244;border-radius:50%;animation:rotate-ring 4s linear infinite;"></div>
              <div style="width:2px;height:14px;background:#FF2244;position:absolute;"></div>
              <div style="width:14px;height:2px;background:#FF2244;position:absolute;"></div>
              <div style="width:4px;height:4px;background:#FF2244;border-radius:50%;box-shadow:0 0 8px #FF2244;"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([event.lat, event.lng], { icon });
        marker.bindPopup(`
          <div style="background:rgba(20,5,5,0.95);border:1px solid #FF2244;border-radius:8px;padding:12px;min-width:240px;color:#FFE;font-family:Inter,sans-serif;">
            <div style="font-family:Orbitron;font-size:9px;color:#FF2244;text-transform:uppercase;margin-bottom:6px;letter-spacing:1px;">
              ⚠️ CONFLICT EVENT: ${event.type}
            </div>
            <div style="font-size:11px;font-weight:bold;margin-bottom:8px;">${event.description}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:9px;color:#A11;border-top:1px solid rgba(255,0,0,0.1);padding-top:8px;">
              <div>ACTOR: <span style="font-weight:bold;">${event.actor1}</span></div>
              <div>FATALITIES: <span style="font-weight:bold;">${event.fatalities}</span></div>
              <div>LOC: <span style="font-weight:bold;">${event.location}</span></div>
              <div>SRC: <span style="font-weight:bold;">${event.source}</span></div>
            </div>
          </div>
        `);
        nexusGroup.addLayer(marker);
      });

      nexusGroup.addTo(mapRef.current);
      markersGroupRef.current = nexusGroup;
    });
  }, [isLoaded, newsMarkers, conflictMarkers, activeFilter, refreshKey]);

  // Build Ship Markers
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    import("leaflet").then((L) => {
      if (shipsGroupRef.current) mapRef.current.removeLayer(shipsGroupRef.current);
      if (liveShips.length === 0) return;

      const shipLayer = L.layerGroup();
      liveShips.forEach((ship) => {
        const color = ship.color || "#00FFCC";
        
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="transform: rotate(${ship.heading}deg); width: 14px; height: 18px; position: relative; filter: drop-shadow(0 0 2px ${color});">
              <svg viewBox="0 0 14 18" style="width: 100%; height: 100%; overflow: visible;">
                <path d="M7 0 L14 18 L7 14 L0 18 Z" fill="white" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>
          `,
          iconSize: [14, 18],
          iconAnchor: [7, 9],
          popupAnchor: [0, -10],
        });

        const marker = L.marker([ship.lat, ship.lng], { icon });
        marker.bindTooltip(`
          <strong style="color:${color};font-family:Orbitron;font-size:11px">${ship.name}</strong><br/>
          <span style="font-size:9px;color:#94A3B8">Type: ${ship.type} | SPD: ${ship.speed}</span><br/>
          <span style="font-size:8px;color:#64748B">HDG: ${ship.heading}°</span>
        `, { className: "nexusintel-tooltip" });

        shipLayer.addLayer(marker);
      });

      shipLayer.addTo(mapRef.current);
      shipsGroupRef.current = shipLayer;
    });
  }, [liveShips, isLoaded]);

  // Handle Mode Overlays (Clouds/Weather/Ships)
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    const getGibsDate = () => {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - 1);
      return date.toISOString().split('T')[0];
    };

    import("leaflet").then((L) => {
      if (modeOverlayLayerRef.current) mapRef.current.removeLayer(modeOverlayLayerRef.current);
      if (modeRefLayerRef.current) mapRef.current.removeLayer(modeRefLayerRef.current);

      if (currentMode === "Standard") return;

      if (currentMode === "Live Ships 🚢") {
        modeOverlayLayerRef.current = L.tileLayer("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", {
          opacity: 0.8,
          zIndex: 10
        }).addTo(mapRef.current);
        return;
      }

      if (currentMode === "Sea Temp 🌡️") {
        // Fallback to open weather layers using openmeteo or similar free providers if available, or a public NOAA layer
        modeOverlayLayerRef.current = L.tileLayer('https://{s}.tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=93450e181d11b1fc8fe0d15e21fb5c57', { // Publicly available dev key for demo UI
          opacity: 0.6,
          zIndex: 10,
          subdomains: ['a', 'b', 'c']
        }).addTo(mapRef.current);
        return;
      }

      if (currentMode === "Satellite Clouds 🛰️") {
        // Using a 2-day-old date ensures the global mosaic is 100% complete with no processing gaps
        const getMosaicedDate = () => {
          const date = new Date();
          date.setUTCDate(date.getUTCDate() - 2);
          return date.toISOString().split('T')[0];
        };
        const mosaicDate = getMosaicedDate();

        // VIIRS SNPP has a broader swath (3000km) than MODIS, leaving almost no stripes
        const viirsUrl = `https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${mosaicDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;
        
        // We create a group to overlay both VIIRS and a fallback to fill any tiny remaining gaps
        const cloudsLayer = L.tileLayer(viirsUrl, {
          subdomains: ['a', 'b', 'c'],
          attribution: "&copy; NASA GIBS / VIIRS",
          opacity: 1.0,
          zIndex: 5
        });

        // Add an additional layer for MODIS Aqua as a backfill for the equator if needed
        const aquaUrl = `https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_CorrectedReflectance_TrueColor/default/${mosaicDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;
        const aquaLayer = L.tileLayer(aquaUrl, {
          subdomains: ['a', 'b', 'c'],
          opacity: 0.5, // Blend it in
          zIndex: 4
        });

        const layerGroup = L.layerGroup([aquaLayer, cloudsLayer]).addTo(mapRef.current);
        modeOverlayLayerRef.current = layerGroup;

        modeRefLayerRef.current = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
          opacity: 0.8,
          zIndex: 15
        }).addTo(mapRef.current);
        return;
      }

      if (currentMode === "Live Precip 🌧️") {
        // Use a public dev key for Rainviewer or OpenWeatherMap for demo UI
        modeOverlayLayerRef.current = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=93450e181d11b1fc8fe0d15e21fb5c57`, {
          opacity: 0.8,
          zIndex: 10
        }).addTo(mapRef.current);
      }
    });
  }, [currentMode, isLoaded]);

  // Switch base layer
  const switchLayer = (key: keyof typeof TILE_LAYERS) => {
    setActiveLayer(key);
    if (!mapRef.current) return;
    import("leaflet").then((L) => {
      if (tileLayerRef.current) mapRef.current.removeLayer(tileLayerRef.current);
      if (satLabelLayerRef.current) mapRef.current.removeLayer(satLabelLayerRef.current);

      const newTile = L.tileLayer(TILE_LAYERS[key].url, {
        attribution: TILE_LAYERS[key].attribution,
        maxZoom: 18,
      }).addTo(mapRef.current);
      tileLayerRef.current = newTile;

      if (key === "satellite") {
        const labelTile = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          { opacity: 0.7 }
        ).addTo(mapRef.current);
        satLabelLayerRef.current = labelTile;
      }
    });
  };

  return (
    <div className="glass-panel flex flex-col overflow-hidden h-full relative">
      {/* Controls row top */}
      <div className="flex flex-col border-b border-white/5 shrink-0 z-10 relative bg-black/40 backdrop-blur-md">
        
        {/* Top Header & Base Maps */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5">
          <div className="section-header mb-0 flex items-center gap-3" style={{ margin: 0, border: "none", padding: 0 }}>
            <div className="flex items-center">
              <span className="animate-blink text-neon-blue mr-1">●</span> 
              <span>Real-Time Global Intel Map</span>
              {currentMode !== "Standard" && (
                <span className="ml-3 px-1.5 py-0.5 rounded-sm bg-neon-green/10 border border-neon-green/30 text-[8px] text-neon-green uppercase font-bold tracking-widest animate-pulse">
                  {currentMode} ACTIVE
                </span>
              )}
            </div>
            
            {onToggleMaximize && (
              <div className="flex gap-2">
                <button
                  onClick={() => setRefreshKey(prev => prev + 1)}
                  className="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue text-[8px] font-bold px-2 py-1 rounded border border-neon-blue/40 flex items-center gap-1 transition-all"
                  title="Force Reload Map Nodes & Layers"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                  RELOAD INTEL
                </button>
                <button
                  onClick={onToggleMaximize}
                  className="bg-white/10 hover:bg-white/20 text-white text-[8px] font-bold px-2 py-1 rounded border border-white/20 flex items-center gap-1 transition-all"
                  title={isMaximized ? "Restore Default View" : "Maximize Map"}
                >
                  {isMaximized ? (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
                      RESTORE
                    </>
                  ) : (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                      MAXIMIZE
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="flex rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            {(Object.entries(TILE_LAYERS) as [keyof typeof TILE_LAYERS, typeof TILE_LAYERS[keyof typeof TILE_LAYERS]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => switchLayer(key)}
                className="text-[7px] px-2 py-1 font-bold uppercase tracking-wider transition-all"
                style={{
                  background: activeLayer === key ? "rgba(0,212,255,0.15)" : "transparent",
                  color: activeLayer === key ? "#00D4FF" : "#94A3B8",
                  borderRight: key !== "hybrid" ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Modes */}
        <div className="flex items-center justify-between px-3 py-1.5">
          {/* News Markers Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[7.5px] text-white/50 font-bold uppercase tracking-widest">News Node Filter:</span>
            <div className="relative">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="appearance-none bg-black/60 text-[#00D4FF] text-[8.5px] font-bold uppercase tracking-wider border border-white/10 rounded px-2.5 py-1 pr-7 cursor-pointer outline-none hover:border-[#00D4FF]/50 focus:border-[#00D4FF] transition-all"
                style={{ boxShadow: '0 0 10px rgba(0,212,255,0.05)' }}
              >
                {filterOptions.map((f) => {
                  return (
                    <option key={f} value={f} className="bg-[#0B101A] text-white py-1">
                      {f}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-[#00D4FF]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Map Modes */}
          <div className="flex items-center gap-2">
            <span className="text-[7.5px] text-white/50 font-bold uppercase tracking-widest">Map Layer Mode:</span>
            <div className="relative">
              <select
                value={currentMode}
                onChange={(e) => setCurrentMode(e.target.value)}
                className="appearance-none bg-black/60 text-[#8B5CF6] text-[8.5px] font-bold uppercase tracking-wider border border-white/10 rounded px-2.5 py-1 pr-7 cursor-pointer outline-none hover:border-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                style={{ boxShadow: '0 0 10px rgba(139,92,246,0.05)' }}
              >
                {mapModes.map((m) => (
                  <option key={m} value={m} className="bg-[#0B101A] text-white py-1">
                    {m}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-[#8B5CF6]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative overflow-hidden">
        <div id="nexusintel-map" style={{ width: "100%", height: "100%", background: "#050C1A" }} />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-2 z-20 glass-panel p-2 text-[8px] space-y-1 pointer-events-none">
          <div className="text-text-secondary font-bold uppercase tracking-wider mb-1">Node Intel Legend</div>
          {[
            { dot: "#FF2244", label: "War / Assault / Critical" },
            { dot: "#FF8C00", label: "Domestic Riots / Terror" },
            { dot: "#FFD700", label: "Upcoming Floods / Risk" },
            { dot: "#00FF88", label: "Global Peace / Treaties" },
            { dot: "#00D4FF", label: "National Biz / Infrastructure" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: l.dot, boxShadow: `0 0 4px ${l.dot}` }} />
              <span className="text-text-secondary">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Temperature Legend */}
        {currentMode === "Sea Temp 🌡️" && (
          <div className="absolute bottom-4 right-4 z-20 flex rounded-md overflow-hidden text-[10px] font-bold text-white shadow-lg pointer-events-none" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="px-2 py-1" style={{ background: '#71255e' }}>-30</div>
            <div className="px-2 py-1" style={{ background: '#5d1c81' }}>-20</div>
            <div className="px-2 py-1" style={{ background: '#383296' }}>-10</div>
            <div className="px-2 py-1" style={{ background: '#458bdc' }}>0</div>
            <div className="px-2 py-1" style={{ background: '#74bfb4' }}>10</div>
            <div className="px-2 py-1" style={{ background: '#b1d164' }}>20</div>
            <div className="px-2 py-1" style={{ background: '#f5c64f' }}>25</div>
            <div className="px-2 py-1" style={{ background: '#eb6c2f' }}>30</div>
            <div className="px-2 py-1" style={{ background: '#c81c1c' }}>40</div>
            <div className="px-2 py-1" style={{ background: '#64041e' }}>50</div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css');

        @keyframes nexus-pulse {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        #nexusintel-map .leaflet-container {
          background: #050C1A !important;
          font-family: 'Inter', sans-serif;
        }

        #nexusintel-map .leaflet-control-zoom {
          border: 1px solid rgba(0,212,255,0.25) !important;
          background: rgba(15,22,40,0.85) !important;
          border-radius: 6px !important;
          backdrop-filter: blur(8px);
        }
        #nexusintel-map .leaflet-control-zoom a {
          color: #00D4FF !important;
          background: transparent !important;
          border-color: rgba(0,212,255,0.2) !important;
          font-size: 16px !important;
        }
        #nexusintel-map .leaflet-control-zoom a:hover {
          background: rgba(0,212,255,0.1) !important;
        }

        #nexusintel-map .leaflet-control-attribution {
          background: rgba(11,15,25,0.7) !important;
          color: #475569 !important;
          font-size: 7px !important;
          backdrop-filter: blur(4px);
        }
        #nexusintel-map .leaflet-control-attribution a {
          color: #00D4FF !important;
        }

        .nexusintel-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .nexusintel-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .nexusintel-popup .leaflet-popup-tip-container {
          display: none !important;
        }
        .nexusintel-popup .leaflet-popup-close-button {
          color: #00D4FF !important;
          top: 6px !important;
          right: 10px !important;
          font-size: 16px !important;
        }
        
        /* Custom select styling for map filters */
        select option {
          background: #0B101A;
          color: #E2E8F0;
          font-weight: 600;
          padding: 8px;
        }
        select option:hover, select option:checked {
          background: rgba(0,212,255,0.15) !important;
          color: #00D4FF !important;
        }
      `}</style>
    </div>
  );
}
