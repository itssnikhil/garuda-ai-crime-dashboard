export async function getAlerts(district: string = 'Indore') {
  return [
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
  ];
}
