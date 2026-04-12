import { query } from '../config/db.js';
import { cacheGet, cacheSet } from '../config/redis.js';

export async function getSummary(block = 'Bihta') {
  console.log("NEW DASHBOARD QUERY LOADED"); // 👈 ADD THIS
  const today = new Date().toISOString().slice(0, 10);
  const cacheKey = `dashboard:summary:${block}:${today}`;

  // ✅ ENABLE CACHE (safe now)
  const cached = await cacheGet(cacheKey);
  if (cached) return JSON.parse(cached);

  // Last 24 hours window
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [totals, redAlerts, byVillage, activeAshas, recentCases] = await Promise.all([

    // 🔹 Totals by triage
    query(
      `SELECT tc.triage_result, COUNT(*) AS count
       FROM triage_cases tc
       JOIN asha_workers aw ON tc.asha_id = aw.id
       WHERE aw.block = $1 AND tc.synced_at >= $2
       GROUP BY tc.triage_result`,
      [block, since]
    ),

    // 🔹 Red alerts
    query(
      `SELECT
         tc.id,
         tc.symptoms,
         tc.village_tag,
         tc.client_timestamp,
         tc.confidence_score,
         tc.clock_skew,
         aw.name  AS asha_name,
         aw.phone AS asha_phone
       FROM triage_cases tc
       JOIN asha_workers aw ON tc.asha_id = aw.id
       WHERE aw.block = $1
         AND tc.triage_result = 'RED'
         AND tc.synced_at >= $2
       ORDER BY tc.client_timestamp DESC
       LIMIT 20`,
      [block, since]
    ),

    // 🔹 Cases grouped by village (FIXED)
    query(
  `SELECT
     tc.village_tag,
     COUNT(*) AS cases,
     COUNT(*) FILTER (WHERE tc.triage_result = 'RED') AS red_count,
     COUNT(*) FILTER (WHERE tc.triage_result = 'YELLOW') AS yellow_count
   FROM triage_cases tc
   JOIN asha_workers aw ON tc.asha_id = aw.id
   WHERE aw.block = $1
     AND tc.synced_at >= $2
     AND tc.village_tag IS NOT NULL
   GROUP BY tc.village_tag
   ORDER BY red_count DESC`,
  [block, since]
),

    // 🔹 Active ASHAs
    query(
      `SELECT
         aw.id,
         aw.name,
         aw.village,
         aw.phone,
         COUNT(tc.id) AS cases_today,
         MAX(tc.synced_at) AS last_sync
       FROM asha_workers aw
       LEFT JOIN triage_cases tc
         ON aw.id = tc.asha_id AND tc.synced_at >= $2
       WHERE aw.block = $1
       GROUP BY aw.id, aw.name, aw.village, aw.phone
       ORDER BY cases_today DESC`,
      [block, since]
    ),

    // 🔹 Recent Cases (for homepage recent patients)
    query(
      `SELECT
         tc.id,
         tc.triage_result,
         tc.symptoms,
         tc.village_tag,
         tc.client_timestamp,
         aw.name AS asha_name,
         aw.village AS asha_village
       FROM triage_cases tc
       JOIN asha_workers aw ON tc.asha_id = aw.id
       WHERE aw.block = $1
         AND tc.synced_at >= $2
       ORDER BY tc.client_timestamp DESC
       LIMIT 10`,
      [block, since]
    ),
  ]);

  const summary = {
    block,
    period: '24h',
    totals: totals.rows,
    redAlerts: redAlerts.rows,
    byVillage: byVillage.rows,
    activeAshas: activeAshas.rows,
    recentCases: recentCases.rows,
    generatedAt: new Date().toISOString(),
  };

  // ✅ cache result (5 min)
  await cacheSet(cacheKey, JSON.stringify(summary), 300);

  return summary;
}