import express from 'express';

const app = express();
app.use(express.json());

const USERS = [
  { id: '1', email: 'officer@mppolice.gov.in', password: 'Officer@123', name: 'Inspector Rahul Verma', role: 'Indore Crime Branch Lead' },
  { id: '2', email: 'officer@police.gov.in', password: 'Officer@123', name: 'Inspector Rahul Verma', role: 'Indore Crime Branch Lead' },
  { id: '3', email: 'admin@mppolice.gov.in', password: 'Admin@123', name: 'DGP S. Ramanathan', role: 'MP Police Command Director' },
  { id: '4', email: 'admin@police.gov.in', password: 'Admin@123', name: 'DGP S. Ramanathan', role: 'MP Police Command Director' },
  { id: '5', email: 'analyst@mppolice.gov.in', password: 'Analyst@123', name: 'Dr. Ananya Iyer', role: 'Cyber & Forensic Specialist' },
  { id: '6', email: 'patrol@mppolice.gov.in', password: 'Patrol@123', name: 'Sub-Inspector Vikram Singh', role: 'Indore QRT Lead' }
];

const FIR_DATABASE = [
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

const auth = (req: any, res: any, next: any) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Unauthorized' });
  req.user = { uid: '1', email: 'officer@mppolice.gov.in', name: 'Inspector Rahul Verma', role: 'Indore Crime Branch Lead' };
  next();
};

const router = express.Router();

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = USERS.find(u => u.email.toLowerCase() === email?.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. Use officer@mppolice.gov.in / Officer@123' });
  }
  const token = 'garuda-jwt-token-mp-police-' + Date.now();
  res.json({ message: 'Login successful', token, user: { uid: user.id, email: user.email, name: user.name, role: user.role } });
});

router.get('/auth/me', auth, (req: any, res) => {
  res.json({ user: req.user });
});

router.get('/system/health', (req, res) => {
  res.json({ status: 'Nominal', uptime: process.uptime(), engine: 'GARUDA Core 3.2-DEFENSE (MP POLICE)' });
});

router.get('/system/db-status', (req, res) => {
  res.json({ status: 'Synchronized (Indore Smart City Grid)', mode: 'SIH Live Demo' });
});

router.get('/dashboard/summary', auth, (req, res) => {
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
    threatLevel: {
      level: "DEFCON 2 - ELEVATED",
      code: "AMBER",
      updatedAt: new Date().toISOString(),
      activeAdvisories: 3
    }
  });
});

router.get('/firs', auth, (req, res) => {
  res.json(FIR_DATABASE);
});

router.post('/patrols/dispatch', auth, (req, res) => {
  const { targetLocation } = req.body || {};
  res.json({
    success: true,
    message: `MP Police Tactical Cheetah Unit Dispatched to ${targetLocation || 'Indore Hotspot'}. ETA: 3.2 Minutes.`
  });
});

router.get('/threat-level', auth, (req, res) => {
  res.json({ level: "DEFCON 2 - ELEVATED", code: "AMBER", updatedAt: new Date().toISOString(), activeAdvisories: 3 });
});

router.post('/ai/query', auth, (req, res) => {
  const { query } = req.body || {};
  res.json({
    summary: `Intelligence assessment for: ${query || 'Indore Commissionerate'}. Pattern correlates with Malwa syndicate activities.`,
    confidenceScore: 94,
    reasoning: "Cross-correlated with recent FIRs and ANPR camera logs in Vijay Nagar and Sarafa.",
    evidence: ["FIR #882/2023 (Indore)", "ANPR Intercept MP-09-CB-4592"],
    suggestedActions: ["Deploy Cheetah mobile to AB Road corridor", "Monitor bullion market exit points"],
    followUpQuestions: ["View Malwa syndicate network graph", "Show predictive crime heatmap"]
  });
});

router.get('/network/search', auth, (req, res) => {
  res.json({
    nodes: [
      { id: "S1", label: "Ravi Kumar", type: "Suspect", risk: 94, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", role: "Malwa Syndicate Kingpin", status: "Active Warrant" },
      { id: "S2", label: "Vikram Das", type: "Suspect", risk: 82, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", role: "Logistics / Arms Procurer", status: "Under Surveillance" },
      { id: "S3", label: "Priya Sundaram", type: "Suspect", risk: 65, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", role: "Financial Mule / Hawala", status: "Interrogated" },
      { id: "S4", label: "Mohammed Farhan", type: "Suspect", risk: 78, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", role: "Highway Auto Hijacker", status: "On Bail" },
      { id: "V1", label: "MP-09-CB-4592", type: "Vehicle", typeLabel: "Mahindra Scorpio (Black)", notes: "Spotted at Manglia Toll after heist" },
      { id: "F1", label: "FIR #882/2023", type: "FIR", status: "Active Investigation", severity: "Critical", station: "Vijay Nagar PS" }
    ],
    links: [
      { source: "S1", target: "S2", label: "CO-CONSPIRATOR", confidence: 96 },
      { source: "S1", target: "S3", label: "FINANCIAL_MULE", confidence: 72 },
      { source: "S1", target: "V1", label: "OPERATES", confidence: 100 },
      { source: "S1", target: "F1", label: "PRIME_ACCUSED", confidence: 100 }
    ]
  });
});

router.get('/predictions', auth, (req, res) => {
  const district = (req.query.district as string) || 'Indore';
  res.json([
    {
      id: 'PRED-1',
      title: `Organized Vehicle Hijacking & Robbery Cluster (${district})`,
      prediction: `Increased luxury SUV and commercial logistics hijacking forecast along AB Road & Indore Bypass corridor`,
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
      prediction: `High probability of coordinated shop-breaking targeting jewelry and bullion depots in ${district} heritage core`,
      confidenceScore: 86,
      evidence: [
        'Unregistered drones spotted reconnoitering Sarafa Bazaar after 02:00 AM',
        'Recurrence pattern matching unsolved FIR #882'
      ],
      historicalComparison: 'Consistent with festive surge cycles',
      topContributingFactors: [
        'High cash volumes in night street markets',
        'Narrow alleyways with blind spots behind heritage structures'
      ],
      recommendedAction: 'Mandate foot patrols with thermal night-vision gear and link Sarafa CCTV feeds directly to Indore Commissionerate Command Center.'
    }
  ]);
});

router.get('/forecast', auth, (req, res) => {
  const district = (req.query.district as string) || 'Indore';
  const base = district.length * 10;
  res.json({
    next7Days: { incidents: base + 38, trend: '+7.4%', risk: 'High' },
    next30Days: { incidents: base * 4 + 75, trend: '-3.2%', risk: 'Medium' },
    next90Days: { incidents: base * 11 + 40, trend: '-8.5%', risk: 'Low' }
  });
});

router.get('/hotspots', auth, (req, res) => {
  const district = (req.query.district as string) || 'Indore';
  const centers: Record<string, [number, number]> = {
    'Indore': [22.7196, 75.8577],
    'Bhopal': [23.2599, 77.4126],
    'Ujjain': [23.1765, 75.7885],
    'Dewas': [22.9676, 76.0534],
    'Gwalior': [26.2183, 78.1828],
    'Jabalpur': [23.1815, 79.9864]
  };
  const [lat, lng] = centers[district] || [22.7196, 75.8577];

  res.json([
    { id: 1, lat: lat + 0.033, lng: lng + 0.036, intensity: 0.9, type: 'Commercial Burglary & Extortion', severity: 'Red', recentIncidents: 18, aiScore: 94, station: 'Vijay Nagar Police Station' },
    { id: 2, lat: lat, lng: lng, intensity: 0.8, type: 'Night Market Bullion Theft', severity: 'Orange', recentIncidents: 12, aiScore: 86, station: 'Sarafa Bazaar Police Post' },
    { id: 3, lat: lat - 0.09, lng: lng - 0.046, intensity: 0.85, type: 'Highway Auto Theft (SUVs)', severity: 'Red', recentIncidents: 15, aiScore: 89, station: 'Rau Police Station (Bypass)' },
    { id: 4, lat: lat + 0.005, lng: lng + 0.026, intensity: 0.65, type: 'Cyber Loan Extortion Ring', severity: 'Yellow', recentIncidents: 9, aiScore: 78, station: 'Palasia Cyber Thana' },
    { id: 5, lat: lat - 0.027, lng: lng + 0.010, intensity: 0.7, type: 'Student PG Residential Theft', severity: 'Orange', recentIncidents: 11, aiScore: 82, station: 'Bhanwarkuan Thana' },
    { id: 6, lat: lat + 0.040, lng: lng + 0.042, intensity: 0.82, type: 'Highway Transport Hijacking', severity: 'Red', recentIncidents: 14, aiScore: 91, station: 'Lasudia Police Station (AB Road)' }
  ]);
});

router.get('/alerts', auth, (req, res) => {
  const district = (req.query.district as string) || 'Indore';
  res.json([
    {
      id: 'A-101',
      type: 'Abnormal Crime Pattern',
      title: 'Spike in Cyber Extortion & Loan App Fraud',
      description: `320% surge in instant loan blackmail and phishing intercepts across ${district} (Vijay Nagar & Palasia zones) over the last 48 hours.`,
      time: '08m ago',
      level: 'Critical'
    },
    {
      id: 'A-102',
      type: 'Repeat Offender Detected',
      title: 'Safe City ANPR & Facial Match',
      description: `Suspect S1 (Ravi Kumar) flagged by Indore Smart City Safe City AI camera near Rajwada-Sarafa junction.`,
      time: '34m ago',
      level: 'High'
    },
    {
      id: 'A-103',
      type: 'Inter-District Syndicate Movement',
      title: 'Dewas Bypass / AB Road Intercept',
      description: `Black Scorpio (MP-09-CB-4592) linked to armed robbery crossed Manglia Toll Plaza towards ${district} city center.`,
      time: '1h 15m ago',
      level: 'High'
    }
  ]);
});

router.get('/gis', auth, (req, res) => {
  res.json({ type: "FeatureCollection", features: [] });
});

app.use('/api', router);
app.use(router);

export default app;