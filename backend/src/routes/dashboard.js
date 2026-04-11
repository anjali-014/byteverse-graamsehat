import { Router } from 'express';
import { getSummary } from '../services/dashboardService.js';

const router = Router();

// GET /api/dashboard/summary?block=Bihta
router.get('/summary', async (req, res, next) => {
  console.log("QUERY RECEIVED:", req.query);  // 👈 ADD THIS
  console.log("DASHBOARD HIT");  // 👈 ADD THIS
  try {
    const block = req.query.block || 'Bihta';
    const summary = await getSummary(block);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

export default router;