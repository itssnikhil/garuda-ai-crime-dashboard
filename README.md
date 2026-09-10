# 🦅 GARUDA-AI: National Crime Intelligence & Predictive Policing Platform
### Smart India Hackathon (SIH) — Defense & Law Enforcement Edition

> **GARUDA-AI** (*Geospatial & Advanced Reconnaissance Unified Defense Analytics*) is a next-generation AI-powered Crime Intelligence and Predictive Policing Command Center engineered for law enforcement agencies, state crime bureaus, and intelligence cells. It leverages Google Gemini AI, interactive GIS geospatial mapping, high-dimensional criminal network analysis, and predictive crime forecasting.

---

## 🎯 Core SIH Objective & Mission
> **• Assist investigators by providing visual and analytical insights.**
> 
> GARUDA-AI functions as an end-to-end investigative decision support platform engineered for the **Madhya Pradesh Police (Indore Police Commissionerate)**, converting fragmented crime data (CCTNS records, Dial 112 CAD streams, Safe City ANPR camera telemetry, and cellular intercepts) into actionable visual graphs and analytical intelligence briefs.

---

## 📌 Key Investigative Capabilities

1. **Visual Link Analysis (Network Graph)**: Interactive force-directed knowledge graph visually tracing relationships between suspects (e.g., Malwa Syndicate), burner SIMs, ANPR plate hits, safehouses, and FIRs to assist investigators in uncovering hidden syndicate hierarchies.
2. **Analytical Intelligence Copilot**: Explainable AI Copilot providing evidentiary citations, modus operandi correlation, analytical rationale, and automated BOLO generation for investigating officers.
3. **Dial 112 CAD Emergency Feed**: Live Computer-Aided Dispatch incident triage across 6 key Indore police stations (Vijay Nagar, Palasia, Bhanwarkuan, Tukoganj, Sarafa Bazaar, Rau Bypass).
4. **Geospatial GIS Crime Intelligence**: Leaflet-powered heatmaps with Safe City CCTV coverage, police beats, and Cheetah mobile patrol deployment across Madhya Pradesh districts.
5. **Predictive Crime Forecasting**: ARIMA + spatial DBSCAN machine learning models predicting crime probability trends across 7-day, 30-day, and 90-day horizons.
6. **Biometric Offender Matrix**: Suspect dossiers with AFIS fingerprint IDs, facial match confidence scores, DNA profiles, and geofenced patrol alerts.
7. **FIR Case Repository**: Comprehensive FIR dossier browser with one-click **Investigative Analytical Insights** and exportable **PDF Briefs**.

---

## 🏗️ Technical Architecture

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Theme** | Tailwind CSS v4, Custom Tactical Command Theme, JetBrains Mono, Inter |
| **Geospatial & Mapping** | Leaflet, React-Leaflet, React-Leaflet-Cluster, CartoDB Dark Matter Tiles |
| **Network Graph Visualization** | React-Force-Graph-2D, D3-Force Engine |
| **AI Intelligence Engine** | Google Gemini API (`gemini-2.5-flash`) with Resilient Local Fallback Engine |
| **Backend API** | Node.js, Express, ES Modules, TypeScript (`tsx`) |
| **Authentication & Security** | JWT (JSON Web Tokens), Role-Based Access Control (RBAC) |
| **Document Generation** | jsPDF (Tactical Intelligence Dossiers) |
| **Database Support** | PostgreSQL / Drizzle ORM (Cloud/Local) + Zero-Crash In-Memory Cluster for Live Demos |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher — tested on Node v24)
- **npm** (v9 or higher)

### 1. Navigate to Project
```bash
cd C:\Users\NIKHIL\.gemini\antigravity\scratch\garuda-ai-crime-dashboard
```

### 2. Install Dependencies
```bash
npm install
```
*(On Windows PowerShell if script execution is disabled, use `npm.cmd install`)*

### 3. Run Development Server
```bash
npm run dev
```
*(Or `npm.cmd run dev`)*

The server will initialize on:
👉 **`http://localhost:3001`** (or configured `PORT`)

---

## 🔑 Pre-Configured Demo Credentials (for Hackathon Presentations)

For quick demonstration in front of SIH judges, you can either click the **1-Click Presentation Credentials** on the login screen or enter:

| Role | Email | Password |
|---|---|---|
| **Lead Investigator** | `officer@police.gov.in` | `Officer@123` |
| **Command Director** | `admin@police.gov.in` | `Admin@123` |
| **Crime Analyst** | `analyst@police.gov.in` | `Analyst@123` |
| **Tactical Patrol Lead** | `patrol@police.gov.in` | `Patrol@123` |

---

## ⚙️ Configuration & Customization Guide

### 1. Adding your Google Gemini API Key (Optional)
If you wish to use live Google Gemini API inference instead of the built-in intelligent fallback:
1. Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
JWT_SECRET=your_custom_jwt_secret
```
2. Restart the dev server (`npm.cmd run dev`).

### 2. Connecting a Live PostgreSQL Database (Optional)
The system runs in a **Hybrid Mode**. By default, it operates with a resilient in-memory cluster ensuring **zero crashes during live presentations**. To connect to a live Postgres database (e.g. Supabase, Neon, or local PostgreSQL):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/garuda_db
```

### 3. Changing Team Name / Project Branding
- **Project Name & Header**: Edit `src/App.tsx` (Search for `GARUDA-AI`).
- **Page Title & Favicon**: Edit `index.html`.
- **FIR Data & Suspects**: Edit `server.ts` (`FIR_DATABASE` array) and `src/components/OffenderProfile.tsx` (`DOSSIERS` array).

---

## 🏆 Presentation Tips for SIH Evaluators

1. **Start with the Command Radar**:
   - Showcase the rotating Tactical Crime Density Radar on the main dashboard centered on Indore (`22.7196° N, 75.8577° E`).
   - Click on the flashing red blip (Vijay Nagar / AB Road Sector) to trigger instant real-time Cheetah patrol dispatch.
2. **Demonstrate Cross-Module Pivot**:
   - Open **Criminal Network Analysis** -> Click suspect **Ravi Kumar (S1)** to reveal his vehicle (`MP-09-CB-4592`), burner phone, and FIR connections across Indore.
   - Switch to **Offender Profiling** to inspect his biometric match score and issue a live **MP Police BOLO Alert**.
3. **Showcase AI Explainability**:
   - Open the **AI Copilot** drawer -> Click preset prompt *"Analyze Malwa Syndicate hierarchy for FIR #882"*.
   - Point out the **Confidence Score**, **Evidentiary Citations**, and click **Export PDF** to show an official court-ready intelligence brief!
4. **Highlight Multi-Jurisdiction Coverage**:
   - Switch to the **Crime Hotspots (GIS)** tab and toggle between Indore, Bhopal, Ujjain, Dewas, and Gwalior with Safe City CCTV and Cheetah patrol layers.

---

## 📄 License
Developed for educational, research, and hackathon presentation purposes (Smart India Hackathon).
