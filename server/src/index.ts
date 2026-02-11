import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { habitsRouter } from './routes/habits.js';
import { entriesRouter } from './routes/entries.js';
import { statsRouter } from './routes/stats.js';
import { AppError } from './lib/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/habits', habitsRouter);
app.use('/api/entries', entriesRouter);
app.use('/api/stats', statsRouter);

// In production, serve the client build
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*path', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
