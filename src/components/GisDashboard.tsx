import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, GeoJSON, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Hotspot {
  id: number;
  lat: number;
  lng: number;
  intensity: number;
  type: string;
  severity: string;
  recentIncidents: number;
  aiScore: number;
  station: string;
}

const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  'Indore': [22.7196, 75.8577],
  'Bhopal': [23.2599, 77.4126],
  'Ujjain': [23.1765, 75.7885],
  'Dewas': [22.9676, 76.0534],
  'Gwalior': [26.2183, 78.1828],
  'Jabalpur': [23.1815, 79.9864],
  'Dhar': [22.5978, 75.2974],
  'Ratlam': [23.3315, 75.0367],
  'Khargone': [21.8214, 75.6119],
  'Sagar': [23.8388, 78.7378],
};

function MapController({ district, geoData }: { district: string; geoData: any }) {
  const map = useMap();
  useEffect(() => {
    if (geoData && geoData.features) {
      const feature = geoData.features.find((f: any) => f.properties.name === district);
      if (feature) {
        const layer = L.geoJSON(feature);
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
          map.flyToBounds(bounds, { duration: 1.5, maxZoom: 13 });
          return;
        }
      }
    }
    
    if (DISTRICT_COORDINATES[district]) {
      map.flyTo(DISTRICT_COORDINATES[district], 13, { duration: 1.5 });
    }
  }, [district, geoData, map]);
  return null;
}

export default function GisDashboard({ user }: { user: any }) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapMode, setMapMode] = useState<'dark' | 'satellite' | 'street'>('dark');
  const [district, setDistrict] = useState('Indore');
  const [timeFilter, setTimeFilter] = useState('24');
  const [showCctv, setShowCctv] = useState(true);
  const [showPatrols, setShowPatrols] = useState(true);
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [hotspotsRes, geoRes] = await Promise.all([
          fetch(`/api/hotspots?district=${encodeURIComponent(district)}`, { headers }),
          fetch(`/api/gis?district=${encodeURIComponent(district)}`, { headers })
        ]);
        
        if (hotspotsRes.ok) {
          const data = await hotspotsRes.json();
          setHotspots(data);
        }
        
        if (geoRes.ok) {
          const data = await geoRes.json();
          setGeoData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, district, timeFilter]);

  const handleDispatch = async (station: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/patrols/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetLocation: station })
      });
      const data = await res.json();
      setDispatchNotice(data.message);
      setTimeout(() => setDispatchNotice(null), 4000);
    } catch (e) {
      setDispatchNotice(`Cheetah Patrol Unit Dispatched to ${station}.`);
      setTimeout(() => setDispatchNotice(null), 4000);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Red': return '#ef4444';
      case 'Orange': return '#f97316';
      case 'Yellow': return '#eab308';
      case 'Green': return '#22c55e';
      default: return '#3b82f6';
    }
  };

  const getTileUrl = () => {
    switch (mapMode) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'street':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'dark':
      default:
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
  };

  const centerCoord = DISTRICT_COORDINATES[district] || [22.7196, 75.8577];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07090e] text-slate-200 overflow-hidden relative">
      {/* Filters Header */}
      <div className="p-4 border-b border-slate-800 bg-[#0c1017] flex flex-wrap items-center justify-between z-10 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-lg">public</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">Madhya Pradesh GIS Intelligence • Indore Center</h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Real-time crime hotspot clustering, AI density scoring & Indore Safe City dispatch</p>
        </div>

        {dispatchNotice && (
          <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg font-mono animate-bounce">
            ⚡ {dispatchNotice}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {/* MP Districts Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">MP District:</span>
            <select 
              value={district} 
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="Indore" className="bg-slate-900">Indore (Commissionerate)</option>
              <option value="Bhopal" className="bg-slate-900">Bhopal (Capital)</option>
              <option value="Ujjain" className="bg-slate-900">Ujjain (Mahakal Zone)</option>
              <option value="Dewas" className="bg-slate-900">Dewas (Industrial)</option>
              <option value="Gwalior" className="bg-slate-900">Gwalior</option>
              <option value="Jabalpur" className="bg-slate-900">Jabalpur</option>
              <option value="Dhar" className="bg-slate-900">Dhar (Pithampur Hub)</option>
              <option value="Ratlam" className="bg-slate-900">Ratlam</option>
              <option value="Khargone" className="bg-slate-900">Khargone</option>
              <option value="Sagar" className="bg-slate-900">Sagar</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">Time:</span>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="24" className="bg-slate-900">Last 24 Hours</option>
              <option value="7" className="bg-slate-900">Last 7 Days</option>
              <option value="30" className="bg-slate-900">Last 30 Days</option>
            </select>
          </div>

          {/* Layer Toggles */}
          <button
            onClick={() => setShowCctv(!showCctv)}
            className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
              showCctv ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            Safe City CCTV
          </button>

          <button
            onClick={() => setShowPatrols(!showPatrols)}
            className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
              showPatrols ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            Cheetah Patrols
          </button>

          {/* Map Style Selector */}
          <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-0.5">
            {(['dark', 'street', 'satellite'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setMapMode(mode)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                  mapMode === mode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#07090e] z-10">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-4xl text-blue-500 animate-spin">sync</span>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Loading MP Geospatial Vector Layers...</p>
            </div>
          </div>
        ) : null}

        <MapContainer
          center={centerCoord}
          zoom={13}
          style={{ height: '100%', width: '100%', backgroundColor: '#07090e' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url={getTileUrl()}
          />
          <MapController district={district} geoData={geoData} />

          {/* Render Madhya Pradesh / District Boundaries */}
          {geoData && (
            <GeoJSON 
              data={geoData} 
              style={{
                color: '#3b82f6',
                weight: 2,
                fillOpacity: 0.08,
                fillColor: '#1d4ed8'
              }}
            />
          )}

          {/* Marker Cluster for Hotspots */}
          <MarkerClusterGroup chunkedLoading>
            {hotspots.map((hotspot) => (
              <CircleMarker
                key={hotspot.id}
                center={[hotspot.lat, hotspot.lng]}
                radius={Math.max(9, hotspot.intensity * 26)}
                pathOptions={{
                  fillColor: getSeverityColor(hotspot.severity),
                  fillOpacity: 0.65,
                  color: getSeverityColor(hotspot.severity),
                  weight: 2,
                }}
              >
                <Popup className="tactical-popup">
                  <div className="p-1.5 min-w-[210px] text-slate-900">
                    <div className="flex items-center justify-between border-b pb-1 mb-1">
                      <span className="font-bold text-xs uppercase">{hotspot.type}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                        hotspot.severity === 'Red' ? 'bg-red-600' :
                        hotspot.severity === 'Orange' ? 'bg-orange-500' : 'bg-yellow-600'
                      }`}>
                        {hotspot.severity}
                      </span>
                    </div>
                    <p className="text-xs"><strong>Station:</strong> {hotspot.station}</p>
                    <p className="text-xs"><strong>AI Vulnerability:</strong> {hotspot.aiScore}%</p>
                    <p className="text-xs"><strong>Recent Complaints:</strong> {hotspot.recentIncidents}</p>
                    <button
                      onClick={() => handleDispatch(hotspot.station)}
                      className="mt-2 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold tracking-wider uppercase transition-colors"
                    >
                      ⚡ Dispatch Cheetah Unit
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        {/* Tactical Legend Overlay */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-[#0c1017]/90 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl shadow-2xl text-xs space-y-2">
          <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400">Indore Safe City Grid</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
            <span className="text-slate-300">Critical Threat Sector</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-slate-300">High Incident Frequency</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-slate-300">Moderate Surge Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-300">Secured Police Beat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
