import React, { useState } from 'react';

interface SuspectDossier {
  id: string;
  code: string;
  name: string;
  alias: string;
  age: number;
  dob: string;
  riskRating: number;
  status: 'Absconding' | 'Under Surveillance' | 'In Custody' | 'On Conditional Bail';
  severity: 'Critical' | 'High' | 'Medium';
  lastLocation: string;
  gangAffiliation: string;
  modusOperandi: string;
  weapons: string[];
  photoUrl: string;
  linkedFirs: string[];
  associates: string[];
  biometrics: {
    dnaProfile: string;
    facialMatchScore: number;
    fingerprintRegistry: string;
  };
  timeline: { time: string; event: string; location: string }[];
}

const DOSSIERS: SuspectDossier[] = [
  {
    id: "S1",
    code: "MP-949-8821",
    name: "Ravi Kumar",
    alias: '"RK", "Bhai"',
    age: 38,
    dob: "14-Aug-1988",
    riskRating: 94,
    status: "Absconding",
    severity: "Critical",
    lastLocation: "Vijay Nagar / AB Road Corridor, Indore",
    gangAffiliation: "Malwa Syndicate (Kingpin)",
    modusOperandi: "Armored bullion transport hijacking, armed jeweler robbery in Sarafa, encrypted VoIP cellular coordination",
    weapons: ["9mm Semi-Automatic Pistol", "RF Signal Jammer"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    linkedFirs: ["FIR #882/2023 (Indore Vijay Nagar)", "FIR #2341/2023 (Cyber Palasia)", "FIR #109/2021 (Sarafa Arms)"],
    associates: ["Vikram Das (S2)", "Priya Sundaram (S3)", "Mohammed Farhan (S4)"],
    biometrics: {
      dnaProfile: "MP-DNA-9942-MATCH",
      facialMatchScore: 98.4,
      fingerprintRegistry: "AFIS-MP-44120-CONFIRMED"
    },
    timeline: [
      { time: "02h ago", event: "ANPR Plate Match MP-09-CB-4592", location: "Manglia Toll Plaza, AB Road" },
      { time: "18h ago", event: "Encrypted Cellular Ping detected", location: "Vijay Nagar Sector C, Indore" },
      { time: "3d ago", event: "Non-Bailable Warrant Issued", location: "Session Court Indore" }
    ]
  },
  {
    id: "S2",
    code: "MP-404-1920",
    name: "Vikram Das",
    alias: '"Shadow404", "Vicky"',
    age: 32,
    dob: "02-Nov-1993",
    riskRating: 82,
    status: "Under Surveillance",
    severity: "High",
    lastLocation: "Palasia / New Palasia, Indore",
    gangAffiliation: "Malwa Syndicate (Cyber Logistics)",
    modusOperandi: "Banking gateway interception, instant loan app extortion, darknet crypto escrow",
    weapons: ["Cyber Payload Suites", "Encrypted Hardware Cold Wallets"],
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    linkedFirs: ["FIR #2341/2023 (Palasia Cyber Cell)", "FIR #781/2024 (Ransomware)"],
    associates: ["Ravi Kumar (S1)", "Priya Sundaram (S3)"],
    biometrics: {
      dnaProfile: "MP-DNA-3011-RECORDED",
      facialMatchScore: 92.1,
      fingerprintRegistry: "AFIS-MP-77192-CONFIRMED"
    },
    timeline: [
      { time: "45m ago", event: "Tor Relay Node flagged by Cyber Cell", location: "IP: 185.220.101.4 (Indore VPN)" },
      { time: "2d ago", event: "ATM Cash Mules transaction detected", location: "Geeta Bhawan Square, Indore" }
    ]
  },
  {
    id: "S3",
    code: "MP-772-5501",
    name: "Priya Sundaram",
    alias: '"Queenpin", "PS"',
    age: 29,
    dob: "19-May-1996",
    riskRating: 68,
    status: "On Conditional Bail",
    severity: "Medium",
    lastLocation: "Bhanwarkuan / Bholaram Ustad Marg",
    gangAffiliation: "Malwa Financial Layering Network",
    modusOperandi: "Hawala cross-district transfers, shell jewelry exports, cash escrow for cartel",
    weapons: ["None on record"],
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    linkedFirs: ["FIR #0455/2024 (Sarafa Money Laundering)", "FIR #882/2023 (Associate)"],
    associates: ["Ravi Kumar (S1)", "Vikram Das (S2)"],
    biometrics: {
      dnaProfile: "MP-DNA-1102-RECORDED",
      facialMatchScore: 96.5,
      fingerprintRegistry: "AFIS-MP-55201-CONFIRMED"
    },
    timeline: [
      { time: "4h ago", event: "Weekly Police Station Check-in completed", location: "Tukoganj Thana, Indore" },
      { time: "1d ago", event: "Flagged luxury vehicle purchase attempt", location: "RTO Indore (Lalbagh)" }
    ]
  },
  {
    id: "S4",
    code: "MP-221-9980",
    name: "Mohammed Farhan",
    alias: '"Fast Tracker", "Farru"',
    age: 35,
    dob: "08-Dec-1990",
    riskRating: 78,
    status: "Absconding",
    severity: "High",
    lastLocation: "Pithampur Industrial Hub / Rau Bypass",
    gangAffiliation: "Inter-District Vehicle Hijacking Consortium",
    modusOperandi: "Luxury SUV key-fob cloning, OBD port hacking, MP plate forgery and chassis re-etching",
    weapons: ["Country-Made Pistol 7.65mm (Katta)", "RF Key Scanner"],
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    linkedFirs: ["FIR #1092/2024 (Rau Bypass Auto Theft)", "FIR #449/2023 (Chassis Tampering)"],
    associates: ["Ravi Kumar (S1)"],
    biometrics: {
      dnaProfile: "MP-DNA-8891-RECORDED",
      facialMatchScore: 94.7,
      fingerprintRegistry: "AFIS-MP-11942-CONFIRMED"
    },
    timeline: [
      { time: "1h ago", event: "Toll FastTag Blacklist triggered", location: "Rau Bypass Tollway" },
      { time: "6h ago", event: "Stolen Toyota Fortuner spotted en route to Dhar", location: "Indore-Ahmedabad Highway" }
    ]
  }
];

export default function OffenderProfile({ user }: { user: any }) {
  const [selectedId, setSelectedId] = useState<string>("S1");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [bAlertSent, setBAlertSent] = useState(false);

  const filteredDossiers = DOSSIERS.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === "All" || d.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const current = DOSSIERS.find(d => d.id === selectedId) || DOSSIERS[0];

  const handleIssueBolo = () => {
    setBAlertSent(true);
    setTimeout(() => setBAlertSent(false), 3500);
  };

  return (
    <div className="flex-1 bg-[#07090e] text-slate-200 overflow-y-auto flex flex-col">
      {/* Top Banner */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#0c1017] flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-xl">badge</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">Madhya Pradesh Police • Offender Dossier Matrix</h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Indore Police Commissionerate & MP AFIS Biometric Criminal Database</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleIssueBolo}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-red-600/20 border border-red-500/40 hover:bg-red-600 text-red-300 hover:text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            {bAlertSent ? "State-wide BOLO Alert Broadcasted!" : "Broadcast MP Police BOLO"}
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full grid grid-cols-12 gap-6">
        {/* Left Column: Suspect Selector List */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#0b0e15] border border-slate-800/80 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
              <input
                type="text"
                placeholder="Search suspect, alias, MP code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-1.5 pb-2">
              {['All', 'Critical', 'High', 'Medium'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    filterSeverity === sev 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="space-y-2 mt-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredDossiers.map(dossier => {
                const isSelected = dossier.id === current.id;
                return (
                  <div
                    key={dossier.id}
                    onClick={() => setSelectedId(dossier.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected 
                        ? 'bg-blue-950/40 border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                    }`}
                  >
                    <img 
                      src={dossier.photoUrl} 
                      alt={dossier.name} 
                      className="w-11 h-11 rounded-lg object-cover border border-slate-700 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{dossier.name}</h4>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          dossier.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          dossier.severity === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          Risk: {dossier.riskRating}%
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{dossier.alias}</p>
                      <p className="text-[9px] font-mono text-slate-500 mt-0.5">{dossier.code} • {dossier.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Forensic Dossier */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#0b0e15] border border-slate-800 rounded-xl p-6 relative overflow-hidden shadow-xl">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${
              current.severity === 'Critical' ? 'bg-red-500' :
              current.severity === 'High' ? 'bg-amber-500' : 'bg-blue-500'
            }`}></div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative shrink-0 mx-auto sm:mx-0">
                <img 
                  src={current.photoUrl} 
                  alt={current.name} 
                  className="w-36 h-44 rounded-xl object-cover border-2 border-slate-700 shadow-2xl" 
                />
                <div className="absolute inset-0 rounded-xl bg-blue-500/10 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                  VERIFIED MP
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-2xl font-black tracking-wide text-white uppercase">{current.name}</h3>
                    <p className="text-xs text-blue-400 font-medium">Alias: <span className="text-slate-300 font-semibold">{current.alias}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 text-xs font-bold uppercase tracking-wider">
                      {current.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">AI Risk Rating</p>
                    <p className="text-lg font-black text-red-400">{current.riskRating} / 100</p>
                  </div>
                  <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Safe City Match</p>
                    <p className="text-lg font-black text-blue-400">{current.biometrics.facialMatchScore}%</p>
                  </div>
                  <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Age / DOB</p>
                    <p className="text-sm font-bold text-slate-200 mt-1">{current.age} Yrs ({current.dob})</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-xs border-t border-slate-800/80 pt-3">
                  <div>
                    <span className="text-slate-500 font-mono text-[10px] uppercase block">MP Dossier ID</span>
                    <span className="text-slate-300 font-mono font-medium">{current.code}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono text-[10px] uppercase block">Cartel / Syndicate</span>
                    <span className="text-slate-200 font-semibold">{current.gangAffiliation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono text-[10px] uppercase block">Last Sighting (Indore)</span>
                    <span className="text-amber-300 font-medium">{current.lastLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono text-[10px] uppercase block">AFIS MP Biometric</span>
                    <span className="text-slate-300 font-mono">{current.biometrics.fingerprintRegistry}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0b0e15] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                  <span className="material-symbols-outlined text-blue-400 text-base">psychology</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Modus Operandi in Malwa Zone</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{current.modusOperandi}</p>
                
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Recovered Weapons & Tools</span>
                  <div className="flex flex-wrap gap-1.5">
                    {current.weapons.map((w, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-red-300 text-[10px] rounded font-mono">
                        ⚠️ {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active MP Police FIRs</span>
                <div className="flex flex-wrap gap-1.5">
                  {current.linkedFirs.map((fir, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-blue-950/60 border border-blue-700/50 text-blue-300 text-[10px] rounded font-mono">
                      {fir}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#0b0e15] border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                <span className="material-symbols-outlined text-emerald-400 text-base">satellite_alt</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Indore Safe City Surveillance Timeline</h4>
              </div>

              <div className="space-y-3 mt-2">
                {current.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{item.event}</span>
                        <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">📍 {item.location}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">Known Local Associates</span>
                <div className="flex flex-wrap gap-1.5">
                  {current.associates.map((assoc, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
                      👤 {assoc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
