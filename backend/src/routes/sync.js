import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateBody, SyncBatchSchema } from '../middleware/validate.js';
import { upsertCases, logSync } from '../services/caseService.js';
import { cacheDel } from '../config/redis.js';
import { query } from '../config/db.js';

const router = Router();

// Rate limit: max 30 sync requests per ASHA per minute
// Prevents accidental infinite retry loops from a buggy client
const syncLimiter = rateLimit({
  windowMs:        60_000,
  max:             30,
  standardHeaders: true,
  legacyHeaders:   false,
  keyGenerator:    (req) => req.body?.ashaId || req.ip, // per-ASHA limit
  message:         { error: 'Too many sync requests, please slow down' },
});

// POST /api/sync/cases
router.post('/cases', syncLimiter, validateBody(SyncBatchSchema), async (req, res, next) => {
  try {
    const { ashaId, cases, version } = req.validated;

    // Verify ashaId exists — reject unknown ASHAs
    const ashaCheck = await query(  
      'SELECT block FROM asha_workers WHERE asha_id = $1',
      [ashaId]
    );
    if (ashaCheck.rowCount === 0) {
      return res.status(403).json({ error: 'Unknown or inactive ASHA ID' });
    }
    const block = ashaCheck.rows[0].block;

    const { accepted, rejected } = await upsertCases(cases);

    // Non-blocking audit log
    logSync({ ashaId, sent: cases.length, accepted: accepted.length, rejected: rejected.length, version });

    // FIX: use the actual block from DB, not hardcoded 'Bihta'
    const today = new Date().toISOString().slice(0, 10);
    await cacheDel(`dashboard:summary:${block}:${today}`);

    res.json({
      synced:   accepted,
      rejected,
      serverTs: Date.now(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;