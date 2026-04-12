const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// ── IndexedDB setup ───────────────────────────────────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('graamsehat', 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('pending_cases')) {
        db.createObjectStore('pending_cases', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = () => reject(req.error);
  });
}

// ── Save case locally (offline) ───────────────────────────────────────
async function saveToIndexedDB(caseData) {
  const db = await openDB();
  const tx = db.transaction('pending_cases', 'readwrite');
  tx.objectStore('pending_cases').add(caseData);
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror    = () => reject(tx.error);
  });
}

// ── Get all pending cases from IndexedDB ──────────────────────────────
async function getPendingCases() {
  const db = await openDB();
  const tx = db.transaction('pending_cases', 'readonly');
  return new Promise((resolve, reject) => {
    const req = tx.objectStore('pending_cases').getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

// ── Delete synced case from IndexedDB ────────────────────────────────
async function deletePendingCase(id) {
  const db = await openDB();
  const tx = db.transaction('pending_cases', 'readwrite');
  tx.objectStore('pending_cases').delete(id);
}

// ── Main save function — called after every triage ───────────────────
// Matches backend POST /api/sync/cases → SyncBatchSchema
export async function saveCase(triageResult, ashaId) {
  // Build case object matching backend's SyncBatchSchema
  const caseData = {
    id:                crypto.randomUUID(),
    ashaId,
    symptoms:          triageResult.detectedSymptoms || [],
    triageResult:      triageResult.level,
    confidenceScore:   Math.min(1, Math.max(0, (triageResult.confidence || 0) / 100)),
    contributingFactors: [],
    inputMethod:       'voice',
    villageTag:        undefined,
    clientTimestamp:   Date.now(),
    clientVersion:     '2.0.0',
    hardOverride:      triageResult.hardOverride || false,
  };

  if (navigator.onLine) {
    try {
      await syncBatchToBackend(ashaId, [caseData]);
      console.log('✅ Case synced to backend immediately');
      return;
    } catch (err) {
      console.warn('Online but sync failed — saving locally:', err.message);
    }
  }

  // Offline — save to IndexedDB
  await saveToIndexedDB(caseData);
  console.log('📦 Saved offline — will sync when online');
}

// ── Sync batch to backend — POST /api/sync/cases ─────────────────────
async function syncBatchToBackend(ashaId, cases) {
  const res = await fetch(`${BACKEND_URL}/api/sync/cases`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ashaId,
      cases,
      version: '2.0.0',   // matches model_config version
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Sync failed');
  }

  const result = await res.json(); // { synced, rejected, serverTs }

  // Dispatch event to update homepage statistics
  window.dispatchEvent(new CustomEvent('caseStatsUpdate'));

  return result;
}

// ── Sync all pending cases when back online ───────────────────────────
export async function syncPendingCases(ashaId) {
  if (!navigator.onLine) return;

  const pending = await getPendingCases();
  if (pending.length === 0) return;

  console.log(`🔄 Syncing ${pending.length} pending cases...`);

  try {
    const { synced, rejected } = await syncBatchToBackend(ashaId, pending);

    // Delete successfully synced cases from IndexedDB
    for (const c of pending) {
      await deletePendingCase(c.id);
    }

    console.log(`✅ Synced: ${synced.length}, Rejected: ${rejected.length}`);

    if (rejected.length > 0) {
      console.warn('Rejected cases:', rejected);
    }
  } catch (err) {
    console.warn('Sync failed — will retry later:', err.message);
  }
}

export async function syncCases() {
  const ashaId = localStorage.getItem('asha_id') || 'demo_worker';
  await syncPendingCases(ashaId);
}

// ── Auto sync when internet returns ──────────────────────────────────
// Call this once in main.jsx with the ashaId
export function initAutoSync(ashaId) {
  window.addEventListener('online', () => {
    console.log('🌐 Back online — syncing pending cases');
    syncPendingCases(ashaId);
  });

  // Also try on app load in case there are pending cases
  syncPendingCases(ashaId);
}

// ── Check backend connectivity ────────────────────────────────────────
export async function pingBackend() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ping`, { method: 'GET' });
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}