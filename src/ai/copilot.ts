import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary answering the user's query.",
    },
    evidence: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific data points, FIRs, or graph links used as evidence.",
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "Confidence score of the assessment from 0 to 100.",
    },
    reasoning: {
      type: Type.STRING,
      description: "Detailed explanation of why this conclusion was reached.",
    },
    suggestedActions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Suggested next investigative steps or actions.",
    },
    followUpQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 suggested intelligent follow-up questions the user can ask.",
    },
  },
  required: ["summary", "evidence", "confidenceScore", "reasoning", "suggestedActions", "followUpQuestions"],
};

export async function processIntelligenceQuery(query: string, history: any[] = []) {
  try {
    const dbContext = "Madhya Pradesh Police Unified Intelligence Grid (MP-POLICE). Live nodes: 55 Districts active. Indore Police Commissionerate & Malwa Regional Zone. FIR #882/2023 linked to inter-district cartel 'Malwa Syndicate'. Vehicle MP-09-CB-4592 (Black Scorpio) logged across Manglia & Kshipra toll plazas on AB Road in the last 48 hours.";

    const systemInstruction = `You are GARUDA-AI, an Advanced Crime Intelligence & Predictive Policing Copilot for Madhya Pradesh Police (MP Police - Indore Commissionerate & SCRB Bhopal) developed for Smart India Hackathon (SIH).
Your role is to assist MP Police officers, analyze criminal networks across Indore and Malwa, detect modus operandi anomalies, inspect FIR dossiers, and formulate high-precision tactical deployment strategies.
Use the provided Database Context to inform your answers. Maintain a high-clearance, analytical, concise, and professional defense-grade intelligence tone.

Context from Databases:
${dbContext}
`;

    if (!process.env.GEMINI_API_KEY) {
      return getMockResponse(query);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    } else {
      throw new Error("No response text from Gemini API.");
    }
  } catch (error) {
    console.error("AI Copilot Error:", error);
    return getMockResponse(query);
  }
}

function getMockResponse(query: string) {
  const q = query.toLowerCase();

  if (q.includes('syndicate') || q.includes('network') || q.includes('gang') || q.includes('882')) {
    return {
      summary: "Identified multi-tiered criminal syndicate 'Malwa Syndicate' operating across Indore, Ujjain, and Dewas. Primary controller identified as S1 (Ravi Kumar) with logistical coordination and arms procurement by S2 (Vikram Das).",
      evidence: [
        "Call Data Record (CDR) cluster: 42 encrypted VoIP calls between +91 98260 43210 (Indore) and +91 98930 76655 (Bhopal)",
        "Vehicle MP-09-CB-4592 logged on Indore Safe City ANPR cameras near Rajwada & Sarafa scenes",
        "FIR #882/2023 (Indore Vijay Nagar PS) and FIR #2341/2023 (Palasia Cyber Cell) weapon alignment"
      ],
      confidenceScore: 95.2,
      reasoning: "Cross-referencing Safe City Smart Surveillance ANPR feeds with cellular tower triangulation along AB Road and Rau Bypass reveals 95.2% correlation in movement vectors during night hours.",
      suggestedActions: [
        "Issue State-wide BOLO for Black Mahindra Scorpio (MP-09-CB-4592)",
        "Deploy QRT and surveillance to the Rau Bypass staging warehouse identified in Node L2",
        "Notify Indore Safe City Control Room to trigger automated facial recognition alert for S1"
      ],
      followUpQuestions: [
        "Show me the interactive graph of Ravi Kumar's associates in Indore",
        "What are the predicted target zones for this syndicate across Indore this weekend?"
      ]
    };
  }

  if (q.includes('hotspot') || q.includes('patrol') || q.includes('predict') || q.includes('burglary')) {
    return {
      summary: "Predictive spatial modeling forecasts high probability (91.4%) of commercial burglaries and vehicle thefts along the Vijay Nagar commercial corridor and Rau Bypass within the 01:00 - 04:30 AM window.",
      evidence: [
        "Historical 3-year Q3 crime seasonality index (+42% during Malwa festive weeks)",
        "Lighting deficits and high freight vehicle congestion along the Indore-Dewas bypass",
        "Recent bail release of repeat auto-theft syndicate members (FIR #1092/2024)"
      ],
      confidenceScore: 91.4,
      reasoning: "Machine learning spatial clustering (DBSCAN + ARIMA) detects repeating temporal cycles triggered by reduced police perimeter patrols during late night highway transport hours.",
      suggestedActions: [
        "Deploy automated Drone Patrol Unit Alpha along the Vijay Nagar - Lasudia corridor",
        "Establish static vehicle inspection barricades at Manglia Toll and Rau Circle",
        "Push real-time alert to beat constables via MP Police Garuda Gateway"
      ],
      followUpQuestions: [
        "Optimize patrol route for Cheetah Unit 1 in Vijay Nagar tonight",
        "List all high-risk offenders currently on bail in Indore jurisdiction"
      ]
    };
  }

  return {
    summary: `Tactical Intelligence Analysis completed for Indore & Madhya Pradesh jurisdiction: "${query}". Cross-referenced with MP Police SCRB and Indore Safe City ANPR feeds.`,
    evidence: [
      "FIR #882/2023 (Indore Commissionerate Active Dossier)",
      "Indore Smart City Safe City ANPR Camera Feeds #IND-092 & #IND-104",
      "Unified Graph Node #MP-POLICE-84729"
    ],
    confidenceScore: 92.8,
    reasoning: "Multi-parameter correlation aligns suspect modus operandi, geo-fenced cellular anomalies along AB Road, and vehicle registry entries with active warrants.",
    suggestedActions: [
      "Execute geofenced perimeter alert for Indore Sector 1 (Vijay Nagar & Palasia)",
      "Alert territorial station commanders at Tukoganj, Bhanwarkuan, and Sarafa",
      "Update central FIR case repository with newly identified associates"
    ],
    followUpQuestions: [
      "What are the linked FIRs for the primary suspect in Indore?",
      "Display real-time patrol unit status near Rajwada and Sarafa"
    ]
  };
}
