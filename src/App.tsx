import React, { useEffect, useState } from 'react';
import NetworkAnalysis from './components/NetworkAnalysis';
import GisDashboard from './components/GisDashboard';
import ForecastingDashboard from './components/ForecastingDashboard';
import OffenderProfile from './components/OffenderProfile';
import FirRepository from './components/FirRepository';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [email, setEmail] = useState('officer@mppolice.gov.in');
  const [password, setPassword] = useState('Officer@123');

  const [sysHealth, setSysHealth] = useState<{ status: string, uptime: number, engine?: string } | null>(null);
  const [dbStatus, setDbStatus] = useState<{ status: string, mode?: string } | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fetchingData, setFetchingData] = useState(false);
  
  // Operational Alert Level State (Indian Police Standard)
  const [threatLevel, setThreatLevel] = useState<string>("Night Patrol Mode (Amber)");
  const [threatCode, setThreatCode] = useState<string>("AMBER");
  const [cadPriorityFilter, setCadPriorityFilter] = useState<string>("ALL");
  const [dispatchAlertMsg, setDispatchAlertMsg] = useState<string | null>(null);

  // Copilot State
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([
    {
      role: 'assistant',
      content: {
        summary: "GARUDA-AI Crime Intelligence Command online. Engineered to assist investigators by providing visual and analytical insights across the National Law Enforcement Grid & Indore Commissionerate.",
        confidenceScore: 99,
        reasoning: "Unified Law Enforcement Grid synchronized with Central CCTNS & MP State Crime Records Bureau (SCRB).",
        evidence: ["55 Police Districts Active (MP)", "1248 Case Files Linked (Indore)", "Safe City ANPR Feeds Online"],
        suggestedActions: [
          "Cross-reference FIR #882 with vehicle MP-09-CB-4592",
          "Inspect predictive burglary forecast for Sarafa & Vijay Nagar"
        ],
        followUpQuestions: [
          "Analyze Malwa Syndicate hierarchy for FIR #882",
          "Predict nighttime burglary hotspots in Indore"
        ]
      }
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'gis' | 'network' | 'forecasting' | 'offender' | 'firs'>('dashboard');

  // Live Digital Clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-IN', { hour12: false }));
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const FALLBACK_DASHBOARD = {
    activeInvestigations: 1248,
    activeInvestigationsChange: '+15.4%',
    clearanceRate: '71.2%',
    clearanceRateDiff: '+11.2%',
    aiAlerts: 31,
    lastSync: 'Live MP Police Network',
    activePatrols: 18,
    dial112Calls: 342,
    avgResponseTime: '6.4 mins',
    cctvOnlinePercentage: '97.9%',
    stationBreakdown: [
      { name: 'Vijay Nagar', reported: 38, resolved: 29, activeCheetah: 4, inCharge: 'TI Dinesh Sharma', status: 'Moderate' },
      { name: 'Palasia', reported: 24, resolved: 19, activeCheetah: 3, inCharge: 'TI Sanjay Patel', status: 'Normal' },
      { name: 'Bhanwarkuan', reported: 31, resolved: 22, activeCheetah: 3, inCharge: 'TI Rajesh Mishra', status: 'Moderate' },
      { name: 'Tukoganj', reported: 19, resolved: 15, activeCheetah: 2, inCharge: 'TI Meena Verma', status: 'Normal' },
      { name: 'Sarafa Bazaar', reported: 14, resolved: 11, activeCheetah: 2, inCharge: 'SI Anand Chouhan', status: 'Normal' },
      { name: 'Rau Bypass', reported: 22, resolved: 16, activeCheetah: 4, inCharge: 'TI Kamlesh Roy', status: 'High Vigil' }
    ],
    recentIncidents: [
      { id: "INC-8921", time: "08m ago", station: "Vijay Nagar", type: "Vehicle Theft (SUV)", priority: "P1 - Urgent", status: "Unit Dispatched", location: "Near C21 Mall, AB Road" },
      { id: "INC-8920", time: "24m ago", station: "Sarafa Bazaar", type: "Night Market Altercation", priority: "P2 - Priority", status: "Officers On Scene", location: "Sarafa Chaupati Gate" },
      { id: "INC-8919", time: "42m ago", station: "Palasia", type: "Cyber Extortion / OTP Fraud", priority: "P2 - Priority", status: "FIR Filed (#2342)", location: "Manorama Ganj" },
      { id: "INC-8918", time: "1h 10m ago", station: "Rau Bypass", type: "Transport Hijacking Attempt", priority: "P1 - Urgent", status: "BOLO Broadcasted", location: "Silicon City Circle" },
      { id: "INC-8917", time: "1h 45m ago", station: "Bhanwarkuan", type: "Residential PG Burglary", priority: "P3 - Standard", status: "Investigation Open", location: "Bholaram Ustad Marg" }
    ],
    threatLevel: {
      level: "DEFCON 2 - ELEVATED",
      code: "AMBER",
      updatedAt: new Date().toISOString(),
      activeAdvisories: 3
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        setFetchingData(true);
        try {
          const headers = { 'Authorization': `Bearer ${storedToken}` };
          const fetchApi = async (url: string, options?: RequestInit) => {
            try {
              const res = await fetch(url, options);
              const contentType = res.headers.get('content-type') || '';
              if (res.ok && contentType.includes('application/json')) {
                return await res.json();
              }
            } catch {
              // Ignore network or json parse errors
            }
            return null;
          };

          const [healthRes, dbRes, dashRes, meRes] = await Promise.all([
            fetchApi('/api/system/health'),
            fetchApi('/api/system/db-status'),
            fetchApi('/api/dashboard/summary', { headers }),
            fetchApi('/api/auth/me', { headers })
          ]);

          const validUser = meRes?.user || {
            uid: '1',
            email: 'officer@mppolice.gov.in',
            name: 'Inspector Rahul Verma',
            role: 'Indore Crime Branch Lead'
          };

          setSysHealth(healthRes || { status: 'Nominal', uptime: 3600, engine: 'GARUDA Core 3.2-DEFENSE (MP POLICE)' });
          setDbStatus(dbRes || { status: 'Synchronized (Indore Smart City Grid)', mode: 'SIH Live Demo' });
          setDashboardData(dashRes || FALLBACK_DASHBOARD);
          setProfile(validUser);
          setUser(validUser);
          setLoginError(null);
        } catch (error) {
          console.warn("User session maintained in fallback mode:", error);
          const demoUser = {
            uid: '1',
            email: 'officer@mppolice.gov.in',
            name: 'Inspector Rahul Verma',
            role: 'Indore Crime Branch Lead'
          };
          setUser(demoUser);
          setProfile(demoUser);
          setDashboardData(FALLBACK_DASHBOARD);
        } finally {
          setFetchingData(false);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const loginEmail = (customEmail || email).trim();
    const loginPassword = (customPass || password).trim();

    try {
      setLoginError(null);
      let authData: any = null;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginEmail, password: loginPassword })
        });
        
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = await res.json();
          if (res.ok) {
            authData = json;
          } else if (json.error) {
            throw new Error(json.error);
          }
        }
      } catch (err: any) {
        if (err.message && !err.message.includes('JSON') && !err.message.includes('fetch') && !err.message.includes('token')) {
          throw err;
        }
      }

      const DEMO_ACCOUNTS: Record<string, { pass: string, name: string, role: string }> = {
        'officer@mppolice.gov.in': { pass: 'Officer@123', name: 'Inspector Rahul Verma', role: 'Indore Crime Branch Lead' },
        'officer@police.gov.in': { pass: 'Officer@123', name: 'Inspector Rahul Verma', role: 'Indore Crime Branch Lead' },
        'admin@mppolice.gov.in': { pass: 'Admin@123', name: 'DGP S. Ramanathan', role: 'MP Police Command Director' },
        'admin@police.gov.in': { pass: 'Admin@123', name: 'DGP S. Ramanathan', role: 'MP Police Command Director' },
        'analyst@mppolice.gov.in': { pass: 'Analyst@123', name: 'Dr. Ananya Iyer', role: 'Cyber & Forensic Specialist' },
        'patrol@mppolice.gov.in': { pass: 'Patrol@123', name: 'Sub-Inspector Vikram Singh', role: 'Indore QRT Lead' }
      };

      const matchedDemo = DEMO_ACCOUNTS[loginEmail.toLowerCase()];

      if (authData && authData.token && authData.user) {
        localStorage.setItem('token', authData.token);
        setToken(authData.token);
        setUser(authData.user);
        setProfile(authData.user);
      } else if (matchedDemo && matchedDemo.pass === loginPassword) {
        const demoUser = {
          uid: '1',
          email: loginEmail,
          name: matchedDemo.name,
          role: matchedDemo.role
        };
        const demoToken = 'garuda-demo-token-mp-police';
        localStorage.setItem('token', demoToken);
        setToken(demoToken);
        setUser(demoUser);
        setProfile(demoUser);
      } else {
        throw new Error('Invalid credentials. Use officer@mppolice.gov.in / Officer@123');
      }

      const activeToken = localStorage.getItem('token') || 'garuda-demo-token-mp-police';
      const headers = { 'Authorization': `Bearer ${activeToken}` };
      const safeFetch = async (url: string) => {
        try {
          const response = await fetch(url, { headers });
          const ct = response.headers.get('content-type') || '';
          if (response.ok && ct.includes('application/json')) {
            return await response.json();
          }
        } catch { /* ignore */ }
        return null;
      };

      const [healthRes, dbRes, dashRes] = await Promise.all([
        safeFetch('/api/system/health'),
        safeFetch('/api/system/db-status'),
        safeFetch('/api/dashboard/summary')
      ]);

      setSysHealth(healthRes || { status: 'Nominal', uptime: 3600, engine: 'GARUDA Core 3.2-DEFENSE (MP POLICE)' });
      setDbStatus(dbRes || { status: 'Synchronized (Indore Smart City Grid)', mode: 'SIH Live Demo' });
      setDashboardData(dashRes || FALLBACK_DASHBOARD);
      
    } catch (error: any) {
      console.error(error);
      setLoginError(error.message || "Failed to authenticate.");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const handleCopilotQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    
    const userMessage = { role: 'user', content: queryText };
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput('');
    setIsQuerying(true);

    try {
      const queryToken = localStorage.getItem('token');
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${queryToken}`
        },
        body: JSON.stringify({ query: queryText, history: chatHistory })
      });

      if (!res.ok) throw new Error('Failed to query Copilot');
      const data = await res.json();
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: data }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: { 
          summary: 'Simulated intelligence assessment compiled from Indore Commissionerate database.', 
          confidenceScore: 92, 
          reasoning: 'Primary vector correlates suspect modus operandi with recurring FIR patterns in Vijay Nagar and Sarafa.', 
          evidence: ['FIR #882/2023 (Indore)', 'ANPR Intercept Manglia-092'], 
          suggestedActions: ['Dispatch Cheetah unit to Vijay Nagar Sector 1'], 
          followUpQuestions: ['Display Malwa Syndicate network graph'] 
        } 
      }]);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleQuickPatrolDispatch = async (zone: string) => {
    try {
      const storedToken = localStorage.getItem('token');
      const res = await fetch('/api/patrols/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify({ targetLocation: zone })
      });
      const data = await res.json();
      setDispatchAlertMsg(data.message);
      setTimeout(() => setDispatchAlertMsg(null), 4500);
    } catch (e) {
      setDispatchAlertMsg(`Cheetah Patrol Unit dispatched to ${zone}. ETA: 3.2 mins.`);
      setTimeout(() => setDispatchAlertMsg(null), 4500);
    }
  };

  const exportChatToPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("GARUDA-AI • MADHYA PRADESH POLICE INTELLIGENCE BRIEF", 15, 18);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("INDORE POLICE COMMISSIONERATE • LAW ENFORCEMENT SENSITIVE", 15, 24);
    doc.text(`Timestamp: ${new Date().toLocaleString()} | Officer: ${profile?.email || 'Authorized Investigator'}`, 15, 30);
    
    doc.setLineWidth(0.5);
    doc.line(15, 34, 195, 34);

    let y = 42;
    doc.setFontSize(10);
    chatHistory.forEach((msg) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      if (msg.role === 'user') {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(225, 48, 108);
        doc.text(`INVESTIGATOR QUERY:`, 15, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        y += 6;
        doc.text(String(msg.content), 15, y);
        y += 8;
      } else {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 149, 246);
        doc.text(`GARUDA AI COPILOT ASSESSMENT:`, 15, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        y += 6;
        
        if (msg.content.summary) {
          doc.text(`Summary: ${msg.content.summary}`, 15, y, { maxWidth: 180 });
          y += 12;
        }

        if (msg.content.reasoning) {
          doc.setFont("helvetica", "italic");
          doc.text(`Rationale: ${msg.content.reasoning}`, 15, y, { maxWidth: 180 });
          doc.setFont("helvetica", "normal");
          y += 10;
        }

        y += 4;
      }
    });
    doc.save(`GARUDA_Indore_Brief_${Date.now()}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#E1306C] flex flex-col items-center justify-center font-mono text-sm tracking-widest gap-3 select-none">
        <div className="w-12 h-12 rounded-full ig-border-ring flex items-center justify-center animate-spin">
          <div className="w-10 h-10 bg-black rounded-full"></div>
        </div>
        <p className="uppercase text-xs text-neutral-400">Initializing GARUDA-AI Intelligence Grid...</p>
      </div>
    );
  }

  // === Instagram-Themed Authentication Gateway Screen ===
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-neutral-100 flex flex-col items-center justify-center p-4 relative select-none">
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="loginDots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.75" fill="#666666"></circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#loginDots)"></rect>
          </svg>
        </div>

        <div className="bg-[#121212] border border-[#262626] p-8 max-w-md w-full rounded-2xl shadow-2xl relative z-10">
          {/* Official Law Enforcement Header */}
          <div className="text-center mb-6 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl ig-gradient flex items-center justify-center mb-3.5 shadow-lg shadow-black/60 text-white">
              <span className="material-symbols-outlined text-3xl">fingerprint</span>
            </div>
            
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-lg font-bold tracking-tight text-white">GARUDA</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#262626] text-[#E1306C] font-semibold">
                INTELLIGENCE
              </span>
            </div>
            
            <p className="text-[10px] text-neutral-400 font-medium tracking-wide uppercase">
              NCRB • MP POLICE COMMAND CENTER • BSA 2023 SECURE
            </p>

            <div className="mt-3 px-3 py-1.5 bg-[#181818] border border-[#262626] rounded-xl text-[10px] text-neutral-300 flex items-center justify-center gap-1.5 font-medium w-full">
              <span className="material-symbols-outlined text-[14px] text-[#0095F6]">verified</span>
              <span>Visual & Analytical Crime Intelligence Portal</span>
            </div>
          </div>

          <form onSubmit={(e) => login(e)} className="space-y-4">
            <div>
              <label className="block text-[11px] text-neutral-300 font-medium mb-1.5">Official Police Email / PNO ID</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-neutral-500 text-[18px]">badge</span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#181818] border border-[#262626] text-white pl-9 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#737373] text-xs placeholder:text-neutral-500 transition-colors"
                  placeholder="officer@mppolice.gov.in"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-neutral-300 font-medium mb-1.5">Clearance Passkey</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-neutral-500 text-[18px]">key</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#181818] border border-[#262626] text-white pl-9 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#737373] text-xs placeholder:text-neutral-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full ig-gradient hover:opacity-95 text-white py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-md flex justify-center items-center gap-2 mt-3 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              Sign In to Command Portal
            </button>
          </form>

          {/* 1-Click Credentials for Presentation */}
          <div className="mt-6 pt-4 border-t border-[#262626]">
            <p className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider text-center mb-2.5">
              Official Demo Accounts (Smart India Hackathon)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => login(undefined, 'officer@mppolice.gov.in', 'Officer@123')}
                className="p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#262626] hover:border-[#E1306C]/50 rounded-xl text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-semibold text-[#0095F6] group-hover:text-blue-300">Insp. Rahul Verma</div>
                <div className="text-[10px] text-neutral-400">Crime Branch, Indore</div>
                <div className="text-[9px] text-emerald-400 font-mono mt-0.5">Role: IO / Lead Officer</div>
              </button>
              <button
                type="button"
                onClick={() => login(undefined, 'admin@mppolice.gov.in', 'Admin@123')}
                className="p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#262626] hover:border-[#E1306C]/50 rounded-xl text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-semibold text-[#F59E0B] group-hover:text-amber-300">DGP Ramanathan</div>
                <div className="text-[10px] text-neutral-400">PHQ Bhopal</div>
                <div className="text-[9px] text-emerald-400 font-mono mt-0.5">Role: State Admin</div>
              </button>
            </div>
          </div>

          {loginError && (
            <div className="mt-4 p-3 bg-[#251016] border border-[#dc2743]/40 rounded-xl text-[#E1306C] text-xs text-center">
              {loginError}
            </div>
          )}

          {/* Institutional Compliance Notice */}
          <div className="mt-4 text-center">
            <p className="text-[9px] text-neutral-500 leading-tight">
              Protected computer system under Section 70 of the Information Technology Act, 2000 & BSA § 65B.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const userInitials = profile?.name ? profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'MP';

  return (
    <div className="min-h-screen flex flex-col bg-black text-neutral-100 font-sans overflow-hidden select-none">
      {/* Top Instagram-Themed Header */}
      <header className="h-14 bg-black/90 backdrop-blur-md border-b border-[#262626] flex items-center justify-between px-5 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg ig-gradient flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[19px]">fingerprint</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white">GARUDA</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#262626] text-[#E1306C] font-semibold">
                  INTELLIGENCE
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 font-medium tracking-wide">
                NCRB • MP POLICE COMMAND CENTER
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-[#262626] hidden lg:block"></div>

          <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-[#121212] border border-[#262626] rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-medium text-neutral-300">CCTNS NODE: ONLINE</span>
          </div>

          <div className="hidden 2xl:flex items-center px-3 py-1 bg-[#181818] border border-[#262626] rounded-full">
            <span className="text-[11px] text-neutral-300 font-medium">
              CLEARANCE: <span className="text-[#E1306C] font-semibold">DSP / SENIOR INVESTIGATOR</span>
            </span>
          </div>
        </div>

        {dispatchAlertMsg && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#251016] border border-[#dc2743]/30 text-[#E1306C] text-xs rounded-full animate-fade-in">
            <span className="material-symbols-outlined text-[15px]">local_police</span>
            {dispatchAlertMsg}
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-neutral-300 text-xs font-mono">
              <span>{currentTime} IST</span>
              <span className="text-neutral-600">|</span>
              <span className="text-emerald-400 font-medium">CAD: LIVE</span>
            </div>
          </div>

          {/* Alert Level Switcher */}
          <div className="flex items-center gap-2 bg-[#181818] border border-[#262626] px-2.5 py-1 rounded-xl">
            <span className={`w-2 h-2 rounded-full ${
              threatCode === 'RED' ? 'bg-[#dc2743] animate-pulse' :
              threatCode === 'ORANGE' ? 'bg-[#F77737]' :
              threatCode === 'AMBER' ? 'bg-[#F59E0B]' : 'bg-emerald-400'
            }`}></span>
            <select
              value={threatCode}
              onChange={(e) => {
                const code = e.target.value;
                setThreatCode(code);
                setThreatLevel(
                  code === 'RED' ? 'High Alert / VIP Protocol (Red)' :
                  code === 'ORANGE' ? 'Special Bandobast / Sec 144 (Orange)' :
                  code === 'AMBER' ? 'Enhanced Night Patrol (Amber)' : 
                  'Normal Beat Vigil (Green)'
                );
              }}
              className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer"
            >
              <option value="GREEN" className="bg-[#181818] text-emerald-400">Normal Beat Vigil</option>
              <option value="AMBER" className="bg-[#181818] text-[#F59E0B]">Enhanced Night Patrol</option>
              <option value="ORANGE" className="bg-[#181818] text-[#F77737]">Special Bandobast (Sec 144)</option>
              <option value="RED" className="bg-[#181818] text-[#dc2743]">High Alert (Red)</option>
            </select>
          </div>

          <button 
            onClick={() => setCopilotOpen(!copilotOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              copilotOpen 
                ? 'ig-gradient text-white border-transparent shadow-sm' 
                : 'bg-[#181818] border-[#262626] text-neutral-300 hover:bg-[#222222] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">psychology</span>
            <span>AI Copilot</span>
          </button>

          {/* User Profile Pill with Instagram Story Ring */}
          <div 
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-[#181818] border border-[#262626] cursor-pointer hover:border-[#383838] transition-colors"
            onClick={logout}
            title="Click to Sign Out"
          >
            <div className="ig-border-ring rounded-full">
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-[9px] font-bold text-white">
                {userInitials}
              </div>
            </div>
            <span className="hidden sm:inline font-semibold text-xs text-white">{profile?.name ? profile.name.split(' ')[0] : 'Officer'}</span>
            <span className="material-symbols-outlined text-[15px] text-neutral-500 hover:text-[#E1306C]">logout</span>
          </div>
        </div>
      </header>

      {/* Main Command Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Sidebar */}
        <aside className="w-60 bg-black border-r border-[#262626] p-3 flex flex-col justify-between hidden md:flex shrink-0">
          <div>
            <div className="px-3 py-1 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase">OPERATIONAL MODULES</span>
              <span className="material-symbols-outlined text-neutral-600 text-[14px]">lock</span>
            </div>

            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-[#181818] text-white font-semibold relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-full before:bg-[#E1306C]' 
                    : 'text-neutral-400 hover:bg-[#121212] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[19px] ${activeTab === 'dashboard' ? 'text-[#E1306C]' : 'text-neutral-500'}`}>dashboard</span>
                  <span className="text-xs">Command Dashboard</span>
                </div>
                {activeTab === 'dashboard' && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full ig-gradient text-white font-semibold">ACTIVE</span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('gis')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                  activeTab === 'gis' 
                    ? 'bg-[#181818] text-white font-semibold relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-full before:bg-[#E1306C]' 
                    : 'text-neutral-400 hover:bg-[#121212] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[19px] ${activeTab === 'gis' ? 'text-[#E1306C]' : 'text-neutral-500'}`}>map</span>
                  <span className="text-xs">Crime Hotspots (GIS)</span>
                </div>
                {activeTab === 'gis' && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full ig-gradient text-white font-semibold">ACTIVE</span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('network')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                  activeTab === 'network' 
                    ? 'bg-[#181818] text-white font-semibold relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-full before:bg-[#E1306C]' 
                    : 'text-neutral-400 hover:bg-[#121212] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[19px] ${activeTab === 'network' ? 'text-[#E1306C]' : 'text-neutral-500'}`}>hub</span>
                  <span className="text-xs">Network Analysis</span>
                </div>
                {activeTab === 'network' ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full ig-gradient text-white font-semibold">ACTIVE</span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#181818] text-[#E1306C] border border-[#262626] font-mono">T-01</span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('forecasting')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                  activeTab === 'forecasting' 
                    ? 'bg-[#181818] text-white font-semibold relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-full before:bg-[#E1306C]' 
                    : 'text-neutral-400 hover:bg-[#121212] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[19px] ${activeTab === 'forecasting' ? 'text-[#E1306C]' : 'text-neutral-500'}`}>trending_up</span>
                  <span className="text-xs">Forecasting Engine</span>
                </div>
                {activeTab === 'forecasting' && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full ig-gradient text-white font-semibold">ACTIVE</span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('offender')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                  activeTab === 'offender' 
                    ? 'bg-[#181818] text-white font-semibold relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-full before:bg-[#E1306C]' 
                    : 'text-neutral-400 hover:bg-[#121212] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[19px] ${activeTab === 'offender' ? 'text-[#E1306C]' : 'text-neutral-500'}`}>badge</span>
                  <span className="text-xs">Offender Profiling</span>
                </div>
                {activeTab === 'offender' && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full ig-gradient text-white font-semibold">ACTIVE</span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('firs')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                  activeTab === 'firs' 
                    ? 'bg-[#181818] text-white font-semibold relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-full before:bg-[#E1306C]' 
                    : 'text-neutral-400 hover:bg-[#121212] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[19px] ${activeTab === 'firs' ? 'text-[#E1306C]' : 'text-neutral-500'}`}>folder_open</span>
                  <span className="text-xs">FIR Case Repository</span>
                </div>
                {activeTab === 'firs' ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full ig-gradient text-white font-semibold">ACTIVE</span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#181818] text-neutral-400 font-mono border border-[#262626]">24</span>
                )}
              </button>
            </nav>
          </div>

          {/* Bottom Compliance Ledger */}
          <div className="p-3 border border-[#262626] bg-[#121212] rounded-xl">
            <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1.5">
              <span className="font-semibold">COMPLIANCE LEDGER</span>
              <span className="text-neutral-500 font-mono">BSA § 65B</span>
            </div>
            <div className="h-1.5 w-full bg-[#262626] rounded-full overflow-hidden">
              <div className="h-full ig-gradient w-4/5 rounded-full"></div>
            </div>
            <div className="mt-2 text-[9px] text-neutral-500 font-mono flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-emerald-400">check_circle</span>
              HASH VERIFIED SHA-256
            </div>
          </div>
        </aside>

        {/* Central Viewport */}
        <main className={`flex-1 bg-black ${activeTab === 'dashboard' ? 'p-6 overflow-y-auto' : 'overflow-hidden flex flex-col'}`}>
          {activeTab === 'dashboard' ? (
            fetchingData ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest animate-pulse">
                  Establishing High-Speed Command Telemetry Link...
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-7xl mx-auto">
                {/* Core Mandate Banner: Assist investigators by providing visual and analytical insights */}
                <div className="bg-[#121212] border border-[#262626] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-start md:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl ig-gradient flex items-center justify-center text-white shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-2xl">insights</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#262626] text-[#E1306C]">
                          Core Mandate
                        </span>
                        <h2 className="text-sm font-bold text-white">Investigative Decision Support</h2>
                      </div>
                      <p className="text-xs text-neutral-300 mt-0.5">
                        <strong className="text-white font-semibold">• Assist investigators by providing visual and analytical insights</strong> across cross-jurisdictional FIRs, criminal association graphs, and Safe City surveillance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveTab('network')}
                      className="px-3.5 py-1.5 bg-[#181818] hover:bg-[#222222] text-white border border-[#262626] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#E1306C]">hub</span>
                      <span>Visual Graph</span>
                    </button>
                    <button
                      onClick={() => {
                        setCopilotOpen(true);
                        handleCopilotQuery("Provide comprehensive analytical insights and suspect correlation summary for active Indore investigations");
                      }}
                      className="px-3.5 py-1.5 ig-gradient hover:opacity-95 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[15px]">psychology</span>
                      <span>Analytical AI</span>
                    </button>
                  </div>
                </div>

                {/* 4 Instagram-Themed KPI Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#121212] border border-[#262626] rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Dial 112 CAD Emergency</span>
                      <div className="w-8 h-8 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-center text-emerald-400">
                        <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white tracking-tight">
                      {dashboardData?.dial112Calls || '342'} <span className="text-xs font-normal text-neutral-400">Calls Today</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-[#262626] pt-2 font-mono">
                      <span>Avg Response: <strong className="text-emerald-400 font-semibold">{dashboardData?.avgResponseTime || '6.4 mins'}</strong></span>
                      <span className="text-neutral-500">98.2% On-Time</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#121212] border border-[#262626] rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Active Investigations</span>
                      <div className="w-8 h-8 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-center text-[#0095F6]">
                        <span className="material-symbols-outlined text-[18px]">folder_shared</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white tracking-tight">
                      {dashboardData?.activeInvestigations || '1,248'} <span className="text-xs font-normal text-neutral-400">Case Files</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-[#262626] pt-2 font-mono">
                      <span>Clearance: <strong className="text-[#0095F6] font-semibold">{dashboardData?.clearanceRate || '71.2%'}</strong></span>
                      <span className="text-emerald-400">+11.2% YoY</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#121212] border border-[#262626] rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Safe City ANPR Hits</span>
                      <div className="w-8 h-8 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-center text-[#F59E0B]">
                        <span className="material-symbols-outlined text-[18px]">videocam</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white tracking-tight">
                      {dashboardData?.aiAlerts || '31'} <span className="text-xs font-normal text-[#F59E0B]">Hotlist Hits</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-[#262626] pt-2 font-mono">
                      <span>Corridors: <strong className="text-[#F59E0B] font-semibold">14 Active</strong></span>
                      <span className="text-neutral-500">AB Road / Bypass</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#121212] border border-[#262626] rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Cheetah Patrol Units</span>
                      <div className="w-8 h-8 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-center text-[#E1306C]">
                        <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white tracking-tight">
                      {dashboardData?.activePatrols || '18'} <span className="text-xs font-normal text-[#E1306C]">Units on Beat</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-[#262626] pt-2 font-mono">
                      <span>CCTV Uptime: <strong className="text-[#E1306C] font-semibold">{dashboardData?.cctvOnlinePercentage || '97.9%'}</strong></span>
                      <span className="text-emerald-400">6 Thanas</span>
                    </div>
                  </div>
                </div>

                {/* Main Practical Dashboard Layout */}
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Column: Live Emergency CAD Dispatch Feed + Thana Workload */}
                  <div className="col-span-12 xl:col-span-8 space-y-6">
                    {/* Widget 1: Live Emergency CAD Incident Feed */}
                    <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
                      <div className="p-4 border-b border-[#262626] flex flex-wrap items-center justify-between gap-3 bg-[#181818]">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <div>
                            <h2 className="text-xs font-semibold tracking-wide uppercase text-neutral-200">
                              Live Emergency CAD Incident Feed (Dial 112)
                            </h2>
                            <p className="text-[10px] text-neutral-400">
                              Real-time distress dispatches across Indore Police Commissionerate
                            </p>
                          </div>
                        </div>

                        {/* Priority Filter Buttons */}
                        <div className="flex items-center bg-[#0a0a0a] border border-[#262626] rounded-xl p-0.5 text-xs">
                          {(['ALL', 'P1', 'P2', 'P3'] as const).map(p => (
                            <button
                              key={p}
                              onClick={() => setCadPriorityFilter(p)}
                              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                                cadPriorityFilter === p 
                                  ? 'ig-gradient text-white shadow-sm' 
                                  : 'text-neutral-400 hover:text-neutral-200'
                              }`}
                            >
                              {p === 'ALL' ? 'All Alerts' : `${p} Priority`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* CAD Incidents Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#0a0a0a] text-[10px] text-neutral-500 uppercase font-semibold border-b border-[#262626]">
                            <tr>
                              <th className="px-5 py-2.5">Event ID & Time</th>
                              <th className="px-5 py-2.5">Police Station</th>
                              <th className="px-5 py-2.5">Incident Type & Location</th>
                              <th className="px-5 py-2.5">Priority</th>
                              <th className="px-5 py-2.5">Status</th>
                              <th className="px-5 py-2.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1c1c1c] text-neutral-300">
                            {(dashboardData?.recentIncidents || [
                              { id: "INC-8921", time: "08m ago", station: "Vijay Nagar", type: "Vehicle Theft (SUV)", priority: "P1 - Urgent", status: "Unit Dispatched", location: "Near C21 Mall, AB Road" },
                              { id: "INC-8920", time: "24m ago", station: "Sarafa Bazaar", type: "Night Market Altercation", priority: "P2 - Priority", status: "Officers On Scene", location: "Sarafa Chaupati Gate" },
                              { id: "INC-8919", time: "42m ago", station: "Palasia", type: "Cyber Extortion / OTP Fraud", priority: "P2 - Priority", status: "FIR Filed (#2342)", location: "Manorama Ganj" },
                              { id: "INC-8918", time: "1h 10m ago", station: "Rau Bypass", type: "Transport Hijacking Attempt", priority: "P1 - Urgent", status: "BOLO Broadcasted", location: "Silicon City Circle" },
                              { id: "INC-8917", time: "1h 45m ago", station: "Bhanwarkuan", type: "Residential PG Burglary", priority: "P3 - Standard", status: "Investigation Open", location: "Bholaram Ustad Marg" }
                            ])
                            .filter((item: any) => {
                              if (cadPriorityFilter === 'ALL') return true;
                              return item.priority?.includes(cadPriorityFilter);
                            })
                            .map((inc: any) => (
                              <tr key={inc.id} className="hover:bg-[#181818] transition-colors">
                                <td className="px-5 py-3 whitespace-nowrap">
                                  <span className="font-mono font-semibold text-white">{inc.id}</span>
                                  <div className="text-[10px] text-neutral-500 font-mono">{inc.time}</div>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap font-medium text-neutral-200">
                                  {inc.station}
                                </td>
                                <td className="px-5 py-3 max-w-[240px]">
                                  <div className="font-medium text-white truncate">{inc.type}</div>
                                  <div className="text-[11px] text-neutral-400 truncate flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px] text-neutral-500">pin_drop</span>
                                    {inc.location}
                                  </div>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                    inc.priority?.includes('P1') 
                                      ? 'bg-[#251016] text-[#E1306C] border border-[#dc2743]/30' 
                                      : inc.priority?.includes('P2') 
                                        ? 'bg-[#2e1d0d] text-[#F59E0B] border border-[#F59E0B]/30' 
                                        : 'bg-[#142334] text-[#0095F6] border border-[#0095F6]/30'
                                  }`}>
                                    {inc.priority}
                                  </span>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                  <span className="text-[11px] text-neutral-300 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    {inc.status}
                                  </span>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap text-right">
                                  <button
                                    onClick={() => handleQuickPatrolDispatch(`${inc.station} (${inc.location})`)}
                                    className="px-3 py-1 bg-[#1e1e1e] hover:bg-[#282828] text-white border border-[#2e2e2e] rounded-lg text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                                  >
                                    <span className="material-symbols-outlined text-[13px] text-[#E1306C]">near_me</span>
                                    Dispatch
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Widget 2: Indore Police Station Workload & Patrol Distribution */}
                    <div className="bg-[#121212] border border-[#262626] rounded-2xl p-5 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                        <div>
                          <h3 className="text-xs font-semibold tracking-wide uppercase text-neutral-200">
                            Indore Thana Workload & Cheetah Fleet Distribution
                          </h3>
                          <p className="text-[11px] text-neutral-400">
                            Station case clearance rate, active beat personnel, and sector security posture
                          </p>
                        </div>
                        <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#181818] text-neutral-300 border border-[#262626]">
                          6 Key Thanas
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {(dashboardData?.stationBreakdown || [
                          { name: 'Vijay Nagar', reported: 38, resolved: 29, activeCheetah: 4, inCharge: 'TI Dinesh Sharma', status: 'Moderate' },
                          { name: 'Palasia', reported: 24, resolved: 19, activeCheetah: 3, inCharge: 'TI Sanjay Patel', status: 'Normal' },
                          { name: 'Bhanwarkuan', reported: 31, resolved: 22, activeCheetah: 3, inCharge: 'TI Rajesh Mishra', status: 'Moderate' },
                          { name: 'Tukoganj', reported: 19, resolved: 15, activeCheetah: 2, inCharge: 'TI Meena Verma', status: 'Normal' },
                          { name: 'Sarafa Bazaar', reported: 14, resolved: 11, activeCheetah: 2, inCharge: 'SI Anand Chouhan', status: 'Normal' },
                          { name: 'Rau Bypass', reported: 22, resolved: 16, activeCheetah: 4, inCharge: 'TI Kamlesh Roy', status: 'High Vigil' }
                        ]).map((station: any, idx: number) => {
                          const rate = Math.round((station.resolved / station.reported) * 100);
                          return (
                            <div key={idx} className="p-3.5 bg-[#181818] border border-[#262626] rounded-xl flex flex-col justify-between hover:border-[#383838] transition-colors">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-white text-xs">{station.name}</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                    station.status === 'High Vigil' ? 'bg-[#251016] text-[#E1306C] border border-[#dc2743]/30' :
                                    station.status === 'Moderate' ? 'bg-[#2e1d0d] text-[#F59E0B] border border-[#F59E0B]/30' :
                                    'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                                  }`}>
                                    {station.status}
                                  </span>
                                </div>
                                <div className="text-[11px] text-neutral-400 mb-2">
                                  In-Charge: <span className="text-neutral-200 font-medium">{station.inCharge}</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                                    <span>Clearance: {station.resolved}/{station.reported} FIRs</span>
                                    <span className="font-semibold text-white">{rate}%</span>
                                  </div>
                                  <div className="w-full bg-[#262626] h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className="ig-gradient h-full rounded-full transition-all duration-500" 
                                      style={{ width: `${rate}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 pt-2.5 border-t border-[#262626] flex items-center justify-between">
                                <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[13px] text-[#E1306C]">two_wheeler</span>
                                  {station.activeCheetah} Cheetahs
                                </span>
                                <button
                                  onClick={() => handleQuickPatrolDispatch(`${station.name} Sector Beat`)}
                                  className="text-[10px] text-[#0095F6] hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                                >
                                  + Dispatch
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Safe City AI Alerts & Intelligence Correlations */}
                  <div className="col-span-12 xl:col-span-4 space-y-6">
                    {/* Safe City AI Correlation Card */}
                    <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
                      <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#181818]">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#E1306C] text-lg">psychology</span>
                          <h3 className="text-xs font-semibold tracking-wide uppercase text-neutral-200">Safe City AI Alerts</h3>
                        </div>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#262626] text-emerald-400 border border-[#262626]">
                          Live Correlated
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        {/* Alert 1 */}
                        <div className="p-3.5 bg-[#181818] border border-[#262626] rounded-xl">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-semibold text-[#E1306C] uppercase tracking-wide">Malwa Syndicate ANPR Intercept</span>
                            <span className="text-[10px] font-mono text-neutral-500">04m ago</span>
                          </div>
                          <p className="text-xs text-neutral-300 leading-relaxed">
                            Vehicle <strong className="text-[#F59E0B] font-mono">MP-09-CB-4592</strong> registered to suspect <strong className="text-white">Ravi Kumar</strong> detected passing Manglia Toll Plaza toward AB Road. Matches FIR #882 M.O.
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button 
                              onClick={() => handleQuickPatrolDispatch("Manglia Toll Barricade Point")}
                              className="px-2.5 py-1 ig-gradient rounded-lg text-[10px] font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                            >
                              Dispatch Interceptor
                            </button>
                            <button 
                              onClick={() => {
                                setCopilotOpen(true);
                                handleCopilotQuery("Explain links between suspect Ravi Kumar and vehicle MP-09-CB-4592 in Indore");
                              }}
                              className="px-2.5 py-1 bg-[#222222] hover:bg-[#2c2c2c] text-neutral-200 border border-[#2e2e2e] rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
                            >
                              Copilot Brief
                            </button>
                          </div>
                        </div>

                        {/* Alert 2 */}
                        <div className="p-3.5 bg-[#181818] border border-[#262626] rounded-xl">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-semibold text-[#F59E0B] uppercase tracking-wide">Night Burglary Risk Forecast</span>
                            <span className="text-[10px] font-mono text-neutral-500">Scheduled</span>
                          </div>
                          <p className="text-xs text-neutral-300 leading-relaxed">
                            Sarafa Bazaar bullion market shows 78% risk surge between 23:00 - 03:00 based on DBSCAN cluster trends. Cheetah route adjustments recommended.
                          </p>
                          <div className="mt-2.5">
                            <button 
                              onClick={() => handleQuickPatrolDispatch("Sarafa Bazaar Night Patrol Beat")}
                              className="px-2.5 py-1 bg-[#222222] hover:bg-[#2c2c2c] text-neutral-200 border border-[#2e2e2e] rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
                            >
                              Reroute Sarafa Cheetah-02
                            </button>
                          </div>
                        </div>

                        {/* Alert 3 */}
                        <div className="p-3.5 bg-[#181818] border border-[#262626] rounded-xl">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-semibold text-[#0095F6] uppercase tracking-wide">Cyber Cell OTP Phishing Alert</span>
                            <span className="text-[10px] font-mono text-neutral-500">22m ago</span>
                          </div>
                          <p className="text-xs text-neutral-300 leading-relaxed">
                            5 distress calls from student hostels in Bhanwarkuan / Bholaram Marg reporting instant loan app extortion. Coordinated mule accounts suspected.
                          </p>
                          <div className="mt-2.5">
                            <button 
                              onClick={() => {
                                setCopilotOpen(true);
                                handleCopilotQuery("Analyze mule account network in Bhanwarkuan Indore");
                              }}
                              className="px-2.5 py-1 bg-[#222222] hover:bg-[#2c2c2c] text-neutral-200 border border-[#2e2e2e] rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
                            >
                              Investigate Accounts
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Commissionerate Quick Actions */}
                    <div className="bg-[#121212] border border-[#262626] rounded-2xl p-4 shadow-sm">
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                        Commissionerate Quick Actions
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setDispatchAlertMsg("Citywide BOLO broadcasted to all 34 PCR vans & checkpoints.");
                            setTimeout(() => setDispatchAlertMsg(null), 4500);
                          }}
                          className="p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#262626] hover:border-[#E1306C]/40 rounded-xl text-left transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px] text-[#E1306C] mb-1 block">campaign</span>
                          <div className="text-xs font-semibold text-white">Broadcast BOLO</div>
                          <div className="text-[10px] text-neutral-400">All MP-09 Checkpoints</div>
                        </button>

                        <button
                          onClick={() => {
                            setDispatchAlertMsg("Naka-Bandi protocol activated at Manglia, Rau & Super Corridor.");
                            setTimeout(() => setDispatchAlertMsg(null), 4500);
                          }}
                          className="p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#262626] hover:border-[#F59E0B]/40 rounded-xl text-left transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px] text-[#F59E0B] mb-1 block">barrier</span>
                          <div className="text-xs font-semibold text-white">Naka-Bandi Blockade</div>
                          <div className="text-[10px] text-neutral-400">Active Toll Gates</div>
                        </button>

                        <button
                          onClick={() => setActiveTab('gis')}
                          className="p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#262626] hover:border-[#0095F6]/40 rounded-xl text-left transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px] text-[#0095F6] mb-1 block">map</span>
                          <div className="text-xs font-semibold text-white">Hotspot GIS Map</div>
                          <div className="text-[10px] text-neutral-400">Safe City Feeds</div>
                        </button>

                        <button
                          onClick={exportChatToPDF}
                          className="p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#262626] hover:border-emerald-500/40 rounded-xl text-left transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px] text-emerald-400 mb-1 block">picture_as_pdf</span>
                          <div className="text-xs font-semibold text-white">Export Briefing</div>
                          <div className="text-[10px] text-neutral-400">BSA § 65B Dossier</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : activeTab === 'gis' ? (
            <GisDashboard user={user} />
          ) : activeTab === 'network' ? (
            <NetworkAnalysis user={user} />
          ) : activeTab === 'forecasting' ? (
            <ForecastingDashboard user={user} />
          ) : activeTab === 'offender' ? (
            <OffenderProfile user={user} />
          ) : activeTab === 'firs' ? (
            <FirRepository user={user} />
          ) : null}
        </main>

        {/* AI Copilot Side Drawer */}
        {copilotOpen && (
          <aside className="w-[440px] bg-[#121212] border-l border-[#262626] flex flex-col shrink-0 shadow-2xl z-20">
            <div className="h-14 border-b border-[#262626] flex items-center justify-between px-4 bg-[#181818]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E1306C]">psychology</span>
                <h3 className="text-xs font-bold tracking-widest text-neutral-200 uppercase">GARUDA Intelligence Copilot</h3>
              </div>
              <button 
                onClick={exportChatToPDF} 
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer" 
                title="Export Intelligence Briefing (PDF)"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              </button>
            </div>
            
            {/* Quick Prompts */}
            <div className="p-3 bg-[#121212] border-b border-[#262626] flex flex-wrap gap-1.5">
              <button 
                onClick={() => handleCopilotQuery("Analyze Malwa Syndicate hierarchy for FIR #882")}
                className="px-2.5 py-1 bg-[#181818] hover:bg-[#222] border border-[#262626] text-neutral-300 text-[10px] rounded-lg font-mono transition-colors cursor-pointer"
              >
                🔍 Malwa Syndicate FIR #882
              </button>
              <button 
                onClick={() => handleCopilotQuery("Predict nighttime burglary hotspots in Indore and suggest Cheetah routes")}
                className="px-2.5 py-1 bg-[#181818] hover:bg-[#222] border border-[#262626] text-neutral-300 text-[10px] rounded-lg font-mono transition-colors cursor-pointer"
              >
                📈 Indore Burglary Forecast
              </button>
            </div>

            {/* Chat Transcript Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-black">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="ig-gradient text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-[85%] shadow-md font-medium">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="bg-[#121212] border border-[#262626] p-4 rounded-2xl rounded-tl-none w-full text-xs shadow-md">
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#262626]">
                        <span className="material-symbols-outlined text-[#0095F6] text-[16px]">smart_toy</span>
                        <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-300">Tactical Summary</span>
                        {msg.content.confidenceScore !== undefined && (
                          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-[#181818] text-emerald-400 border border-[#262626]">
                            CONF: {msg.content.confidenceScore}%
                          </span>
                        )}
                      </div>
                      
                      <p className="text-neutral-200 leading-relaxed mb-3">{msg.content.summary}</p>
                      
                      {msg.content.reasoning && (
                        <div className="mb-3">
                          <p className="text-[10px] font-bold text-neutral-400 uppercase mb-0.5">Analytic Rationale</p>
                          <p className="text-[11px] text-neutral-300 italic bg-[#181818] p-2 rounded-lg border border-[#262626]">{msg.content.reasoning}</p>
                        </div>
                      )}
                      
                      {msg.content.evidence && msg.content.evidence.length > 0 && (
                        <div className="mb-3">
                          <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Evidentiary Citations</p>
                          <ul className="list-disc pl-4 text-[11px] text-[#0095F6] space-y-0.5">
                            {msg.content.evidence.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {msg.content.suggestedActions && msg.content.suggestedActions.length > 0 && (
                        <div className="mb-3 bg-[#181818] p-2.5 rounded-xl border border-[#262626]">
                          <p className="text-[10px] font-bold text-[#F59E0B] uppercase mb-1">Suggested Interventions</p>
                          <ul className="text-[11px] text-neutral-300 space-y-1">
                            {msg.content.suggestedActions.map((action: string, i: number) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="material-symbols-outlined text-[#F59E0B] text-[14px]">arrow_right</span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {msg.content.followUpQuestions && msg.content.followUpQuestions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-[#262626]">
                          <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1.5">Recommended Follow-ups</p>
                          <div className="flex flex-col gap-1.5">
                            {msg.content.followUpQuestions.map((q: string, i: number) => (
                              <button 
                                key={i}
                                onClick={() => handleCopilotQuery(q)}
                                className="text-left text-[11px] bg-[#181818] border border-[#262626] hover:border-[#E1306C] hover:text-[#E1306C] p-2 rounded-lg transition-colors cursor-pointer"
                              >
                                ➜ {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {isQuerying && (
                <div className="flex items-start">
                  <div className="bg-[#121212] border border-[#262626] p-3 rounded-xl rounded-tl-none text-xs text-neutral-400 flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-[16px] text-[#E1306C]">sync</span>
                    Correlating Intelligence Feeds...
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Bar */}
            <div className="p-4 border-t border-[#262626] bg-[#121212]">
              <div className="relative flex items-center bg-[#181818] border border-[#262626] rounded-xl overflow-hidden focus-within:border-[#737373] transition-colors">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCopilotQuery(chatInput)}
                  placeholder="Ask GARUDA Intelligence Copilot..." 
                  className="w-full bg-transparent border-none text-xs text-white px-3.5 py-3 focus:outline-none placeholder:text-neutral-500"
                />
                <button 
                  onClick={() => handleCopilotQuery(chatInput)}
                  disabled={!chatInput.trim() || isQuerying}
                  className="px-3.5 py-2.5 ig-gradient text-white disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
      
      {/* Bottom Institutional Status Ticker Footer */}
      <footer className="h-7 border-t border-[#262626] bg-black px-5 flex items-center justify-between text-[11px] text-neutral-400 select-none">
        <div className="flex gap-6 items-center">
          <span>Officer: <strong className="text-white font-semibold">{profile?.name || 'Inspector Rahul Verma'}</strong></span>
          <span className="hidden sm:inline">Alert Posture: <strong className="text-[#F59E0B] font-semibold">{threatLevel}</strong></span>
          <span className="hidden md:inline">ICCC Node: <strong className="text-emerald-400 font-mono font-medium">MP-INDORE-ICCC-01</strong></span>
        </div>
        <div className="text-[10px] text-neutral-500 font-medium tracking-wide">
          NATIONAL CRIME RECORDS BUREAU • MP POLICE COMMAND
        </div>
      </footer>
    </div>
  );
}
