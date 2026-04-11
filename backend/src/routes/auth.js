import { Router } from 'express';
import { validateBody, AuthLoginSchema, AuthSignupSchema } from '../middleware/validate.js';
import { query } from '../config/db.js';
import { hashPassword, verifyPassword } from '../services/password.js';
import jwt from "jsonwebtoken";

const router = Router();

// ==============================
// 🔐 SIGNUP ROUTE
// ==============================
router.post('/signup', validateBody(AuthSignupSchema), async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      ashaId,
      state,
      district,
      village,
      password,
    } = req.validated;

    const name = `${firstName.trim()} ${lastName?.trim() || ''}`.trim();
    const hashedPassword = hashPassword(password);
    const block = village || 'Bihta';

    const result = await query(
      `INSERT INTO asha_workers
         (asha_id, name, phone, village, block, district, state, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (phone) DO UPDATE SET
         asha_id       = EXCLUDED.asha_id,
         name          = EXCLUDED.name,
         village       = EXCLUDED.village,
         block         = EXCLUDED.block,
         district      = EXCLUDED.district,
         state         = EXCLUDED.state,
         password_hash = EXCLUDED.password_hash
       RETURNING id, asha_id, name, phone, village, block, district, state, created_at`,
      [ashaId, name, phone, village, block, district || 'Patna', state || 'Bihar', hashedPassword]
    );

    const user = result.rows[0];

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      token,
      data: user,
    });

  } catch (err) {
    next(err);
  }
});


// ==============================
// 🔐 LOGIN ROUTE
// ==============================
router.post('/login', validateBody(AuthLoginSchema), async (req, res, next) => {
  try {
    const { identifier, password } = req.validated;

    const result = await query(
      `SELECT id, asha_id, name, phone, village, block, district, state, password_hash
       FROM asha_workers
       WHERE phone = $1 OR asha_id = $1`,
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

    // ✅ Verify password
    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const { password_hash, ...safeUser } = user;

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: safeUser.id, phone: safeUser.phone },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      data: safeUser
    });

  } catch (err) {
    next(err);
  }
});

export default router;