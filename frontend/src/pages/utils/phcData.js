// Pre-cached Primary Health Centers for Bihar districts
// These are embedded in the app — no internet needed
export const PHC_DATA = [
  {
    id: 1, district: 'Patna', block: 'Bihta',
    name: 'PHC Bihta', phone: '0612-2281234',
    address: 'Bihta, Patna, Bihar 801103',
    lat: 25.5623, lng: 84.9016,
    beds: 10, ambulance: '108',
    distance_km: 0, hours: '24x7'
  },
  {
    id: 2, district: 'Patna', block: 'Paliganj',
    name: 'PHC Paliganj', phone: '0612-2281567',
    address: 'Paliganj, Patna, Bihar 801110',
    lat: 25.4892, lng: 84.8765,
    beds: 10, ambulance: '108',
    distance_km: 8, hours: '24x7'
  },
  {
    id: 3, district: 'Patna', block: 'Central',
    name: 'Patna Medical College & Hospital (PMCH)',
    phone: '0612-2300000',
    address: 'Ashok Rajpath, Patna, Bihar 800004',
    lat: 25.6097, lng: 85.1461,
    beds: 1800, ambulance: '108',
    distance_km: 22, hours: '24x7', isHospital: true
  },
  {
    id: 4, district: 'Vaishali', block: 'Hajipur',
    name: 'PHC Hajipur', phone: '06224-272234',
    address: 'Hajipur, Vaishali, Bihar 844101',
    lat: 25.6900, lng: 85.2090,
    beds: 10, ambulance: '108',
    distance_km: 15, hours: '8AM-8PM'
  },
  {
    id: 5, district: 'Nalanda', block: 'Biharsharif',
    name: 'Sadar Hospital Nalanda',
    phone: '06112-222012',
    address: 'Biharsharif, Nalanda, Bihar 803101',
    lat: 25.1951, lng: 85.5236,
    beds: 100, ambulance: '108',
    distance_km: 30, hours: '24x7'
  }
]
 
export const AMBULANCE_NUMBER = '108'
export const ASHA_HELPLINE = '104'
 
export function getNearestPHC(userLat, userLng) {
  if (!userLat || !userLng) return PHC_DATA[0]
  
  const withDistance = PHC_DATA.map(phc => ({
    ...phc,
    calc_distance: Math.sqrt(
      Math.pow(phc.lat - userLat, 2) + Math.pow(phc.lng - userLng, 2)
    ) * 111
  }))
  
  return withDistance.sort((a, b) => a.calc_distance - b.calc_distance)[0]
}