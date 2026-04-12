import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/stats/cases - Public endpoint for homepage case counts
router.get('/cases', async (req, res, next) => {
  try {
    // Get total counts for all triage results
    const result = await query(`
      SELECT
        triage_result,
        COUNT(*) as count
      FROM triage_cases
      WHERE synced_at >= NOW() - INTERVAL '30 days'
      GROUP BY triage_result
    `);

    // Initialize counts
    const stats = {
      green: 0,
      yellow: 0,
      red: 0,
      total: 0
    };

    // Sum up the counts
    result.rows.forEach(row => {
      const count = parseInt(row.count);
      stats[row.triage_result.toLowerCase()] = count;
      stats.total += count;
    });

    res.json({
      success: true,
      data: stats,
      period: '30 days'
    });
  } catch (err) {
    next(err);
  }
});

export default router;