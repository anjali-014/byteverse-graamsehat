import { z } from 'zod';

// Schema for a single triage case from client
export const CaseSchema = z.object({
  id:                  z.string().uuid(),
  ashaId:              z.string().uuid(),
  patientAgeGroup:     z.enum(['infant','child','adult','elderly']).optional(),
  patientSex:          z.enum(['M','F','unknown']).optional(),
  isPregnant:          z.boolean().default(false),
  symptoms:            z.array(z.string().trim()).min(1),
  triageResult:        z.enum(['RED','YELLOW','GREEN','UNCLEAR']),
  confidenceScore:     z.number().min(0).max(1).optional(),
  contributingFactors: z.array(z.any()).optional().default([]),
  inputMethod:         z.enum(['voice','tap']).default('tap'),
  villageTag:          z.string().trim().optional(),
  lat:                 z.number().min(-90).max(90).optional(),
  lng:                 z.number().min(-180).max(180).optional(),
  clientTimestamp:     z.number().int().positive(),
  clientVersion:       z.string().optional(),
});

export const SyncBatchSchema = z.object({
  ashaId:  z.string().uuid(),
  cases:   z.array(CaseSchema).min(1).max(50),
  version: z.string().optional(),
});

// Middleware
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      });
    }

    req.validated = result.data;
    next();
  };
}

// ASHA registration schema (FIXED)
export const AshaRegistrationSchema = z.object({
  name:     z.string().trim().min(1, 'Name is required'),
  phone:    z.string().regex(/^[0-9]{10,15}$/, 'Valid phone required'),
  village:  z.string().trim().optional(),
  block:    z.string().trim().optional(),     // ✅ added
  district: z.string().trim().optional(),
  state:    z.string().trim().optional(),     // ✅ added
});

export const AuthSignupSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName:  z.string().trim().optional().default(''),
  phone:     z.string().regex(/^[0-9]{10,15}$/, 'Valid phone required'),
  ashaId:    z.string().trim().min(3, 'ASHA ID is required'),
  state:     z.string().trim().optional().default('Bihar'),
  district:  z.string().trim().optional().default('Patna'),
  village:   z.string().trim().min(1, 'Village / block is required'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
});

export const AuthLoginSchema = z.object({
  identifier: z.string().trim().min(3, 'Mobile number or ASHA ID is required'),
  password:   z.string().min(8, 'Password must be at least 8 characters'),
});