import React, { useState } from 'react';

// Node data definitions for interactive selection
interface GraphNode {
  id: string;
  label: string;
  subtitle: string;
  type: 'suspect' | 'mule' | 'telecom' | 'crypto';
  x: number;
  y: number;
  r: number;
  degree: number;
  alias?: string;
  details?: {
    name: string;
    handle: string;
    aliasName: string;
    demographics: string;
    warrantStatus: string;
    statutes: string[];
    betweenness: string;
    betweennessNote: string;
    eigenvector: string;
    eigenvectorNote: string;
    directLinks: string;
    directLinksNote: string;
    partition: string;
    partitionNote: string;
    firs: string;
    calls: string;
    topAssociate: string;
    lastFix: string;
    frozenFunds: string;
    photoUrl?: string;
  };
}

const NODES_DATA: GraphNode[] = [
  {
    id: 'T-01',
    label: "Rakesh 'Kabir' Sharma",
    subtitle: 'Primary Syndicate Kingpin',
    type: 'suspect',
    x: 450,
    y: 270,
    r: 36,
    degree: 9,
    alias: 'Zero-One',
    details: {
      name: 'Rakesh Sharma',
      handle: '@kabir.sharma',
      aliasName: '"Zero-One"',
      demographics: 'Age 36 • Male • Aadhaar: **8821',
      warrantStatus: 'WARRANT ACTIVE // RED CORNER',
      statutes: ['BNS § 318(4)', 'BNS § 316(2)', 'BNS § 61(2)', 'IT Act 66D'],
      betweenness: '0.842',
      betweennessNote: 'Top 1% Critical Hub',
      eigenvector: '0.910',
      eigenvectorNote: 'Syndicate Core',
      directLinks: '14 Nodes',
      directLinksNote: '6 Bank, 5 Comms',
      partition: 'Cluster #01',
      partitionNote: 'North Cyber Ring',
      firs: '3 Pending (Delhi, Cyberabad)',
      calls: '412 Calls (Peak: 02:00 AM)',
      topAssociate: 'Farhan Qureshi (94 calls)',
      lastFix: 'Sec 18, GGN (TWR-88A)',
      frozenFunds: '₹1,84,20,000',
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoNY2WNnjrSBU-f5rzdavagYqN-xEKte_TRAyb2JPNE3A-lM7Bv27jMNcruAddyWmYpB3zIlrv3hxtGoljuoYA8Uu4UwFqvQpXL0BZp_Rly6vBTl2siyfUGChk7gfk-365QlcFDlEchW5Ll_-K8Or1eXTSqNXH1_9_p7US4FCn582wLx5-ETvFvHelx6OQfJfcyL353w5NIl8vwRz2zI1PWwJuQwfwgiCpPZScra_i5jFHJu19lA78ww'
    }
  },
  {
    id: 'M1',
    label: 'HDFC **9201',
    subtitle: 'Layer 1 Direct Mule',
    type: 'mule',
    x: 270,
    y: 180,
    r: 22,
    degree: 4,
    alias: 'HDFC Mule',
    details: {
      name: 'Account #4092-XXXX-9201',
      handle: '@mule.hdfc9201',
      aliasName: '"Rohit Kumar A/C"',
      demographics: 'IFSC: HDFC0001024 • Branch: Connaught Place',
      warrantStatus: 'FREEZE ORDER ISSUED // CR-412',
      statutes: ['BNS § 318(4)', 'PMLA § 3'],
      betweenness: '0.412',
      betweennessNote: 'Financial Chokepoint',
      eigenvector: '0.620',
      eigenvectorNote: 'Rapid Cash-out Node',
      directLinks: '4 Nodes',
      directLinksNote: 'Layer 1 Hawala Transit',
      partition: 'Cluster #02',
      partitionNote: 'Western Banking Relay',
      firs: '2 Attached Notices',
      calls: '58 Co-pings',
      topAssociate: 'T-01 Rakesh Sharma',
      lastFix: 'ATM withdrawal: Karol Bagh',
      frozenFunds: '₹42,50,000'
    }
  },
  {
    id: 'M2',
    label: 'ICICI **4418',
    subtitle: 'Rapid Cash-out',
    type: 'mule',
    x: 220,
    y: 280,
    r: 20,
    degree: 3,
    alias: 'ICICI Mule',
    details: {
      name: 'Account #0012-XXXX-4418',
      handle: '@mule.icici4418',
      aliasName: '"Pooja Verma A/C"',
      demographics: 'IFSC: ICIC0000012 • Branch: Nehru Place',
      warrantStatus: 'DEBIT SUSPENDED // FIU ALERT',
      statutes: ['BNS § 318(4)', 'BNS § 316(2)'],
      betweenness: '0.290',
      betweennessNote: 'Secondary Mule',
      eigenvector: '0.480',
      eigenvectorNote: 'Dispersal Node',
      directLinks: '3 Nodes',
      directLinksNote: 'ATM Quick Exits',
      partition: 'Cluster #02',
      partitionNote: 'Western Banking Relay',
      firs: '1 Attached Notice',
      calls: '24 Co-pings',
      topAssociate: 'T-01 Rakesh Sharma',
      lastFix: 'South Ext Part-II',
      frozenFunds: '₹18,20,000'
    }
  },
  {
    id: 'M3',
    label: 'Axis **0029',
    subtitle: 'Kuber Logistics',
    type: 'mule',
    x: 260,
    y: 390,
    r: 22,
    degree: 4,
    alias: 'Shell Kuber',
    details: {
      name: 'Kuber Logistics Pvt Ltd',
      handle: '@kuber.axis0029',
      aliasName: '"Shell Front #3"',
      demographics: 'GSTIN: 07AAACK1234F1Z9 • New Delhi',
      warrantStatus: 'ROC FRAUD SCRUTINY',
      statutes: ['BNS § 318(4)', 'BNS § 61(2)', 'Companies Act § 447'],
      betweenness: '0.512',
      betweennessNote: 'Corporate Layering',
      eigenvector: '0.590',
      eigenvectorNote: 'Hawala Shell Conduit',
      directLinks: '5 Nodes',
      directLinksNote: 'Commercial Pass-through',
      partition: 'Cluster #03',
      partitionNote: 'Corporate Hawala Layer',
      firs: '4 Linked Complaints',
      calls: '88 Intercepts',
      topAssociate: 'T-01 Rakesh Sharma',
      lastFix: 'Okhla Industrial Area Phase-III',
      frozenFunds: '₹1,23,50,000'
    }
  },
  {
    id: 'B1',
    label: 'IMEI 864291',
    subtitle: 'Rohini Sec-14',
    type: 'telecom',
    x: 430,
    y: 110,
    r: 20,
    degree: 3,
    alias: 'Burner Rohini',
    details: {
      name: 'Burner IMSI 404-45-88192',
      handle: '@burner.rohini',
      aliasName: '"IMEI 864291004829182"',
      demographics: 'Pre-activated SIM • Fake Assam KYC',
      warrantStatus: 'TELECOM INTERCEPT LAWFUL § 5(2)',
      statutes: ['Telecommunications Act 2023', 'IT Act 66D'],
      betweenness: '0.621',
      betweennessNote: 'Primary Command Line',
      eigenvector: '0.740',
      eigenvectorNote: 'Direct Kingpin Comms',
      directLinks: '3 Nodes',
      directLinksNote: '148 Encrypted Pings',
      partition: 'Cluster #04',
      partitionNote: 'North Comms Grid',
      firs: 'Intercept Authorization 881/2024',
      calls: '148 Calls Logged',
      topAssociate: 'T-01 Rakesh Sharma',
      lastFix: 'Rohini Sector-14 Tower 41B',
      frozenFunds: 'N/A (Hardware Asset)'
    }
  },
  {
    id: 'B2',
    label: 'IMEI 359102',
    subtitle: 'Dwarka Sec-21',
    type: 'telecom',
    x: 570,
    y: 130,
    r: 18,
    degree: 2,
    alias: 'Burner Dwarka',
    details: {
      name: 'Burner IMSI 404-45-91204',
      handle: '@burner.dwarka',
      aliasName: '"IMEI 359102009418290"',
      demographics: 'Pre-activated SIM • Fake Bihar KYC',
      warrantStatus: 'SILENT SMS LOCATED',
      statutes: ['IT Act 66D'],
      betweenness: '0.340',
      betweennessNote: 'Backup Handset',
      eigenvector: '0.410',
      eigenvectorNote: 'Secondary Ping Relay',
      directLinks: '2 Nodes',
      directLinksNote: '72 Intercepts',
      partition: 'Cluster #04',
      partitionNote: 'North Comms Grid',
      firs: 'Intercept Authorization 882/2024',
      calls: '72 Calls Logged',
      topAssociate: 'T-01 Rakesh Sharma',
      lastFix: 'Dwarka Sector-21 Metro Base',
      frozenFunds: 'N/A (Hardware Asset)'
    }
  },
  {
    id: 'W1',
    label: 'TRC20: TJu4...',
    subtitle: 'Settlement Pool',
    type: 'crypto',
    x: 680,
    y: 220,
    r: 22,
    degree: 3,
    alias: 'Tron Tether',
    details: {
      name: 'USDT Tron Wallet: TJu49X...8K2',
      handle: '@crypto.tron_tju4',
      aliasName: '"Tether Vault #1"',
      demographics: 'TRC-20 Blockchain • Created Oct 2023',
      warrantStatus: 'BINANCE/CHAINALYSIS FLAGGED',
      statutes: ['PMLA § 3', 'BNS § 318(4)'],
      betweenness: '0.780',
      betweennessNote: 'Offshore Hawala Outflow',
      eigenvector: '0.810',
      eigenvectorNote: 'Major Laundering Bridge',
      directLinks: '3 Nodes',
      directLinksNote: '115,000 USDT Balance',
      partition: 'Cluster #05',
      partitionNote: 'Decentralized Layer',
      firs: 'FIU-IND Crypto Dossier #99',
      calls: 'Automated Bot Triggers',
      topAssociate: 'Cold Mixer #4',
      lastFix: 'IP Geo: Phnom Penh, Cambodia (VPN)',
      frozenFunds: '115,000 USDT (~₹96.6L)'
    }
  },
  {
    id: 'MIX',
    label: 'Cold Mixer #4',
    subtitle: 'Tumbler Relay',
    type: 'crypto',
    x: 810,
    y: 150,
    r: 17,
    degree: 2,
    alias: 'Mixer Node',
    details: {
      name: 'Tornado/Tumbler Smart Contract',
      handle: '@tumbler.hop4',
      aliasName: '"Hop #4 Mixer"',
      demographics: 'Multi-hop decentralized tumbler',
      warrantStatus: 'OFAC/MHA SANCTIONED CONTRACT',
      statutes: ['PMLA § 3', 'IT Act 66F (Cyber Terrorism/Syndicate)'],
      betweenness: '0.450',
      betweennessNote: 'Trace Obfuscator',
      eigenvector: '0.520',
      eigenvectorNote: 'Egress Point',
      directLinks: '2 Nodes',
      directLinksNote: 'Hop #4 Cleanout',
      partition: 'Cluster #05',
      partitionNote: 'Decentralized Layer',
      firs: 'OFAC Cross-Ref Alert',
      calls: 'Smart Contract Events',
      topAssociate: 'TRC20 TJu4',
      lastFix: 'Decentralized Nodes',
      frozenFunds: 'Indeterminate'
    }
  },
  {
    id: 'T-03',
    label: 'Sunita Rao',
    subtitle: 'Cash Courier',
    type: 'suspect',
    x: 640,
    y: 360,
    r: 22,
    degree: 3,
    alias: 'ANPR DL-01',
    details: {
      name: 'Sunita Rao',
      handle: '@sunita.rao',
      aliasName: '"Cash Courier"',
      demographics: 'Age 31 • Female • DL: DL14201900192',
      warrantStatus: 'LOOKOUT NOTICE (LOC) PENDING',
      statutes: ['BNS § 318(4)', 'BNS § 61(2)'],
      betweenness: '0.640',
      betweennessNote: 'Physical Courier Lead',
      eigenvector: '0.710',
      eigenvectorNote: 'Co-travel Network',
      directLinks: '3 Nodes',
      directLinksNote: 'FASTag & Vehicle Linked',
      partition: 'Cluster #01',
      partitionNote: 'Physical Logistics',
      firs: 'FIR 412/2024 Annexure C',
      calls: '64 Intercepts',
      topAssociate: 'T-01 Rakesh Sharma',
      lastFix: 'Kherki Daula Toll (DL-10-CB-4491)',
      frozenFunds: '₹14,80,000 Seized'
    }
  },
  {
    id: 'T-05',
    label: 'Farhan Qureshi',
    subtitle: 'SIM Box Operator',
    type: 'suspect',
    x: 480,
    y: 450,
    r: 22,
    degree: 4,
    alias: 'SIM Operator',
    details: {
      name: 'Farhan Qureshi',
      handle: '@farhan.qureshi',
      aliasName: '"SIM Box Tech"',
      demographics: 'Age 29 • Male • Jamia Nagar, Delhi',
      warrantStatus: 'RAID SCHEDULED // NON-BAILABLE',
      statutes: ['BNS § 318(4)', 'Wireless Telegraphy Act § 6', 'IT Act 66D'],
      betweenness: '0.720',
      betweennessNote: 'Telecom Hub Operator',
      eigenvector: '0.760',
      eigenvectorNote: 'Call Termination Hub',
      directLinks: '4 Nodes',
      directLinksNote: '94 Intercepted Calls',
      partition: 'Cluster #01',
      partitionNote: 'North Cyber Ring',
      firs: 'FIR 412/2024 Annexure B',
      calls: '94 Intercepted Direct Calls',
      topAssociate: 'T-01 Rakesh Sharma',
      lastFix: 'Zakir Nagar SIM Box Den',
      frozenFunds: '₹8,50,000 Bank Hold'
    }
  },
  {
    id: 'SIM',
    label: 'Burner Pool (12)',
    subtitle: 'SIM Box Relay (64 ch)',
    type: 'telecom',
    x: 650,
    y: 470,
    r: 16,
    degree: 2,
    alias: 'SIM Array',
    details: {
      name: 'SIM Box Array #09 (64-slot)',
      handle: '@simbox.array09',
      aliasName: '"VoIP Gateway 64"',
      demographics: 'Physical SIM bank hardware • 64 active lines',
      warrantStatus: 'SEIZURE ORDER SEC § 102 CrPC',
      statutes: ['Indian Telegraph Act § 20', 'BNS § 318(4)'],
      betweenness: '0.380',
      betweennessNote: 'Relay Hardware',
      eigenvector: '0.450',
      eigenvectorNote: 'VoIP Spoof Conduit',
      directLinks: '2 Nodes',
      directLinksNote: '12 Live Traces',
      partition: 'Cluster #04',
      partitionNote: 'Telecom Infrastructure',
      firs: 'Seizure Memo 04/2024',
      calls: '8,400 Outbound Pings/Day',
      topAssociate: 'T-05 Farhan Qureshi',
      lastFix: 'Zakir Nagar Antenna Array',
      frozenFunds: 'N/A (Hardware Asset)'
    }
  }
];

export default function NetworkAnalysis({ user }: { user: any }) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [degreeCutoff, setDegreeCutoff] = useState<number>(2);
  const [showAliases, setShowAliases] = useState<boolean>(true);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [selectedNode, setSelectedNode] = useState<GraphNode>(NODES_DATA[0]);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => setActiveNotification(null), 3500);
  };

  const handleZoom = (factor: number) => {
    setZoomScale(prev => Math.max(0.6, Math.min(2.0, parseFloat((prev * factor).toFixed(2)))));
  };

  const resetZoom = () => {
    setZoomScale(1.0);
  };

  // Node filtering
  const visibleNodes = NODES_DATA.filter(node => {
    if (selectedFilter !== 'all' && node.type !== selectedFilter) return false;
    if (node.degree < degreeCutoff) return false;
    return true;
  });

  const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

  return (
    <div className="w-full min-h-screen bg-black text-neutral-100 font-sans pb-12">
      {/* Toast Notification */}
      {activeNotification && (
        <div className="fixed bottom-12 right-6 z-50 bg-[#181818] border border-[#dc2743]/50 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[#E1306C] text-[18px]">info</span>
          <span>{activeNotification}</span>
        </div>
      )}

      {/* SECTION 1: TOP CASE CONTEXT BAR & MULTI-FILTER DOCK */}
      <section className="flex flex-col bg-[#121212] border border-[#262626] rounded-2xl mb-4 overflow-hidden shadow-sm">
        {/* Master Dossier Header */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-[#121212] border-b border-[#262626] gap-3">
          <div className="flex flex-wrap items-center gap-4 min-w-0">
            <div className="flex items-center gap-1.5 bg-[#1f1215] border border-[#dc2743]/30 px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-[#E1306C] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              <span className="font-mono text-xs text-[#E1306C] font-semibold tracking-wide uppercase">CR-ND-2024-0819</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">SYNDICATE NIGHTFALL</span>
                <span className="text-neutral-600 text-xs">//</span>
                <span className="text-xs text-neutral-400 font-normal truncate">Inter-State Cyber Heist & Hawala Mule Syndicate</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-neutral-500 text-xs mt-0.5">
                <span>FIR No. 412/2024 PS Cyber Crime</span>
                <span className="text-neutral-700">•</span>
                <span className="text-neutral-400 font-mono text-[11px]">BNS § 318(4), 316(2), IT Act 66D</span>
                <span className="text-neutral-700">•</span>
                <span className="text-neutral-400">Special Cell Unit-8</span>
              </div>
            </div>
          </div>
          {/* Action Utilities */}
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => notify("AI Pathfinding: Shortest laundered money trail identified via HDFC 9201 -> TRC20 (4 hops)")}
              className="flex items-center gap-1.5 h-8 px-3.5 bg-[#1e1e1e] hover:bg-[#282828] text-neutral-200 text-xs font-semibold rounded-xl border border-[#2e2e2e] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#E1306C]">route</span>
              <span>AI Pathfinding</span>
            </button>
            <button 
              onClick={() => notify("Graph topology exported as cryptographic JSON audit dossier")}
              className="flex items-center gap-1.5 h-8 px-3.5 bg-[#1e1e1e] hover:bg-[#282828] text-neutral-200 text-xs font-semibold rounded-xl border border-[#2e2e2e] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-neutral-400">share</span>
              <span>Export</span>
            </button>
            <button 
              onClick={() => notify("Investigation snapshot #819 saved to secure cloud ledger")}
              className="flex items-center gap-1.5 h-8 px-4 ig-gradient hover:opacity-95 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">bookmark</span>
              <span>Save Snapshot</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#0a0a0a] overflow-x-auto text-xs select-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mr-1">ENTITIES:</span>
            
            <button 
              onClick={() => setSelectedFilter('all')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-sm ${
                selectedFilter === 'all' 
                  ? 'ig-gradient text-white' 
                  : 'bg-[#181818] border border-[#262626] hover:border-[#383838] text-neutral-300'
              }`}
            >
              <span>All Nodes</span>
              <span className="px-1.5 rounded-full bg-black/40 text-[10px] font-mono">48</span>
            </button>

            <button 
              onClick={() => setSelectedFilter('suspect')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedFilter === 'suspect' 
                  ? 'ig-gradient text-white font-semibold' 
                  : 'bg-[#181818] border border-[#262626] hover:border-[#383838] text-neutral-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#E1306C]"></span>
              <span>Suspects</span>
              <span className="px-1.5 rounded-full bg-[#262626] text-[10px] font-mono text-neutral-400">6</span>
            </button>

            <button 
              onClick={() => setSelectedFilter('mule')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedFilter === 'mule' 
                  ? 'ig-gradient text-white font-semibold' 
                  : 'bg-[#181818] border border-[#262626] hover:border-[#383838] text-neutral-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
              <span>Mule Accounts</span>
              <span className="px-1.5 rounded-full bg-[#262626] text-[10px] font-mono text-neutral-400">19</span>
            </button>

            <button 
              onClick={() => setSelectedFilter('telecom')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedFilter === 'telecom' 
                  ? 'ig-gradient text-white font-semibold' 
                  : 'bg-[#181818] border border-[#262626] hover:border-[#383838] text-neutral-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#0095F6]"></span>
              <span>Burner IMSIs</span>
              <span className="px-1.5 rounded-full bg-[#262626] text-[10px] font-mono text-neutral-400">15</span>
            </button>

            <button 
              onClick={() => setSelectedFilter('crypto')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedFilter === 'crypto' 
                  ? 'ig-gradient text-white font-semibold' 
                  : 'bg-[#181818] border border-[#262626] hover:border-[#383838] text-neutral-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#833AB4]"></span>
              <span>Wallets</span>
              <span className="px-1.5 rounded-full bg-[#262626] text-[10px] font-mono text-neutral-400">8</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-neutral-400 text-xs shrink-0">
            <span className="flex items-center gap-1 text-[#0095F6] font-medium">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              BSA § 65B Certified
            </span>
            <span className="text-neutral-700">|</span>
            <span className="text-neutral-500 font-mono text-[11px]">Latency: 18ms</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: WORKSPACE (SPLIT VIEW: CENTER-LEFT CANVAS + RIGHT INSPECTOR) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
        {/* CENTER-LEFT: ENTERPRISE NODE-LINK NETWORK CANVAS (COL-8) */}
        <div className="xl:col-span-8 flex flex-col bg-[#121212] border border-[#262626] shadow-sm rounded-2xl overflow-hidden relative min-h-[580px]">
          {/* Interactive Floating HUD Overlay (Top of Canvas) */}
          <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between px-3 py-2 bg-[#181818]/90 backdrop-blur-md border border-[#282828] rounded-xl gap-2 select-none">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#212121] px-2.5 py-1 rounded-lg border border-[#2d2d2d]">
                <span className="material-symbols-outlined text-[15px] text-[#E1306C]">bubble_chart</span>
                <span className="text-xs font-semibold text-neutral-200">FA2 FORCE GRAPH</span>
              </div>
              <div className="flex items-center gap-2 bg-[#212121] px-2.5 py-1 rounded-lg border border-[#2d2d2d]">
                <span className="text-[11px] text-neutral-400 font-medium">DEGREE:</span>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={degreeCutoff} 
                  onChange={(e) => setDegreeCutoff(parseInt(e.target.value))}
                  className="w-16 h-1 bg-[#333] rounded-full cursor-pointer accent-[#E1306C]" 
                />
                <span className="text-xs font-mono font-bold text-[#E1306C]">≥{degreeCutoff}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#212121] border border-[#2d2d2d] rounded-lg text-xs">
                <span className="text-neutral-400">MODULARITY:</span>
                <span className="text-emerald-400 font-mono font-medium">Q=0.71</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-neutral-300 text-xs cursor-pointer px-2.5 py-1 bg-[#212121] border border-[#2d2d2d] rounded-lg">
                <input 
                  type="checkbox" 
                  checked={showAliases} 
                  onChange={(e) => setShowAliases(e.target.checked)}
                  className="rounded bg-[#282828] border-neutral-700 text-[#E1306C] focus:ring-0" 
                />
                <span className="font-medium">Aliases</span>
              </label>

              <div className="flex items-center bg-[#212121] border border-[#2d2d2d] rounded-lg p-0.5">
                <button 
                  onClick={() => handleZoom(1.15)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-[#2d2d2d] text-neutral-300 rounded" 
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
                <button 
                  onClick={() => handleZoom(0.85)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-[#2d2d2d] text-neutral-300 rounded" 
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <button 
                  onClick={resetZoom}
                  className="w-6 h-6 flex items-center justify-center hover:bg-[#2d2d2d] text-neutral-300 rounded" 
                  title="Reset Viewport"
                >
                  <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
                </button>
              </div>
            </div>
          </div>

          {/* Graph Canvas Visualizer Area */}
          <div className="relative w-full h-[580px] bg-[#0c0c0c] flex items-center justify-center overflow-hidden">
            {/* Dot Coordinate Grid Pattern Background */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.75" fill="#555555"></circle>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotGrid)"></rect>
            </svg>

            {/* Coordinate overlay watermark */}
            <div className="absolute top-14 left-4 font-mono text-[10px] text-neutral-600 pointer-events-none select-none">
              TOPOLOGY MATRIX // NCRB INTELLIGENCE GRAPH // EPSG:3857
            </div>

            {/* Master SVG Graph Network */}
            <svg 
              className="w-full h-full select-none transition-transform duration-200 ease-out" 
              viewBox="0 0 900 560" 
              preserveAspectRatio="xMidYMid meet"
              style={{ transform: `scale(${zoomScale})` }}
            >
              <defs>
                {/* Instagram Sunset Linear Gradient for Target Ring */}
                <linearGradient id="igGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f09433"></stop>
                  <stop offset="25%" stopColor="#e6683c"></stop>
                  <stop offset="50%" stopColor="#dc2743"></stop>
                  <stop offset="75%" stopColor="#cc2366"></stop>
                  <stop offset="100%" stopColor="#bc1888"></stop>
                </linearGradient>

                {/* Markers */}
                <marker id="arrowAmber" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b"></path>
                </marker>
                <marker id="arrowBlue" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#0095F6"></path>
                </marker>
                <marker id="arrowPurple" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#833AB4"></path>
                </marker>
                <marker id="arrowPink" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#E1306C"></path>
                </marker>
              </defs>

              {/* Graph Edges / Links */}
              <g className="stroke-linecap-round stroke-linejoin-round opacity-80">
                {visibleNodeIds.has('T-01') && visibleNodeIds.has('M1') && (
                  <>
                    <line x1="450" y1="270" x2="270" y2="180" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="3,3" markerEnd="url(#arrowAmber)"></line>
                    <text x="340" y="215" fill="#f59e0b" textAnchor="middle" className="font-sans text-[10px] font-medium" transform="rotate(26, 340, 215)">₹42.5L Hawala Flow</text>
                  </>
                )}

                {visibleNodeIds.has('T-01') && visibleNodeIds.has('M2') && (
                  <>
                    <line x1="450" y1="270" x2="220" y2="280" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowAmber)"></line>
                    <text x="325" y="270" fill="#f59e0b" textAnchor="middle" className="font-sans text-[10px] font-medium">₹18.2L Split</text>
                  </>
                )}

                {visibleNodeIds.has('T-01') && visibleNodeIds.has('M3') && (
                  <>
                    <line x1="450" y1="270" x2="260" y2="390" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowAmber)"></line>
                    <text x="345" y="340" fill="#f59e0b" textAnchor="middle" className="font-sans text-[10px] font-medium" transform="rotate(-30, 345, 340)">Corporate Layering</text>
                  </>
                )}

                {visibleNodeIds.has('T-01') && visibleNodeIds.has('B1') && (
                  <>
                    <line x1="450" y1="270" x2="430" y2="110" stroke="#0095F6" strokeWidth="1.8" markerEnd="url(#arrowBlue)"></line>
                    <text x="450" y="180" fill="#0095F6" className="font-sans text-[10px] font-medium">148 CDR Calls</text>
                  </>
                )}

                {visibleNodeIds.has('T-01') && visibleNodeIds.has('B2') && (
                  <>
                    <line x1="450" y1="270" x2="570" y2="130" stroke="#0095F6" strokeWidth="1.5" markerEnd="url(#arrowBlue)"></line>
                    <text x="525" y="195" fill="#0095F6" textAnchor="middle" className="font-sans text-[10px] font-medium" transform="rotate(-45, 525, 195)">72 Pings</text>
                  </>
                )}

                {visibleNodeIds.has('T-01') && visibleNodeIds.has('W1') && (
                  <>
                    <line x1="450" y1="270" x2="680" y2="220" stroke="#833AB4" strokeWidth="2" strokeDasharray="4,2" markerEnd="url(#arrowPurple)"></line>
                    <text x="570" y="235" fill="#c084fc" className="font-sans text-[10px] font-medium" transform="rotate(-12, 570, 235)">115,000 USDT Stash</text>
                  </>
                )}

                {visibleNodeIds.has('W1') && visibleNodeIds.has('MIX') && (
                  <>
                    <line x1="680" y1="220" x2="810" y2="150" stroke="#833AB4" strokeWidth="1.2" strokeDasharray="2,2" markerEnd="url(#arrowPurple)"></line>
                    <text x="745" y="175" fill="#c084fc" className="font-sans text-[9px] font-medium">Tumbler Hop #4</text>
                  </>
                )}

                {visibleNodeIds.has('T-01') && visibleNodeIds.has('T-03') && (
                  <>
                    <line x1="450" y1="270" x2="640" y2="360" stroke="#E1306C" strokeWidth="2" markerEnd="url(#arrowPink)"></line>
                    <text x="540" y="330" fill="#E1306C" textAnchor="middle" className="font-sans text-[10px] font-medium" transform="rotate(24, 540, 330)">ANPR Co-travel DL-01</text>
                  </>
                )}

                {visibleNodeIds.has('T-01') && visibleNodeIds.has('T-05') && (
                  <>
                    <line x1="450" y1="270" x2="480" y2="450" stroke="#E1306C" strokeWidth="2" markerEnd="url(#arrowPink)"></line>
                    <text x="475" y="375" fill="#E1306C" className="font-sans text-[10px] font-medium">94 Intercepts</text>
                  </>
                )}

                {visibleNodeIds.has('T-05') && visibleNodeIds.has('SIM') && (
                  <>
                    <line x1="480" y1="450" x2="650" y2="470" stroke="#0095F6" strokeWidth="1.5" strokeDasharray="3,3" markerEnd="url(#arrowBlue)"></line>
                    <text x="560" y="475" fill="#0095F6" className="font-sans text-[9px] font-medium">SIM Box Relay (64 ch)</text>
                  </>
                )}
              </g>

              {/* Graph Nodes */}
              <g className="cursor-pointer">
                {visibleNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isKingpin = node.id === 'T-01';

                  if (isKingpin) {
                    return (
                      <g 
                        key={node.id} 
                        transform={`translate(${node.x}, ${node.y})`}
                        onClick={() => setSelectedNode(node)}
                        className="transition-transform hover:scale-105"
                      >
                        {/* Instagram Story Ring outer circle */}
                        <circle cx="0" cy="0" r="44" fill="none" stroke="url(#igGrad)" strokeWidth="3"></circle>
                        {/* Gap space */}
                        <circle cx="0" cy="0" r="40" fill="#0c0c0c"></circle>
                        <circle cx="0" cy="0" r="36" fill="#181818" stroke={isSelected ? '#E1306C' : '#262626'} strokeWidth={isSelected ? 2 : 1}></circle>
                        <circle cx="0" cy="0" r="16" fill="#E1306C"></circle>
                        <text x="0" y="4" fill="#ffffff" textAnchor="middle" className="font-sans text-xs font-bold">T-01</text>
                        
                        <g transform="translate(0, 56)">
                          <rect x="-90" y="-10" width="180" height="24" rx="12" fill="#181818" stroke="#262626" strokeWidth="1"></rect>
                          <text x="0" y="6" fill="#ffffff" textAnchor="middle" className="font-sans text-[11px] font-semibold">{node.label}</text>
                        </g>
                        {showAliases && (
                          <text x="0" y="82" fill="#a8a8a8" textAnchor="middle" className="font-sans text-[10px] font-medium">{node.subtitle}</text>
                        )}
                      </g>
                    );
                  }

                  // Mule / Telecom / Crypto / Sub-operative standard nodes
                  const strokeColor = node.type === 'mule' 
                    ? '#f59e0b' 
                    : node.type === 'telecom' 
                    ? '#0095F6' 
                    : node.type === 'crypto' 
                    ? '#833AB4' 
                    : '#E1306C';

                  const fillColor = strokeColor;

                  return (
                    <g 
                      key={node.id} 
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => setSelectedNode(node)}
                      className="transition-transform hover:scale-105"
                    >
                      <circle 
                        cx="0" 
                        cy="0" 
                        r={node.r} 
                        fill="#181818" 
                        stroke={isSelected ? '#ffffff' : strokeColor} 
                        strokeWidth={isSelected ? 3 : 2}
                        strokeDasharray={node.id === 'MIX' ? '3,3' : undefined}
                      ></circle>
                      {node.id !== 'MIX' && (
                        <circle cx="0" cy="0" r={node.r > 20 ? 9 : 7} fill={fillColor}></circle>
                      )}
                      <text 
                        x="0" 
                        y="3" 
                        fill={node.type === 'mule' ? '#000000' : '#ffffff'} 
                        textAnchor="middle" 
                        className="font-mono text-[9px] font-bold"
                      >
                        {node.id}
                      </text>
                      <text 
                        x="0" 
                        y={node.r + 13} 
                        fill="#ffffff" 
                        textAnchor="middle" 
                        className="font-sans text-[11px] font-semibold"
                      >
                        {node.label}
                      </text>
                      {showAliases && (
                        <text 
                          x="0" 
                          y={node.r + 25} 
                          fill="#a8a8a8" 
                          textAnchor="middle" 
                          className="font-sans text-[9px]"
                        >
                          {node.subtitle}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Canvas Legend & Graph Status (Bottom-Left) */}
            <div className="absolute bottom-3 left-3 z-20 flex flex-col bg-[#181818]/90 backdrop-blur-md border border-[#282828] px-3.5 py-2.5 rounded-xl text-neutral-300 text-xs select-none">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">NETWORK LEGEND:</span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E1306C]"></span>
                  <span className="text-[11px] text-neutral-300">Key Suspect</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                  <span className="text-[11px] text-neutral-300">Financial Mule</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0095F6]"></span>
                  <span className="text-[11px] text-neutral-300">Telecom / Burner</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#833AB4]"></span>
                  <span className="text-[11px] text-neutral-300">Hawala / Crypto</span>
                </div>
              </div>
            </div>

            {/* Zoom Ratio Indicator (Bottom-Right) */}
            <div className="absolute bottom-3 right-3 z-20 px-3 py-1 bg-[#181818]/90 border border-[#282828] rounded-full text-[11px] font-mono text-neutral-400">
              SCALE: {Math.round(zoomScale * 100)}% • {visibleNodes.length} NODES
            </div>
          </div>
        </div>

        {/* RIGHT: INSPECTOR PANEL (INSTAGRAM AUTHENTIC SUSPECT DOSSIER - COL-4) */}
        <div className="xl:col-span-4 flex flex-col bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
          {/* Docket Utility Ribbon */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#181818] border-b border-[#262626] text-white">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#E1306C] text-[18px]">verified_user</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">SUSPECT PROFILE // TARGET</span>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-[#262626] text-white rounded-md">ID: {selectedNode.id}</span>
          </div>

          <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[540px]">
            {/* Profile Identity & Mugshot Card with Instagram Story Ring */}
            <div className="flex items-center gap-4 p-3.5 bg-[#181818] border border-[#262626] rounded-xl">
              <div className="relative shrink-0 ig-border-ring rounded-full">
                {selectedNode.details?.photoUrl ? (
                  <img 
                    src={selectedNode.details.photoUrl} 
                    alt="Suspect Mugshot"
                    className="w-16 h-16 rounded-full object-cover border-2 border-black" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#222] flex items-center justify-center border-2 border-black text-[#E1306C] font-bold text-lg">
                    {selectedNode.id}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#E1306C] border-2 border-black flex items-center justify-center text-[10px] text-white font-bold">!</span>
              </div>
              
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm font-bold text-white truncate">{selectedNode.details?.name || selectedNode.label}</span>
                    <span className="material-symbols-outlined text-[#0095F6] text-[16px] shrink-0">verified</span>
                  </div>
                </div>
                <div className="text-xs text-neutral-400 truncate mt-0.5">
                  {selectedNode.details?.handle} • <span className="text-neutral-200">{selectedNode.details?.aliasName}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500 truncate">
                  <span>{selectedNode.details?.demographics}</span>
                </div>
                {/* Status Tag */}
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#251016] border border-[#dc2743]/30 rounded-full text-[#E1306C] text-[10px] font-semibold w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] animate-pulse"></span>
                  {selectedNode.details?.warrantStatus || 'STATUS: UNDER ACTIVE INVESTIGATION'}
                </div>
              </div>
            </div>

            {/* Statutory Section Coverage */}
            <div className="flex flex-col gap-1.5 p-3 bg-[#181818] border border-[#262626] rounded-xl text-xs">
              <span className="text-neutral-400 text-[10px] uppercase font-semibold tracking-wider">CHARGED STATUTES</span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedNode.details?.statutes || ['BNS § 318(4)', 'IT Act 66D']).map((statute, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-[#242424] text-neutral-200 rounded-md text-[11px] font-mono">
                    {statute}
                  </span>
                ))}
              </div>
            </div>

            {/* Centrality & Graph Intelligence Metrics */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">NETWORK METRICS & SCORES</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#181818] border border-[#262626] rounded-xl flex flex-col">
                  <span className="text-[10px] text-neutral-400 font-medium">BETWEENNESS</span>
                  <span className="text-lg font-bold text-white tracking-tight mt-0.5">{selectedNode.details?.betweenness || '0.742'}</span>
                  <span className="text-[10px] text-[#E1306C] font-semibold mt-0.5">{selectedNode.details?.betweennessNote || 'Critical Hub'}</span>
                </div>
                <div className="p-3 bg-[#181818] border border-[#262626] rounded-xl flex flex-col">
                  <span className="text-[10px] text-neutral-400 font-medium">EIGENVECTOR</span>
                  <span className="text-lg font-bold text-white tracking-tight mt-0.5">{selectedNode.details?.eigenvector || '0.810'}</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">{selectedNode.details?.eigenvectorNote || 'High Influence'}</span>
                </div>
                <div className="p-3 bg-[#181818] border border-[#262626] rounded-xl flex flex-col">
                  <span className="text-[10px] text-neutral-400 font-medium">DIRECT LINKS</span>
                  <span className="text-sm font-semibold text-white mt-0.5">{selectedNode.details?.directLinks || `${selectedNode.degree} Nodes`}</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">{selectedNode.details?.directLinksNote || 'Active Associations'}</span>
                </div>
                <div className="p-3 bg-[#181818] border border-[#262626] rounded-xl flex flex-col">
                  <span className="text-[10px] text-neutral-400 font-medium">PARTITION</span>
                  <span className="text-sm font-semibold text-white mt-0.5">{selectedNode.details?.partition || 'Cluster #01'}</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">{selectedNode.details?.partitionNote || 'Syndicate Core'}</span>
                </div>
              </div>
            </div>

            {/* Telemetry & Linkage Matrix */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">LIVE SURVEILLANCE TELEMETRY</span>
              <div className="p-3 bg-[#181818] border border-[#262626] rounded-xl flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Pending Court FIRs:</span>
                  <span className="text-white font-medium">{selectedNode.details?.firs || '2 Pending'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Intercepted Calls:</span>
                  <span className="text-neutral-200 font-mono">{selectedNode.details?.calls || '180 Calls'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Top Associate:</span>
                  <span className="text-[#E1306C] font-semibold">{selectedNode.details?.topAssociate || 'T-01 Rakesh Sharma'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Last Tower Fix:</span>
                  <span className="text-emerald-400 font-medium">{selectedNode.details?.lastFix || 'NCR Regional Tower 2'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Frozen Mule Funds:</span>
                  <span className="text-[#F59E0B] font-bold">{selectedNode.details?.frozenFunds || '₹45,00,000'}</span>
                </div>
              </div>
            </div>

            {/* Inspector CTAs (Clean Instagram Styling) */}
            <div className="flex flex-col gap-2 mt-1">
              <button 
                onClick={() => notify(`Court Dossier for ${selectedNode.label} generated under BSA § 65B hash verification`)}
                className="w-full flex items-center justify-center gap-2 h-9 ig-gradient hover:opacity-95 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Export Court Dossier (BSA § 65B)</span>
              </button>
              <button 
                onClick={() => notify(`Red Corner LOC Broadcast triggered for ${selectedNode.label} across inter-state police units`)}
                className="w-full flex items-center justify-center gap-2 h-8 bg-[#181818] hover:bg-[#222222] border border-[#262626] text-neutral-300 text-xs font-medium rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#E1306C]">notification_important</span>
                <span>Broadcast Red Corner LOC</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: BOTTOM MULTI-SOURCE INGESTION FEED & TELEMETRY TIMELINE */}
      <section className="flex flex-col bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
        {/* Feed Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#181818] border-b border-[#262626] text-white">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wide uppercase text-neutral-200">LIVE MULTI-SOURCE INGESTION FEED</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="font-mono text-[11px]">WEBSOCKET: LIVE</span>
            <span className="text-neutral-700">•</span>
            <span className="text-neutral-400 text-xs font-medium">5 Events Buffered</span>
          </div>
        </div>

        {/* Tabular Ingestion Stream */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0a0a0a] text-neutral-500 border-b border-[#262626]">
                <th className="py-2.5 px-5 text-[10px] font-semibold tracking-wider uppercase w-28">TIMESTAMP</th>
                <th className="py-2.5 px-5 text-[10px] font-semibold tracking-wider uppercase w-44">SUBSYSTEM</th>
                <th className="py-2.5 px-5 text-[10px] font-semibold tracking-wider uppercase">RAW TELEMETRY / STATUTORY PAYLOAD</th>
                <th className="py-2.5 px-5 text-[10px] font-semibold tracking-wider uppercase w-32 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c]">
              {/* Event 1: Tower Ping */}
              <tr className="hover:bg-[#181818] transition-colors">
                <td className="py-3 px-5 text-neutral-400 font-mono text-[11px] whitespace-nowrap">04:12:09 IST</td>
                <td className="py-3 px-5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#142334] text-[#0095F6] border border-[#0095F6]/20 rounded-full text-[11px] font-medium">
                    <span className="material-symbols-outlined text-[13px]">cell_tower</span>
                    <span>Cell Tower</span>
                  </span>
                </td>
                <td className="py-3 px-5 text-neutral-300">
                  Burner IMSI <span className="text-white font-mono font-semibold">404-45-88192</span> pinged Sector 29 tower (<span className="text-neutral-400">GGN-TWR-92B</span>), handoff from Rohini.
                </td>
                <td className="py-3 px-5 text-right whitespace-nowrap">
                  <button 
                    onClick={() => notify("Plotted GGN-TWR-92B fix onto GIS Map")}
                    className="px-3 py-1 bg-[#1e1e1e] hover:bg-[#282828] text-white border border-[#2e2e2e] rounded-lg text-xs font-medium transition-colors"
                  >
                    Plot Fix
                  </button>
                </td>
              </tr>

              {/* Event 2: Bank Outflow (FIU-IND) */}
              <tr className="hover:bg-[#181818] transition-colors">
                <td className="py-3 px-5 text-neutral-400 font-mono text-[11px] whitespace-nowrap">04:08:44 IST</td>
                <td className="py-3 px-5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#2e1d0d] text-[#F59E0B] border border-[#F59E0B]/20 rounded-full text-[11px] font-medium">
                    <span className="material-symbols-outlined text-[13px]">account_balance</span>
                    <span>Bank Alert</span>
                  </span>
                </td>
                <td className="py-3 px-5 text-neutral-300">
                  Suspicious RTGS Outflow of <span className="text-[#F59E0B] font-bold">₹28,50,000</span> flagged on HDFC A/C <span className="text-white font-mono">**9201</span> to Overseas Wire Gateway. Auto-hold.
                </td>
                <td className="py-3 px-5 text-right whitespace-nowrap">
                  <button 
                    onClick={() => notify("Emergency freeze request transmitted to HDFC Nodal Officer")}
                    className="px-3 py-1 bg-[#2e1d0d] hover:bg-[#3d2711] text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Freeze A/C
                  </button>
                </td>
              </tr>

              {/* Event 3: FIR Sync (CCTNS) */}
              <tr className="hover:bg-[#181818] transition-colors">
                <td className="py-3 px-5 text-neutral-400 font-mono text-[11px] whitespace-nowrap">03:55:12 IST</td>
                <td className="py-3 px-5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#251016] text-[#E1306C] border border-[#E1306C]/20 rounded-full text-[11px] font-medium">
                    <span className="material-symbols-outlined text-[13px]">folder</span>
                    <span>FIR Sync</span>
                  </span>
                </td>
                <td className="py-3 px-5 text-neutral-300">
                  Supplemental Chargesheet filed under <span className="text-white font-mono">BNS § 318(4)</span> by PS Cyber South Delhi. Accused T-01 added to absconder annexure.
                </td>
                <td className="py-3 px-5 text-right whitespace-nowrap">
                  <button 
                    onClick={() => notify("Opening CCTNS Case Docket CR-ND-2024-0819")}
                    className="px-3 py-1 bg-[#1e1e1e] hover:bg-[#282828] text-white border border-[#2e2e2e] rounded-lg text-xs font-medium transition-colors"
                  >
                    View Docket
                  </button>
                </td>
              </tr>

              {/* Event 4: ANPR Toll Trigger */}
              <tr className="hover:bg-[#181818] transition-colors">
                <td className="py-3 px-5 text-neutral-400 font-mono text-[11px] whitespace-nowrap">03:41:20 IST</td>
                <td className="py-3 px-5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#251016] text-[#dc2743] border border-[#dc2743]/20 rounded-full text-[11px] font-medium">
                    <span className="material-symbols-outlined text-[13px]">videocam</span>
                    <span>ANPR Toll</span>
                  </span>
                </td>
                <td className="py-3 px-5 text-neutral-300">
                  FASTag trigger at Kherki Daula Toll plaza (<span className="text-white font-mono font-semibold">DL-10-CB-4491</span>, White Creta) tied to suspect <span className="text-[#E1306C] font-semibold">T-03 Sunita Rao</span>.
                </td>
                <td className="py-3 px-5 text-right whitespace-nowrap">
                  <button 
                    onClick={() => notify("Patrol intercept alert sent to Highway PCR Unit 14")}
                    className="px-3 py-1 bg-[#251016] hover:bg-[#381520] text-[#E1306C] border border-[#dc2743]/30 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Alert Patrol
                  </button>
                </td>
              </tr>

              {/* Event 5: Silent SMS Burst */}
              <tr className="hover:bg-[#181818] transition-colors">
                <td className="py-3 px-5 text-neutral-400 font-mono text-[11px] whitespace-nowrap">03:15:00 IST</td>
                <td className="py-3 px-5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#142334] text-[#0095F6] border border-[#0095F6]/20 rounded-full text-[11px] font-medium">
                    <span className="material-symbols-outlined text-[13px]">sms</span>
                    <span>Silent SMS</span>
                  </span>
                </td>
                <td className="py-3 px-5 text-neutral-300">
                  Type-0 (Silent SMS) receipt acknowledged on target burner #2 (<span className="text-white font-mono">+91 98110-XXXXX</span>). Base Station: Dwarka Sector 21.
                </td>
                <td className="py-3 px-5 text-right whitespace-nowrap">
                  <button 
                    onClick={() => notify("IMSI cryptographic handshake verified with TSP")}
                    className="px-3 py-1 bg-[#1e1e1e] hover:bg-[#282828] text-white border border-[#2e2e2e] rounded-lg text-xs font-medium transition-colors"
                  >
                    Verify IMSI
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
