import { Router } from 'express';
import * as statsService from '../services/stats.js';

export const statsRouter = Router();

statsRouter.get('/overview', async (_req, res, next) => {
  try {
    const overview = await statsService.getOverview();
    res.json(overview);
  } catch (err) { next(err); }
});

statsRouter.get('/habits/:id', async (req, res, next) => {
  try {
    const stats = await statsService.getHabitStats(Number(req.params.id));
    res.json(stats);
  } catch (err) { next(err); }
});

statsRouter.get('/heatmap', async (req, res, next) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const heatmap = await statsService.getHeatmapData(year);
    res.json(heatmap);
  } catch (err) { next(err); }
});

statsRouter.get('/trends', async (_req, res, next) => {
  try {
    const trends = await statsService.getTrends();
    res.json(trends);
  } catch (err) { next(err); }
});
