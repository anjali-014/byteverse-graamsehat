import { Router } from 'express';
import { validateBody, AshaRegistrationSchema } from '../middleware/validate.js';
import { query } from '../config/db.js';

const router = Router();

// POST /api/asha/register
router.post(
  '/register',  
  validateBody(AshaRegistrationSchema),
  async (req, res, next) => {
    try {
      console.log("BODY:", req.body);        // 👈 ADD HERE
      console.log("VALIDATED:", req.validated); // 👈 ALSO ADD THIS
      const { name, phone, village, block, district, state } = req.validated;

      const result = await query(
        `INSERT INTO asha_workers (name, phone, village, block, district, state)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (phone) DO UPDATE SET
           name     = EXCLUDED.name,
           village  = EXCLUDED.village,
           block    = EXCLUDED.block,
           district = EXCLUDED.district,
           state    = EXCLUDED.state
         RETURNING id, name, phone, village, block, district, state, created_at`,
        [name, phone, village, block, district, state]
      );

      return res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/asha/:phone
router.get('/:phone', async (req, res, next) => {
  try {
    const { phone } = req.params;

    // Basic validation
    if (!phone || phone.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number',
      });
    }

    const result = await query(
      `SELECT id, name, phone, village, block, district, state, created_at
       FROM asha_workers WHERE phone = $1`,
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'ASHA worker not found',
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

export default router;