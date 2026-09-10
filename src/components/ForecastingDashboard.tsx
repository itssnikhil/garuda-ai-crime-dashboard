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

export default function ForecastingDashboard({ user }: { user: any }) {
  const [district, setDistrict] = useState('Indore');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [deployedAlertId, setDeployedAlertId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [predRes, foreRes, alertRes] = await Promise.all([
          fetch(`/api/predictions?district=${encodeURIComponent(district)}`, { headers }),
          fetch('/api/forecast', { headers }),
          fetch('/api/alerts', { headers })
        ]);

        if (predRes.ok) setPredictions(await predRes.json());
        if (foreRes.ok) setForecast(await foreRes.json());
        if (alertRes.ok) setAlerts(await alertRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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
      <div className="flex-1 flex items-center justify-center bg-[#07090e]">
        <div className="text-blue-500 flex flex-col items-center gap-2">
          <span className="material-symbols-outlined animate-spin text-4xl">sync</span>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Computing MP Spatial Crime Projections...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#07090e] p-6 overflow-y-auto text-slate-200">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-xl">trending_up</span>
            <h2 className="text-base font-bold uppercase tracking-widest text-white">GARUDA-AI Predictive Forecasting • MP Zone</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Machine Learning ARIMA + Spatial DBSCAN Pattern Projections for Madhya Pradesh</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs">
          <span className="text-slate-400 uppercase font-bold text-[10px]">MP District:</span>
          <select 
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
          >
            {[
              'Indore', 'Bhopal', 'Ujjain', 'Dewas', 'Gwalior', 'Jabalpur', 
              'Dhar', 'Ratlam', 'Khargone', 'Sagar', 'Rewa', 'Satna'
            ].map(d => (
              <option key={d} value={d} className="bg-slate-900">{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Timeline Forecast Matrix */}
        <div className="col-span-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Multi-Horizon Incident Projections ({district} Jurisdiction)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 7 Days */}
            <div className="p-5 bg-[#0b0e15] border border-slate-800 rounded-xl relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Horizon: 7 Days</p>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-white">{forecast ? forecast.next7Days.incidents : '--'}</span>
                <span className="text-xs font-mono font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/50">
                  {forecast ? forecast.next7Days.trend : '--'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Predicted Incidents</p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Threat Index</span>
                <span className="font-bold text-red-400 uppercase tracking-wider">{forecast?.next7Days.risk}</span>
              </div>
            </div>

            {/* 30 Days */}
            <div className="p-5 bg-[#0b0e15] border border-slate-800 rounded-xl relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Horizon: 30 Days</p>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-white">{forecast ? forecast.next30Days.incidents : '--'}</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                  {forecast ? forecast.next30Days.trend : '--'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Monthly Aggregate</p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Threat Index</span>
                <span className="font-bold text-amber-400 uppercase tracking-wider">{forecast?.next30Days.risk}</span>
              </div>
            </div>

            {/* 90 Days */}
            <div className="p-5 bg-[#0b0e15] border border-slate-800 rounded-xl relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Horizon: 90 Days (Quarterly)</p>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-white">{forecast ? forecast.next90Days.incidents : '--'}</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                  {forecast ? forecast.next90Days.trend : '--'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Long-term Trend</p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Threat Index</span>
                <span className="font-bold text-emerald-400 uppercase tracking-wider">{forecast?.next90Days.risk}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed AI Predictions */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-sm">smart_toy</span>
            AI Tactical Warnings & Counter-Measures ({district})
          </h3>

          {predictions.map((pred) => (
            <div key={pred.id} className="p-6 bg-[#0b0e15] border border-slate-800 rounded-xl shadow-lg relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold rounded">
                    {pred.id}
                  </span>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{pred.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">Confidence:</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded text-xs font-bold font-mono">
                    {pred.confidenceScore}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">{pred.prediction}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Key Evidence Vectors</span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                    {pred.evidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Contributing Dynamics</span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                    {pred.topContributingFactors.map((fac, i) => (
                      <li key={i}>{fac}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-[240px]">
                  <span className="text-[10px] uppercase font-bold text-blue-400 block mb-0.5">Recommended Counter-Measure</span>
                  <p className="text-xs text-slate-300 italic">{pred.recommendedAction}</p>
                </div>
                <button 
                  onClick={() => handleDeployPatrol(pred.id)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">local_police</span>
                  {deployedAlertId === pred.id ? "Patrol Units Dispatched!" : "Deploy Targeted Cheetah Unit"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Threat Alerts Side Stream */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Real-time Threat Intercepts (MP Police)
          </h3>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-[#0b0e15] border border-slate-800 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    alert.level === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    alert.level === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {alert.level}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{alert.time}</span>
                </div>
                <h5 className="text-xs font-bold text-white mb-1">{alert.title}</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
