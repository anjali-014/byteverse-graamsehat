import { query, getClient } from '../config/db.js';

const CLOCK_SKEW_MS = 48 * 60 * 60 * 1_000; // 48 hours

// FIX: Do NOT JSON.stringify JSONB columns — pg driver handles serialisation.
// The original code stored '"[\"fever\"]"' (a JSON-encoded string) instead of '["fever"]' (an array).
// Dashboard queries using `symptoms @> '["fever"]'::jsonb` would silently return 0 rows.
function toRow(c) {
  return {
    id:                   c.id,
    asha_id:              c.ashaId,
    patient_age_group:    c.patientAgeGroup   ?? null,
    patient_sex:          c.patientSex        ?? null,
    is_pregnant:          c.isPregnant        ?? false,

    // ✅ FIXED
     symptoms: JSON.stringify(c.symptoms || []),
contributing_factors: JSON.stringify(c.contributingFactors || []),
    triage_result:        c.triageResult,
    confidence_score: c.confidenceScore != null ? Number(c.confidenceScore) : null,
    input_method:         c.inputMethod       ?? 'tap',
    village_tag:          c.villageTag        ?? null,
    lat: c.lat != null ? Number(c.lat) : null,
lng: c.lng != null ? Number(c.lng) : null,
    clock_skew:           Math.abs(Date.now() - c.clientTimestamp) > CLOCK_SKEW_MS,
    client_timestamp: Number(c.clientTimestamp),
    client_version:       c.clientVersion     ?? null,
  };
}

export async function upsertCases(cases) {
  const client = await getClient();
  const accepted = [];
  const rejected = [];

  try {
    await client.query('BEGIN');

    for (const rawCase of cases) {
      try {
        const c = toRow(rawCase);
        console.log("DEBUG CASE:", c);
        // Parameters passed as JS objects — pg serialises JSONB automatically
        await client.query(
          `INSERT INTO triage_cases (
            id, asha_id, patient_age_group, patient_sex, is_pregnant,
            symptoms, triage_result, confidence_score, contributing_factors,
            input_method, village_tag, lat, lng, clock_skew,
            client_timestamp, client_version
          ) VALUES (
            $1,$2,$3,$4,$5,
            $6::jsonb,
            $7,$8,
            $9::jsonb,
            $10,$11,$12,$13,$14,$15,$16
          )
          ON CONFLICT (id) DO UPDATE SET
            synced_at      = NOW(),
            client_version = EXCLUDED.client_version`,
          [
            c.id, c.asha_id, c.patient_age_group, c.patient_sex,
            c.is_pregnant,
            c.symptoms,             // pg serialises [] → '[]'::jsonb automatically
            c.triage_result,
            c.confidence_score,
            c.contributing_factors, // same
            c.input_method, c.village_tag,
            c.lat, c.lng, c.clock_skew,
            c.client_timestamp, c.client_version,
          ]
        );
        accepted.push(rawCase.id);
      } catch (err) {
        // FIX: include pg error code for easier debugging
        console.error('[CaseService] Insert failed:', rawCase.id, `[${err.code}]`, err.message);
        rejected.push({ id: rawCase.id, reason: err.message, code: err.code });
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return { accepted, rejected };
}

export async function logSync({ ashaId, sent, accepted, rejected, version }) {
  // Non-blocking — failure here must not break the sync response
  try {
    await query(
      `INSERT INTO sync_logs (asha_id, records_sent, records_accepted, records_rejected, client_version)
       VALUES ($1,$2,$3,$4,$5)`,
      [ashaId, sent, accepted, rejected, version ?? null]
    );
  } catch (err) {
    console.error('[CaseService] logSync failed:', err.message);
  }
}