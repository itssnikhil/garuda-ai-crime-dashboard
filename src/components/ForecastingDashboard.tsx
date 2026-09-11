import React, { useEffect, useState } from 'react';

interface Prediction {
  id: string;
  title: string;
  prediction: string;
  confidenceScore: number;
  evidence: string[];
  historicalComparison: string;
  topContributingFactors: string[];
  recommendedAction: string;
}

interface Forecast {
  next7Days: { incidents: number; trend: string; risk: string };
  next30Days: { incidents: number; trend: string; risk: string };
  next90Days: { incidents: number; trend: string; risk: string };
}

interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  level: string;
}

const DEFAULT_PREDICTIONS: Prediction[] = [
  {
    id: 'PRED-1',
    title: 'Organized Vehicle Hijacking & Robbery Cluster (Indore)',
    prediction: 'Increased luxury SUV and commercial logistics hijacking forecast along AB Road & Indore Bypass corridor',
    confidenceScore: 92,
    evidence: [
      '3 commercial transport thefts reported in 7 days near Dewas-Indore bypass',
      'Known syndicate vehicle MP-09-CB-4592 spotted on Manglia toll ANPR'
    ],
    historicalComparison: '+42% surge compared to previous festive quarter',
    topContributingFactors: [
      'High-density freight movement towards Pithampur SEZ',
      'Repeat offenders on conditional bail operating along Malwa highway'
    ],
    recommendedAction: 'Deploy armed QRT checkpoints at Manglia, Rau Circle, and Lasudia bypass corridors from 23:00 to 04:30.'
  },
  {
    id: 'PRED-2',
    title: 'Commercial Night Burglary Threat (Sarafa & Rajwada)',
    prediction: 'High probability of coordinated shop-breaking targeting jewelry and bullion depots in Indore heritage core',
    confidenceScore: 86,
    evidence: [
      'Unregistered drones spotted reconnoitering Sarafa Bazaar after 02:00 AM',
      'Recurrence pattern matching unsolved FIR #882'
    ],
    historicalComparison: 'Consistent with festive gold purchase surge cycles',
    topContributingFactors: [
      'High cash volumes in night street markets',
      'Narrow alleyways with blind spots behind heritage structures'
    ],
    recommendedAction: 'Mandate foot patrols with thermal night-vision gear and link Sarafa CCTV feeds directly to Indore Commissionerate Command Center.'
  }
];

const DEFAULT_FORECAST: Forecast = {
  next7Days: { incidents: 48, trend: '+7.4%', risk: 'High' },
  next30Days: { incidents: 135, trend: '-3.2%', risk: 'Medium' },
  next90Days: { incidents: 370, trend: '-8.5%', risk: 'Low' }
};

const DEFAULT_ALERTS: Alert[] = [
  {
    id: 'A-101',
    type: 'Abnormal Crime Pattern',
    title: 'Spike in Cyber Extortion & Loan App Fraud',
    description: '320% surge in instant loan blackmail and phishing intercepts across Indore (Vijay Nagar & Palasia zones) over the last 48 hours.',
    time: '08m ago',
    level: 'Critical'
  },
  {
    id: 'A-102',
    type: 'Repeat Offender Detected',
    title: 'Safe City ANPR & Facial Match',
    description: 'Suspect S1 (Ravi Kumar) flagged by Indore Smart City Safe City AI camera near Rajwada-Sarafa junction.',
    time: '34m ago',
    level: 'High'
  },
  {
    id: 'A-103',
    type: 'Inter-District Syndicate Movement',
    title: 'Dewas Bypass / AB Road Intercept',
    description: 'Black Scorpio (MP-09-CB-4592) linked to armed robbery crossed Manglia Toll Plaza towards Indore city center.',
    time: '1h 15m ago',
    level: 'High'
  }
];

export default function ForecastingDashboard({ user }: { user: any }) {
  const [district, setDistrict] = useState('Indore');
  const [predictions, setPredictions] = useState<Prediction[]>(DEFAULT_PREDICTIONS);
  const [forecast, setForecast] = useState<Forecast>(DEFAULT_FORECAST);
  const [alerts, setAlerts] = useState<Alert[]>(DEFAULT_ALERTS);
  const [loading, setLoading] = useState(false);
  const [deployedAlertId, setDeployedAlertId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [predRes, foreRes, alertRes] = await Promise.all([
          fetch(`/api/predictions?district=${encodeURIComponent(district)}`, { headers }),
          fetch(`/api/forecast?district=${encodeURIComponent(district)}`, { headers }),
          fetch(`/api/alerts?district=${encodeURIComponent(district)}`, { headers })
        ]);

        if (predRes.ok) {
          const p = await predRes.json();
          if (Array.isArray(p) && p.length > 0) setPredictions(p);
        }
        if (foreRes.ok) {
          const f = await foreRes.json();
          if (f && f.next7Days) setForecast(f);
        }
        if (alertRes.ok) {
          const a = await alertRes.json();
          if (Array.isArray(a) && a.length > 0) setAlerts(a);
        }
      } catch (err) {
        console.warn('Forecasting API sync Notice:', err);
      }
    };
    fetchData();
  }, [user, district]);

  const handleDeployPatrol = (predId: string) => {
    setDeployedAlertId(predId);
    setTimeout(() => setDeployedAlertId(null), 3500);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black select-none">
        <div className="text-[#E1306C] flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full ig-border-ring flex items-center justify-center animate-spin">
            <div className="w-8 h-8 bg-black rounded-full"></div>
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Computing Spatial Crime Projections...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-black p-6 overflow-y-auto text-neutral-100 select-none">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4 pb-4 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#E1306C] text-xl">trending_up</span>
            <h2 className="text-sm font-bold uppercase tracking-wide text-white">GARUDA-AI Predictive Forecasting • MP Zone</h2>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">Machine Learning ARIMA + Spatial DBSCAN Pattern Projections for Madhya Pradesh</p>
        </div>

        <div className="flex items-center gap-2 bg-[#181818] border border-[#262626] rounded-xl px-3 py-1.5 text-xs">
          <span className="text-neutral-500 uppercase font-semibold text-[10px]">MP District:</span>
          <select 
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
          >
            {[
              'Indore', 'Bhopal', 'Ujjain', 'Dewas', 'Gwalior', 'Jabalpur', 
              'Dhar', 'Ratlam', 'Khargone', 'Sagar', 'Rewa', 'Satna'
            ].map(d => (
              <option key={d} value={d} className="bg-[#181818]">{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Timeline Forecast Matrix */}
        <div className="col-span-12">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E1306C]"></span>
            Multi-Horizon Incident Projections ({district} Jurisdiction)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 7 Days */}
            <div className="p-5 bg-[#121212] border border-[#262626] rounded-2xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E1306C]/5 rounded-full blur-xl pointer-events-none"></div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Horizon: 7 Days</p>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-white tracking-tight">{forecast?.next7Days?.incidents ?? 48}</span>
                <span className="text-xs font-mono font-bold text-[#E1306C] bg-[#251016] px-2.5 py-0.5 rounded-full border border-[#dc2743]/30">
                  {forecast?.next7Days?.trend ?? '+7.4%'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">Predicted Incidents</p>
              <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between text-xs">
                <span className="text-neutral-500">Threat Index</span>
                <span className="font-semibold text-[#E1306C] uppercase tracking-wider">{forecast?.next7Days?.risk ?? 'High'}</span>
              </div>
            </div>

            {/* 30 Days */}
            <div className="p-5 bg-[#121212] border border-[#262626] rounded-2xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/5 rounded-full blur-xl pointer-events-none"></div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Horizon: 30 Days</p>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-white tracking-tight">{forecast?.next30Days?.incidents ?? 135}</span>
                <span className="text-xs font-mono font-bold text-[#F59E0B] bg-[#2e1d0d] px-2.5 py-0.5 rounded-full border border-[#F59E0B]/30">
                  {forecast?.next30Days?.trend ?? '-3.2%'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">Monthly Aggregate</p>
              <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between text-xs">
                <span className="text-neutral-500">Threat Index</span>
                <span className="font-semibold text-[#F59E0B] uppercase tracking-wider">{forecast?.next30Days?.risk ?? 'Medium'}</span>
              </div>
            </div>

            {/* 90 Days */}
            <div className="p-5 bg-[#121212] border border-[#262626] rounded-2xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#0095F6]/5 rounded-full blur-xl pointer-events-none"></div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Horizon: 90 Days (Quarterly)</p>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-white tracking-tight">{forecast?.next90Days?.incidents ?? 370}</span>
                <span className="text-xs font-mono font-bold text-[#0095F6] bg-[#142334] px-2.5 py-0.5 rounded-full border border-[#0095F6]/30">
                  {forecast?.next90Days?.trend ?? '-8.5%'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">Long-term Trend</p>
              <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between text-xs">
                <span className="text-neutral-500">Threat Index</span>
                <span className="font-semibold text-[#0095F6] uppercase tracking-wider">{forecast?.next90Days?.risk ?? 'Low'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed AI Predictions */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0095F6] text-sm">smart_toy</span>
            AI Tactical Warnings & Counter-Measures ({district})
          </h3>

          {predictions.map((pred) => (
            <div key={pred.id} className="p-6 bg-[#121212] border border-[#262626] rounded-2xl shadow-sm relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262626] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 bg-[#181818] text-[#E1306C] border border-[#dc2743]/30 text-xs font-mono font-bold rounded-full">
                    {pred.id}
                  </span>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">{pred.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-neutral-400">Confidence:</span>
                  <span className="px-2.5 py-0.5 bg-[#181818] border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold font-mono">
                    {pred.confidenceScore}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed mb-4">{pred.prediction}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 bg-[#181818] rounded-xl border border-[#262626]">
                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Key Evidence Vectors</span>
                  <ul className="text-xs text-neutral-300 space-y-1 list-disc pl-4">
                    {pred.evidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Contributing Dynamics</span>
                  <ul className="text-xs text-neutral-300 space-y-1 list-disc pl-4">
                    {pred.topContributingFactors.map((fac, i) => (
                      <li key={i}>{fac}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#262626] flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-[240px]">
                  <span className="text-[10px] uppercase font-semibold text-[#0095F6] block mb-0.5">Recommended Counter-Measure</span>
                  <p className="text-xs text-neutral-300 italic">{pred.recommendedAction}</p>
                </div>
                <button 
                  onClick={() => handleDeployPatrol(pred.id)}
                  className="px-4 py-2 ig-gradient hover:opacity-95 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">local_police</span>
                  {deployedAlertId === pred.id ? "Patrol Units Dispatched!" : "Deploy Cheetah Unit"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Threat Alerts Side Stream */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E1306C] animate-pulse"></span>
            Real-time Threat Intercepts (MP Police)
          </h3>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-[#121212] border border-[#262626] rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                    alert.level === 'Critical' ? 'bg-[#251016] text-[#E1306C] border border-[#dc2743]/30' :
                    alert.level === 'High' ? 'bg-[#2e1d0d] text-[#F59E0B] border border-[#F59E0B]/30' :
                    'bg-[#142334] text-[#0095F6] border border-[#0095F6]/30'
                  }`}>
                    {alert.level}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">{alert.time}</span>
                </div>
                <h5 className="text-xs font-bold text-white mb-1">{alert.title}</h5>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
