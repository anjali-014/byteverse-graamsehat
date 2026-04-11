const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// ── Fetch facilities from backend ─────────────────────────────────────
// Matches backend GET /api/facilities?block=Bihta
export async function getFacilities(block = 'Bihta') {
  try {
    const res = await fetch(`${BACKEND_URL}/api/facilities?block=${encodeURIComponent(block)}`);

    if (!res.ok) throw new Error('Facilities fetch failed');

    const facilities = await res.json();
    // Cache in localStorage for offline use
    localStorage.setItem('cached_facilities', JSON.stringify({ block, facilities, ts: Date.now() }));
    return facilities;

  } catch (err) {
    console.warn('Facilities fetch failed — using cache:', err.message);
    return getCachedFacilities(block);
  }
}

// ── Get from localStorage cache (offline fallback) ────────────────────
function getCachedFacilities(block) {
  try {
    const cached = JSON.parse(localStorage.getItem('cached_facilities'));
    if (cached && cached.block === block) {
      console.log('📦 Using cached facilities');
      return cached.facilities;
    }
  } catch {
    // ignore
  }

  // Hard fallback — Bihar PHC data
  return getHardcodedFacilities(block);
}

// ── Hardcoded fallback — when no cache and offline ────────────────────
// Matches backend facilities table schema: id, name, type, block, lat, lng, phone
function getHardcodedFacilities(block) {
  const BIHAR_FACILITIES = {
    'Bihta': [
      { id: 1, name: 'Bihta PHC',           type: 'PHC',      block: 'Bihta', lat: 25.5612, lng: 84.9062, phone: '0612-280000' },
      { id: 2, name: 'Bihta Community HC',  type: 'CHC',      block: 'Bihta', lat: 25.5598, lng: 84.9045, phone: '0612-280001' },
      { id: 3, name: 'PMCH Patna',          type: 'District', block: 'Bihta', lat: 25.6093, lng: 85.1376, phone: '0612-225555' },
    ],
    'default': [
      { id: 99, name: 'Nearest PHC',        type: 'PHC',      block: block,   lat: null,    lng: null,    phone: '104' },
      { id: 100, name: 'ASHA Helpline',     type: 'Helpline', block: block,   lat: null,    lng: null,    phone: '1800-180-1104' },
    ]
  };

  return BIHAR_FACILITIES[block] || BIHAR_FACILITIES['default'];
}

// ── Get nearest facility (sorted by distance) ─────────────────────────
export async function getNearestFacility(block = 'Bihta', userLat = null, userLng = null) {
  const facilities = await getFacilities(block);

  if (!userLat || !userLng) return facilities[0];

  // Sort by distance using Haversine formula
  const sorted = facilities
    .filter(f => f.lat && f.lng)
    .map(f => ({
      ...f,
      distance: haversine(userLat, userLng, f.lat, f.lng)
    }))
    .sort((a, b) => a.distance - b.distance);

  return sorted[0] || facilities[0];
}

// ── Haversine distance in km ──────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
            Math.cos(lat1 * Math.PI/180) *
            Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLng/2) ** 2;
  return R * 2 * Math.aatan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ── Format for display in ResultPage ─────────────────────────────────
export function formatFacility(facility) {
  if (!facility) return null;
  return {
    name:     facility.name,
    type:     facility.type,
    phone:    facility.phone || '104',
    distance: facility.distance ? `${facility.distance.toFixed(1)} km` : 'Nearby',
    mapsUrl:  facility.lat && facility.lng
      ? `https://maps.google.com/?q=${facility.lat},${facility.lng}`
      : null
  };
}