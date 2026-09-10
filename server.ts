import express from 'express';
import path from 'path';
import { createApp } from './src/app.ts';

export { createApp };

export async function startServer() {
  const app = createApp();
  const PORT = Number(process.env.PORT) || 3001;

  // Vite middleware for development (dynamically imported so production bundles never require vite)
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: { port: 24680 }
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n======================================================`);
      console.log(`  🦅 GARUDA-AI CRIME INTELLIGENCE COMMAND CENTER`);
      console.log(`  Madhya Pradesh Police — Indore Commissionerate Edition`);
      console.log(`  Server running on http://localhost:${PORT}`);
      console.log(`  Demo Login: officer@mppolice.gov.in / Officer@123`);
      console.log(`======================================================\n`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer().catch(console.error);
}
