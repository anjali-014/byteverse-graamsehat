export function errorHandler(err, req, res, _next) {
  // Structured + safe logging
  console.error('[ERROR]', {
    ts: new Date().toISOString(),
    method: req.method,
    path: req.path,
    status: err.status || 500,
    code: err.code,
    msg: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });

  // 1. Invalid JSON payload (must be first)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload'
    });
  }

  // 2. PostgreSQL errors
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: 'Duplicate record'
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      error: 'Referenced record does not exist'
    });
  }

  if (err.code === '23514') {
    return res.status(400).json({
      success: false,
      error: 'Value violates CHECK constraint'
    });
  }

  // 3. Validation errors (Zod)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.flatten()
    });
  }

  // 4. Fallback error
  return res.status(err.status || 500).json({
    success: false,
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message
  });
}