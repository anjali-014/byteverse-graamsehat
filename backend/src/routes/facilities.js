import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/facilities?block=Bihta
// Called once on PWA install — response cached by service worker
router.get('/', async (req, res, next) => {
  try {
    const block = req.query.block || 'Bihta';
    const result = await query(
      `SELECT id, name, type, block, lat, lng, phone
       FROM facilities
       WHERE block = $1 AND is_active = TRUE
       ORDER BY name`,
      [block]
    );
    // Long cache header — facilities rarely change
    res.set('Cache-Control', 'public, max-age=86400');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

export default router;