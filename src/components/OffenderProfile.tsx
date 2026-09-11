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
    <div className="flex-1 bg-black text-neutral-100 overflow-y-auto flex flex-col select-none">
      {/* Top Banner */}
      <div className="px-6 py-3.5 border-b border-[#262626] bg-[#121212] flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#E1306C] text-xl">badge</span>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-white">Madhya Pradesh Police • Offender Dossier Matrix</h2>
          </div>
          <p className="text-[10px] text-neutral-400 mt-0.5">Indore Police Commissionerate & MP AFIS Biometric Criminal Database</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleIssueBolo}
            className="flex items-center gap-2 px-4 py-2 ig-gradient hover:opacity-95 text-white rounded-xl text-xs font-semibold tracking-wide uppercase transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            {bAlertSent ? "State-wide BOLO Broadcasted!" : "Broadcast MP Police BOLO"}
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full grid grid-cols-12 gap-6">
        {/* Left Column: Suspect Selector List */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative w-full">
                <span className="material-symbols-outlined text-neutral-500 text-sm absolute left-3 top-2.5">search</span>
                <input
                  type="text"
                  placeholder="Search suspect, alias, MP code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#181818] border border-[#262626] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#737373] transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-1.5 pb-2">
              {['All', 'Critical', 'High', 'Medium'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    filterSeverity === sev 
                      ? 'ig-gradient text-white shadow-sm' 
                      : 'bg-[#181818] border border-[#262626] text-neutral-400 hover:text-white'
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
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected 
                        ? 'bg-[#1f1215] border-[#dc2743]/50 border-l-4 border-l-[#E1306C] shadow-sm' 
                        : 'bg-[#181818] border-[#262626] hover:border-[#383838]'
                    }`}
                  >
                    <div className="ig-border-ring rounded-full shrink-0">
                      <img 
                        src={dossier.photoUrl} 
                        alt={dossier.name} 
                        className="w-10 h-10 rounded-full object-cover border border-black shrink-0" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">{dossier.name}</h4>
                          <span className="material-symbols-outlined text-[#0095F6] text-[13px] shrink-0">verified</span>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                          dossier.severity === 'Critical' ? 'bg-[#251016] text-[#E1306C] border border-[#dc2743]/30' :
                          dossier.severity === 'High' ? 'bg-[#2e1d0d] text-[#F59E0B] border border-[#F59E0B]/30' :
                          'bg-[#142334] text-[#0095F6] border border-[#0095F6]/30'
                        }`}>
                          Risk: {dossier.riskRating}%
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate">{dossier.alias}</p>
                      <p className="text-[9px] font-mono text-neutral-500 mt-0.5">{dossier.code} • {dossier.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Forensic Dossier */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 relative overflow-hidden shadow-sm">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${
              current.severity === 'Critical' ? 'bg-[#E1306C]' :
              current.severity === 'High' ? 'bg-[#F59E0B]' : 'bg-[#0095F6]'
            }`}></div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative shrink-0 mx-auto sm:mx-0 ig-border-ring rounded-2xl p-1">
                <img 
                  src={current.photoUrl} 
                  alt={current.name} 
                  className="w-36 h-44 rounded-xl object-cover border border-black shadow-2xl" 
                />
                <div className="absolute top-2 right-2 bg-black/90 px-2 py-0.5 rounded-full text-[9px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[11px]">verified</span>
                  VERIFIED
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xl font-bold tracking-tight text-white uppercase">{current.name}</h3>
                      <span className="material-symbols-outlined text-[#0095F6] text-[18px]">verified</span>
                    </div>
                    <p className="text-xs text-[#0095F6] font-medium mt-0.5">Alias: <span className="text-neutral-200 font-semibold">{current.alias}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#251016] border border-[#dc2743]/30 rounded-full text-[#E1306C] text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] animate-pulse"></span>
                      {current.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-[#181818] border border-[#262626] p-3 rounded-xl">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">AI Risk Rating</p>
                    <p className="text-xl font-bold text-[#E1306C]">{current.riskRating} / 100</p>
                  </div>
                  <div className="bg-[#181818] border border-[#262626] p-3 rounded-xl">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Safe City Match</p>
                    <p className="text-xl font-bold text-[#0095F6]">{current.biometrics.facialMatchScore}%</p>
                  </div>
                  <div className="bg-[#181818] border border-[#262626] p-3 rounded-xl">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Age / DOB</p>
                    <p className="text-xs font-semibold text-neutral-200 mt-1">{current.age} Yrs ({current.dob})</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-xs border-t border-[#262626] pt-3">
                  <div>
                    <span className="text-neutral-500 font-mono text-[10px] uppercase block">MP Dossier ID</span>
                    <span className="text-neutral-300 font-mono font-medium">{current.code}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-mono text-[10px] uppercase block">Cartel / Syndicate</span>
                    <span className="text-white font-semibold">{current.gangAffiliation}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-mono text-[10px] uppercase block">Last Sighting (Indore)</span>
                    <span className="text-[#F59E0B] font-medium">{current.lastLocation}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-mono text-[10px] uppercase block">AFIS MP Biometric</span>
                    <span className="text-neutral-300 font-mono">{current.biometrics.fingerprintRegistry}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121212] border border-[#262626] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#262626]">
                  <span className="material-symbols-outlined text-[#E1306C] text-base">psychology</span>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">Modus Operandi in Malwa Zone</h4>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">{current.modusOperandi}</p>
                
                <div className="mt-4">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">Recovered Weapons & Tools</span>
                  <div className="flex flex-wrap gap-1.5">
                    {current.weapons.map((w, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 bg-[#251016] border border-[#dc2743]/30 text-[#E1306C] text-[10px] rounded-md font-mono">
                        ⚠️ {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#262626]">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Active MP Police FIRs</span>
                <div className="flex flex-wrap gap-1.5">
                  {current.linkedFirs.map((fir, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-[#142334] border border-[#0095F6]/30 text-[#0095F6] text-[10px] rounded-md font-mono">
                      {fir}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#121212] border border-[#262626] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#262626]">
                <span className="material-symbols-outlined text-emerald-400 text-base">satellite_alt</span>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">Safe City Surveillance Timeline</h4>
              </div>

              <div className="space-y-3 mt-2">
                {current.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-1.5 shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{item.event}</span>
                        <span className="text-[10px] font-mono text-neutral-500">{item.time}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">📍 {item.location}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-3 bg-[#181818] border border-[#262626] rounded-xl">
                <span className="text-[10px] font-semibold text-[#0095F6] uppercase tracking-wider block mb-1">Known Local Associates</span>
                <div className="flex flex-wrap gap-1.5">
                  {current.associates.map((assoc, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-[#262626] text-neutral-300 rounded-md text-[10px]">
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
