import fs from 'fs';
import path from 'path';

export async function getHotspots(district: string = 'Indore') {
  // Center coordinates for Indore, Madhya Pradesh
  let lat = 22.7196;
  let lng = 75.8577;

  const DISTRICT_CENTERS: Record<string, [number, number]> = {
    'Indore': [22.7196, 75.8577],
    'Bhopal': [23.2599, 77.4126],
    'Ujjain': [23.1765, 75.7885],
    'Dewas': [22.9676, 76.0534],
    'Gwalior': [26.2183, 78.1828],
    'Jabalpur': [23.1815, 79.9864],
    'Dhar': [22.5978, 75.2974],
    'Ratlam': [23.3315, 75.0367],
    'Khargone': [21.8214, 75.6119],
    'Sagar': [23.8388, 78.7378],
  };

  if (DISTRICT_CENTERS[district]) {
    lat = DISTRICT_CENTERS[district][0];
    lng = DISTRICT_CENTERS[district][1];
  } else {
    try {
      const geojsonPath = path.join(process.cwd(), 'src/ai/madhya_pradesh.json');
      if (fs.existsSync(geojsonPath)) {
        const geoData = JSON.parse(fs.readFileSync(geojsonPath, 'utf-8'));
        const feature = geoData.features.find((f: any) => f.properties.name === district);
        if (feature && feature.geometry && feature.geometry.coordinates[0][0]) {
          const coords = feature.geometry.coordinates[0];
          lat = coords.reduce((sum: number, c: any) => sum + c[1], 0) / coords.length;
          lng = coords.reduce((sum: number, c: any) => sum + c[0], 0) / coords.length;
        }
      }
    } catch (e) {
      console.error('Error reading geojson', e);
    }
  }

  const INDORE_STATIONS = [
    'Vijay Nagar Police Station',
    'Palasia Thana',
    'Bhanwarkuan Police Station',
    'Tukoganj Thana',
    'Sarafa Bazaar Police Post',
    'Rajwada Heritage Chowki',
    'Rau Police Station (Bypass)',
    'Khajrana Thana',
    'Lasudia Police Station (AB Road)',
    'Annapurna Thana',
    'Chhatribagh Beat',
    'Pithampur Border Post'
  ];

  const generatePoints = (count: number) => {
    const points = [];
    const types = ['Cyber Fraud / Loan Scams', 'Commercial Burglary', 'Vehicle Theft', 'Chain Snatching', 'Extortion Syndicate', 'Narcotics Distribution'];
    const severities = ['Red', 'Orange', 'Yellow', 'Green'];
    
    for (let i = 0; i < count; i++) {
      const stationName = district === 'Indore'
        ? INDORE_STATIONS[i % INDORE_STATIONS.length]
        : `${district} Central Thana Beat ${i + 1}`;

      points.push({
        id: i + 1,
        lat: lat + (Math.random() - 0.5) * 0.12,
        lng: lng + (Math.random() - 0.5) * 0.12,
        intensity: Math.max(0.25, Math.random()),
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        recentIncidents: Math.floor(Math.random() * 24) + 2,
        aiScore: Math.floor(Math.random() * 40) + 60,
        station: stationName
      });
    }
    return points;
  };

  return generatePoints(12);
}
