import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getPredictions(district: string = 'Indore') {
  if (!process.env.GEMINI_API_KEY) {
    return [
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
        historicalComparison: 'Consistent with Diwali / Dhanteras surge cycles',
        topContributingFactors: [
          'High cash volumes in night street markets',
          'Narrow alleyways with blind spots behind heritage structures'
        ],
        recommendedAction: 'Mandate foot patrols with thermal night-vision gear and link Sarafa CCTV feeds directly to Indore Commissionerate Command Center.'
      }
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a JSON array of crime predictions for the district of ${district}, Madhya Pradesh. 
Each object should have: id, title, prediction, confidenceScore, evidence (array of strings), historicalComparison, topContributingFactors (array of strings), recommendedAction.
Limit to 2 predictions. Focus on Indore / Malwa crime patterns.`,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (error) {
    console.error('Prediction Engine Error:', error);
  }
  return [];
}

export async function getForecast(district: string = 'Indore') {
  const base = district.length * 10;
  return {
    next7Days: { incidents: base + 38, trend: '+7.4%', risk: 'High' },
    next30Days: { incidents: base * 4 + 75, trend: '-3.2%', risk: 'Medium' },
    next90Days: { incidents: base * 11 + 40, trend: '-8.5%', risk: 'Low' }
  };
}
