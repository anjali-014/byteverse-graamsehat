/**
 * GraamSehat IndexedDB Layer
 * Stores triage cases locally when offline
 * Syncs to server when connectivity returns
 */
 
const DB_NAME = 'graamsehat_db'
const DB_VERSION = 1
const CASES_STORE = 'cases'
const SYNC_STORE = 'sync_queue'
 
let db = null
 
export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
 
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }
 
    request.onupgradeneeded = (event) => {
      const database = event.target.result
 
      // Cases store
      if (!database.objectStoreNames.contains(CASES_STORE)) {
        const casesStore = database.createObjectStore(CASES_STORE, {
          keyPath: 'id',
          autoIncrement: true
        })
        casesStore.createIndex('timestamp', 'timestamp')
        casesStore.createIndex('severity', 'severity')
        casesStore.createIndex('synced', 'synced')
      }
 
      // Sync queue store
      if (!database.objectStoreNames.contains(SYNC_STORE)) {
        database.createObjectStore(SYNC_STORE, {
          keyPath: 'id',
          autoIncrement: true
        })
      }
    }
  })
}
 
async function getDB() {
  if (!db) await initDB()
  return db
}
 
export async function saveCase(triageResult, inputText, location = null) {
  const database = await getDB()
  const caseData = {
    inputText,
    symptoms: triageResult.detectedSymptoms,
    severity: triageResult.level,
    confidence: triageResult.confidence,
    diseaseHint: triageResult.diseaseHint,
    advice: triageResult.advice,
    location,
    timestamp: new Date().toISOString(),
    synced: false,
    ashaId: localStorage.getItem('asha_id') || 'demo_worker'
  }
 
  return new Promise((resolve, reject) => {
    const tx = database.transaction([CASES_STORE], 'readwrite')
    const store = tx.objectStore(CASES_STORE)
    const request = store.add(caseData)
    request.onsuccess = () => resolve({ ...caseData, id: request.result })
    request.onerror = () => reject(request.error)
  })
}
 
export async function getAllCases() {
  const database = await getDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction([CASES_STORE], 'readonly')
    const store = tx.objectStore(CASES_STORE)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result.reverse())
    request.onerror = () => reject(request.error)
  })
}
 
export async function getUnsynced() {
  const database = await getDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction([CASES_STORE], 'readonly')
    const store = tx.objectStore(CASES_STORE)
    const index = store.index('synced')
    const request = index.getAll(false)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
 
export async function markSynced(id) {
  const database = await getDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction([CASES_STORE], 'readwrite')
    const store = tx.objectStore(CASES_STORE)
    const getReq = store.get(id)
    getReq.onsuccess = () => {
      const record = getReq.result
      if (record) {
        record.synced = true
        const putReq = store.put(record)
        putReq.onsuccess = () => resolve()
        putReq.onerror = () => reject(putReq.error)
      }
    }
  })
}
 
export async function getCaseStats() {
  const cases = await getAllCases()
  const today = new Date().toDateString()
  return {
    total: cases.length,
    today: cases.filter(c => new Date(c.timestamp).toDateString() === today).length,
    red: cases.filter(c => c.severity === 'RED').length,
    yellow: cases.filter(c => c.severity === 'YELLOW').length,
    green: cases.filter(c => c.severity === 'GREEN').length,
    unsynced: cases.filter(c => !c.synced).length,
    recent: cases.slice(0, 10)
  }
}