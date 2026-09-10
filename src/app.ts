import express from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { requireAuth, AuthRequest } from './middleware/auth.ts';
import { db } from './db/index.ts';
import { sql } from 'drizzle-orm';

export function createApp() {
  const app = express();
  app.use(express.json());

  const router = express.Router();
  const JWT_SECRET = process.env.JWT_SECRET || 'garuda-ai-sih-secret-2025';

  // Demo user credentials suitable for MP Police / SIH presentation
  const USERS = [
    { id: '1', email: 'officer@mppolice.gov.in', password: 'Officer@123', name: 'Inspector Rahul Verma', role: 'Indore Crime Branch Lead' },
    { id: '2', email: 'officer@police.gov.in', password: 'Officer@123', name: 'Inspector Rahul Verma', role: 'Indore Crime Branch Lead' },
    { id: '3', email: 'admin@mppolice.gov.in', password: 'Admin@123', name: 'DGP S. Ramanathan', role: 'MP Police Command Director' },
    { id: '4', email: 'admin@police.gov.in', password: 'Admin@123', name: 'DGP S. Ramanathan', role: 'MP Police Command Director' },
    { id: '5', email: 'analyst@mppolice.gov.in', password: 'Analyst@123', name: 'Dr. Ananya Iyer', role: 'Cyber & Forensic Specialist' },
    { id: '6', email: 'patrol@mppolice.gov.in', password: 'Patrol@123', name: 'Sub-Inspector Vikram Singh', role: 'Indore QRT Lead' }
  ];

  // In-memory FIR database for Indore & Madhya Pradesh
  let FIR_DATABASE = [
    {
      id: "FIR-882-2023",
      firNumber: "FIR #882/2023",
      title: "Armed Robbery & Extortion Syndicate (Sarafa & AB Road)",
      station: "Vijay Nagar Police Station",
      district: "Indore",
      date: "2024-11-14",
      status: "Active Investigation",
      severity: "Critical",
      ipcSections: ["IPC 392", "IPC 384", "IPC 120B"],
      primarySuspect: "Ravi Kumar (Alias: RK)",
      vehicleLinked: "MP-09-CB-4592 (Black Scorpio)",
      aiRiskRating: 94,
      synopsis: "Coordinated extortion and armed robbery targeting high-value bullion merchants and logistics hubs along AB Road and Vijay Nagar. Suspects used cloned MP-09 plates and encrypted burner SIMs."
    },
    {
      id: "FIR-2341-2023",
      firNumber: "FIR #2341/2023",
      title: "Cyber Loan Extortion & Bank Gateway Ransomware",
      station: "Cyber Crime Cell (Palasia)",
      district: "Indore",
      date: "2024-12-02",
      status: "Forensic Audit",
      severity: "High",
      ipcSections: ["IT Act 66D", "IPC 420", "IPC 506"],
      primarySuspect: "Vikram Das (Alias: Shadow404)",
      vehicleLinked: "None (Digital Cloud Trail)",
      aiRiskRating: 88,
      synopsis: "Targeted spear-phishing attack compromising banking API gateways in Indore financial district. Layered transfers of ₹42 Lakhs via nested cryptocurrency wallets."
    },
    {
      id: "FIR-1092-2024",
      firNumber: "FIR #1092/2024",
      title: "Inter-District Vehicle Theft Ring (Bypass Corridor)",
      station: "Rau Police Station (Bypass)",
      district: "Indore",
      date: "2025-01-18",
      status: "Warrant Issued",
      severity: "High",
      ipcSections: ["IPC 379", "IPC 411", "IPC 468"],
      primarySuspect: "Mohammed Farhan",
      vehicleLinked: "MP-09-HG-1120 (Royal Enfield)",
      aiRiskRating: 82,
      synopsis: "Theft of premium SUVs along the Indore-Dewas bypass fitted with fake Madhya Pradesh registration plates and tampered engine chassis."
    },
    {
      id: "FIR-0455-2024",
      firNumber: "FIR #0455/2024",
      title: "Synthetic Contraband Distribution Channel",
      station: "Sarafa Police Chowki",
      district: "Indore",
      date: "2025-02-05",
      status: "Under Surveillance",
      severity: "Critical",
      ipcSections: ["NDPS Act 21", "NDPS Act 29"],
      primarySuspect: "Priya Sundaram",
      vehicleLinked: "MP-04-AB-9872 (Bhopal Registered)",
      aiRiskRating: 89,
      synopsis: "Distribution hub for synthetic contraband across nightlife venues in Vijay Nagar and Palasia identified using dead-drop lockboxes."
    }
  ];

  let CURRENT_THREAT_LEVEL = {
    level: "DEFCON 2 - ELEVATED",
    code: "AMBER",
    updatedAt: new Date().toISOString(),
    activeAdvisories: 3
  };

  // Active Indore Patrol Units
  let ACTIVE_PATROLS = [
    { id: "P-01", unit: "Cheetah Mobile 1", lat: 22.7533, lng: 75.8937, status: "Patrolling", battery: "92%", officer: "SI Vikram (Vijay Nagar)" },
    { id: "P-02", unit: "Safe City Drone Alpha", lat: 22.7196, lng: 75.8577, status: "Airborne", battery: "74%", officer: "AI Autonomous (Rajwada)" },
    { id: "P-03", unit: "Malwa Highway Patrol 4", lat: 22.6288, lng: 75.8118, status: "Dispatched", battery: "88%", officer: "Insp. S. Rao (Rau Bypass)" }
  ];

  // === Authentication API ===
  router.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = USERS.find(u => u.email.toLowerCase() === email?.toLowerCase() && u.password === password);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials. Use officer@mppolice.gov.in / Officer@123' });
      }

      const token = jwt.sign(
        { uid: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ message: 'Login successful', token, user: { uid: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  router.get('/auth/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      res.json({ user: req.user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // === System & Health API ===
  router.get('/system/health', (req, res) => {
    res.json({ status: 'Nominal', uptime: process.uptime(), engine: 'GARUDA Core 3.2-DEFENSE (MP POLICE)' });
  });

  router.get('/system/db-status', async (req, res) => {
    try {
      if (db) {
        await db.execute(sql`SELECT 1`);
        return res.json({ status: 'Synchronized (Postgres)', mode: 'Production' });
      }
      res.json({ status: 'Synchronized (Indore Smart City In-Memory Cluster)', mode: 'SIH Live Demo' });
    } catch (error) {
      res.json({ status: 'Synchronized (Indore Smart City In-Memory Cluster)', mode: 'SIH Live Demo' });
    }
  });

  router.get('/dashboard/summary', requireAuth, async (req, res) => {
    res.json({
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
        { id: "INC-8918", time: "1h 10m ago", station: "Rau Bypass", type: "Highway Transport Hijacking Attempt", priority: "P1 - Urgent", status: "BOLO Broadcasted", location: "Silicon City Circle" },
        { id: "INC-8917", time: "1h 45m ago", station: "Bhanwarkuan", type: "Residential PG Burglary", priority: "P2 - Priority", status: "Investigation Open", location: "Bholaram Ustad Marg" }
      ],
      threatLevel: CURRENT_THREAT_LEVEL
    });
  });

  // === FIR Case Repository API ===
  router.get('/firs', requireAuth, (req, res) => {
    const q = (req.query.q as string || '').toLowerCase();
    const severity = req.query.severity as string || '';

    let results = FIR_DATABASE;
    if (q) {
      results = results.filter(f => 
        f.firNumber.toLowerCase().includes(q) || 
        f.title.toLowerCase().includes(q) || 
        f.primarySuspect.toLowerCase().includes(q) ||
        f.synopsis.toLowerCase().includes(q)
      );
    }
    if (severity && severity !== 'All') {
      results = results.filter(f => f.severity.toLowerCase() === severity.toLowerCase());
    }

    res.json(results);
  });

  // === Patrol Dispatch Simulation API ===
  router.post('/patrols/dispatch', requireAuth, (req: AuthRequest, res) => {
    const { targetLocation } = req.body;
    const newPatrol = {
      id: `P-${Date.now().toString().slice(-3)}`,
      unit: `Cheetah Patrol Unit ${Math.floor(Math.random() * 6) + 1}`,
      lat: 22.7196 + (Math.random() - 0.5) * 0.05,
      lng: 75.8577 + (Math.random() - 0.5) * 0.05,
      status: "En Route to Target",
      battery: "98%",
      officer: req.user?.name || "Commander (Indore Control)"
    };
    ACTIVE_PATROLS.unshift(newPatrol);
    res.json({ 
      success: true, 
      message: `MP Police Tactical Unit Dispatched to ${targetLocation || 'Indore Hotspot'}. ETA: 3.2 Minutes.`, 
      dispatchDetails: newPatrol 
    });
  });

  // === Threat Level API ===
  router.get('/threat-level', requireAuth, (req, res) => {
    res.json(CURRENT_THREAT_LEVEL);
  });

  router.post('/threat-level', requireAuth, (req, res) => {
    const { level, code } = req.body;
    if (level && code) {
      CURRENT_THREAT_LEVEL = {
        level,
        code,
        updatedAt: new Date().toISOString(),
        activeAdvisories: code === 'RED' ? 5 : code === 'AMBER' ? 3 : 1
      };
    }
    res.json(CURRENT_THREAT_LEVEL);
  });

  // === AI Copilot API ===
  router.post('/ai/query', requireAuth, async (req, res) => {
    try {
      const { query, history } = req.body;
      const { processIntelligenceQuery } = await import('./ai/copilot.ts');
      
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const result = await processIntelligenceQuery(query, history);
      res.json(result);
    } catch (error: any) {
      console.error('AI Query Error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // === Network Analysis API (Indore & Malwa Syndicate) ===
  router.get('/network/search', requireAuth, (req, res) => {
    const q = ((req.query.q as string) || '').toLowerCase();
    
    const allNodes = [
      { id: "S1", label: "Ravi Kumar", type: "Suspect", risk: 94, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", role: "Malwa Syndicate Kingpin", status: "Active Warrant" },
      { id: "S2", label: "Vikram Das", type: "Suspect", risk: 82, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", role: "Logistics / Arms Procurer", status: "Under Surveillance" },
      { id: "S3", label: "Priya Sundaram", type: "Suspect", risk: 65, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", role: "Financial Mule / Hawala", status: "Interrogated" },
      { id: "S4", label: "Mohammed Farhan", type: "Suspect", risk: 78, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", role: "Highway Auto Hijacker", status: "On Bail" },
      { id: "V1", label: "MP-09-CB-4592", type: "Vehicle", typeLabel: "Mahindra Scorpio (Black)", notes: "Spotted at Manglia Toll after heist" },
      { id: "V2", label: "MP-09-HG-1120", type: "Vehicle", typeLabel: "Royal Enfield Hunter", notes: "Registered under forged Indore address" },
      { id: "V3", label: "MP-04-XY-9021", type: "Vehicle", typeLabel: "Toyota Fortuner (White)", notes: "Indore-Bhopal Corridor Transit" },
      { id: "F1", label: "FIR #882/2023", type: "FIR", status: "Active Investigation", severity: "Critical", station: "Vijay Nagar PS" },
      { id: "F2", label: "FIR #2341/2023", type: "FIR", status: "Forensic Audit", severity: "High", station: "Palasia Cyber Cell" },
      { id: "F3", label: "FIR #1092/2024", type: "FIR", status: "Warrant Issued", severity: "High", station: "Rau Bypass Thana" },
      { id: "P1", label: "+91 98260 43210", type: "Phone", provider: "Encrypted VoIP (Indore)" },
      { id: "P2", label: "+91 98930 76655", type: "Phone", provider: "Burner SIM (Bhopal Circle)" },
      { id: "P3", label: "+91 94250 56789", type: "Phone", provider: "Malwa BSNL Network" },
      { id: "L1", label: "Vijay Nagar Safehouse", type: "Location", coordinates: "22.7533° N, 75.8937° E" },
      { id: "L2", label: "Rau Bypass Staging Yard", type: "Location", coordinates: "22.6288° N, 75.8118° E" },
      { id: "L3", label: "Manglia Toll Plaza", type: "Location", coordinates: "22.8124° N, 75.9234° E" },
      { id: "O1", label: "Malwa Syndicate", type: "Organization", tier: "Inter-District Criminal Network" }
    ];

    const allLinks = [
      { source: "S1", target: "S2", label: "CO-CONSPIRATOR", confidence: 96 },
      { source: "S1", target: "S3", label: "FINANCIAL_MULE", confidence: 72 },
      { source: "S2", target: "S4", label: "SUPPLIES_WEAPONS", confidence: 85 },
      { source: "S1", target: "V1", label: "OPERATES", confidence: 100 },
      { source: "S4", target: "V2", label: "REGISTERED_TO", confidence: 100 },
      { source: "S2", target: "V3", label: "ESCORT_VEHICLE", confidence: 88 },
      { source: "S1", target: "F1", label: "PRIME_ACCUSED", confidence: 100 },
      { source: "S2", target: "F1", label: "NAMED_IN", confidence: 90 },
      { source: "S2", target: "F2", label: "CYBER_INTRUSION", confidence: 84 },
      { source: "S4", target: "F3", label: "CHASSIS_TAMPERING", confidence: 95 },
      { source: "S1", target: "P1", label: "REGISTERED_USER", confidence: 99 },
      { source: "S2", target: "P2", label: "BURNER_DEVICE", confidence: 92 },
      { source: "P1", target: "P2", label: "42_INTERCEPTED_CALLS", confidence: 100 },
      { source: "P2", target: "P3", label: "COORDINATION_SMS", confidence: 81 },
      { source: "F1", target: "L1", label: "STAGING_GROUND", confidence: 100 },
      { source: "F3", target: "L2", label: "STOLEN_VEHICLE_YARD", confidence: 98 },
      { source: "V1", target: "L3", label: "ANPR_DETECTED_AT", confidence: 100 },
      { source: "S1", target: "O1", label: "OPERATIONAL_COMMAND", confidence: 95 },
      { source: "S2", target: "O1", label: "SENIOR_ENFORCER", confidence: 89 }
    ];

    if (!q) {
      return res.json({ nodes: allNodes, links: allLinks });
    }

    const matchedNodes = allNodes.filter(n => 
      n.label.toLowerCase().includes(q) || 
      n.type.toLowerCase().includes(q) || 
      (n.role && n.role.toLowerCase().includes(q))
    );

    const matchedIds = new Set(matchedNodes.map(n => n.id));
    allLinks.forEach(link => {
      const s = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const t = typeof link.target === 'object' ? (link.target as any).id : link.target;
      if (matchedIds.has(s)) matchedIds.add(t);
      if (matchedIds.has(t)) matchedIds.add(s);
    });

    const filteredNodes = allNodes.filter(n => matchedIds.has(n.id));
    const filteredLinks = allLinks.filter(l => {
      const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return matchedIds.has(s) && matchedIds.has(t);
    });

    res.json({ nodes: filteredNodes, links: filteredLinks });
  });

  // === AI Prediction & GIS APIs ===
  router.get('/predictions', requireAuth, async (req, res) => {
    try {
      const { getPredictions } = await import('./ai/prediction.ts');
      const data = await getPredictions(req.query.district as string);
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get('/forecast', requireAuth, async (req, res) => {
    try {
      const { getForecast } = await import('./ai/prediction.ts');
      const data = await getForecast(req.query.district as string);
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get('/hotspots', requireAuth, async (req, res) => {
    try {
      const { getHotspots } = await import('./ai/hotspot.ts');
      const data = await getHotspots(req.query.district as string);
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get('/alerts', requireAuth, async (req, res) => {
    try {
      const { getAlerts } = await import('./ai/anomaly.ts');
      const data = await getAlerts(req.query.district as string);
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get('/gis', requireAuth, async (req, res) => {
    try {
      const geojsonPath = path.resolve(process.cwd(), 'src/ai/madhya_pradesh.json');
      if (fs.existsSync(geojsonPath)) {
        const fileContent = fs.readFileSync(geojsonPath, 'utf-8');
        return res.json(JSON.parse(fileContent));
      }
      res.json({ type: "FeatureCollection", features: [] });
    } catch (e: any) {
      res.json({ type: "FeatureCollection", features: [] });
    }
  });

  // Mount router on both '/api' and '/' so requests match regardless of whether /api prefix was preserved or stripped by Vercel
  app.use('/api', router);
  app.use(router);

  return app;
}
