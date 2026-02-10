import { Router } from 'express';
import { z } from 'zod';
import * as entriesService from '../services/entries.js';
import { AppError } from '../lib/errors.js';

export const entriesRouter = Router();

const upsertEntrySchema = z.object({
  habitId: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['done', 'skipped', 'missed']),
  note: z.string().optional(),
});

entriesRouter.get('/', async (req, res, next) => {
  try {
    const from = req.query.from as string;
    const to = req.query.to as string;
    if (!from || !to) throw new AppError(400, 'from and to query params are required');

    const habitId = req.query.habitId ? Number(req.query.habitId) : undefined;
    const entries = await entriesService.listEntries({ from, to, habitId });
    res.json(entries);
  } catch (err) { next(err); }
});

entriesRouter.put('/', async (req, res, next) => {
  try {
    const data = upsertEntrySchema.parse(req.body);
    const entry = await entriesService.upsertEntry(data);
    res.json(entry);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues });
      return;
    }
    next(err);
  }
});

entriesRouter.delete('/:id', async (req, res, next) => {
  try {
    const entry = await entriesService.deleteEntry(Number(req.params.id));
    if (!entry) throw new AppError(404, 'Entry not found');
    res.json(entry);
  } catch (err) { next(err); }
});
