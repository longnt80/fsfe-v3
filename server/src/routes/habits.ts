import { Router } from 'express';
import { z } from 'zod';
import * as habitsService from '../services/habits.js';
import { AppError } from '../lib/errors.js';

export const habitsRouter = Router();

const createHabitSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  icon: z.string().max(50).optional(),
  frequencyType: z.enum(['daily', 'weekly', 'custom']).optional(),
  frequencyDays: z.array(z.number().min(0).max(6)).optional(),
  targetPerWeek: z.number().min(1).max(7).optional(),
});

const updateHabitSchema = createHabitSchema.partial().extend({
  sortOrder: z.number().optional(),
});

const reorderSchema = z.object({
  orderedIds: z.array(z.number()),
});

habitsRouter.get('/', async (req, res, next) => {
  try {
    const includeArchived = req.query.archived === 'true';
    const result = await habitsService.listHabits(includeArchived);
    res.json(result);
  } catch (err) { next(err); }
});

habitsRouter.get('/:id', async (req, res, next) => {
  try {
    const habit = await habitsService.getHabit(Number(req.params.id));
    if (!habit) throw new AppError(404, 'Habit not found');
    res.json(habit);
  } catch (err) { next(err); }
});

habitsRouter.post('/', async (req, res, next) => {
  try {
    const data = createHabitSchema.parse(req.body);
    const habit = await habitsService.createHabit(data);
    res.status(201).json(habit);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues });
      return;
    }
    next(err);
  }
});

habitsRouter.patch('/:id', async (req, res, next) => {
  try {
    const data = updateHabitSchema.parse(req.body);
    const habit = await habitsService.updateHabit(Number(req.params.id), data);
    if (!habit) throw new AppError(404, 'Habit not found');
    res.json(habit);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues });
      return;
    }
    next(err);
  }
});

habitsRouter.patch('/:id/archive', async (req, res, next) => {
  try {
    const habit = await habitsService.toggleArchive(Number(req.params.id));
    if (!habit) throw new AppError(404, 'Habit not found');
    res.json(habit);
  } catch (err) { next(err); }
});

habitsRouter.delete('/:id', async (req, res, next) => {
  try {
    const habit = await habitsService.deleteHabit(Number(req.params.id));
    if (!habit) throw new AppError(404, 'Habit not found');
    res.json(habit);
  } catch (err) { next(err); }
});

habitsRouter.patch('/reorder', async (req, res, next) => {
  try {
    const { orderedIds } = reorderSchema.parse(req.body);
    await habitsService.reorderHabits(orderedIds);
    res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues });
      return;
    }
    next(err);
  }
});
