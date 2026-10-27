import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { router as apiRouter } from './server/routes.ts';
import { initSupabaseData } from './server/supabaseStore.ts';
import { initCloudSqlData } from './src/db/cloudSqlStore.ts';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());

  // Mount API router
  app.use('/api', apiRouter);

  // Serve static assets, public images, and fallback src/assets for both dev and production
  app.use('/images', express.static(path.resolve(__dirname, 'public/images')));
  app.use('/src/assets', express.static(path.resolve(__dirname, 'src/assets')));
  app.use(express.static(path.resolve(__dirname, 'public')));

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LifeLink] Express server running on http://0.0.0.0:${PORT}`);
    // Sync with Cloud SQL PostgreSQL
    initCloudSqlData().catch((err) => {
      console.error('[Cloud SQL] Background sync warning:', err.message);
    });
    // Sync with Supabase asynchronously in background without blocking server startup
    initSupabaseData().catch((err) => {
      console.error('[Supabase] Background sync warning:', err.message);
    });
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
