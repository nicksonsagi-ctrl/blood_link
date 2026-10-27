export interface District {
  name: string;
  province: string;
  lat: number;
  lng: number;
  cities: string[];
}

export interface HospitalRecord {
  id: string;
  name: string;
  district: string;
  province: string;
  type: 'Teaching Hospital' | 'Provincial General' | 'Base Hospital' | 'Specialized' | 'Private Hospital';
  sector?: 'GOVERNMENT' | 'PRIVATE';
  phone: string;
  hasBloodBank: boolean;
  lat: number;
  lng: number;
  address?: string;
}

export const SRI_LANKA_PROVINCES = [
  'Northern Province',
  'Western Province',
  'Central Province',
  'Southern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Uva Province',
  'Sabaragamuwa Province'
];

export const SRI_LANKA_DISTRICTS: Record<string, District> = {
  'Jaffna': {
    name: 'Jaffna',
    province: 'Northern Province',
    lat: 9.6615,
    lng: 80.0255,
    cities: ['Jaffna Town', 'Nallur', 'Chavakachcheri', 'Point Pedro', 'Tellippalai', 'Karainagar', 'Valvettithurai', 'Kankesanthurai', 'Kopay', 'Manipay']
  },
  'Kilinochchi': {
    name: 'Kilinochchi',
    province: 'Northern Province',
    lat: 9.3803,
    lng: 80.3770,
    cities: ['Kilinochchi Town', 'Paranthan', 'Poonakary', 'Pallai']
  },
  'Mannar': {
    name: 'Mannar',
    province: 'Northern Province',
    lat: 8.9810,
    lng: 79.9044,
    cities: ['Mannar Town', 'Pesalai', 'Murunkan', 'Nanattan']
  },
  'Mullaitivu': {
    name: 'Mullaitivu',
    province: 'Northern Province',
    lat: 9.2671,
    lng: 80.8145,
    cities: ['Mullaitivu Town', 'Puthukkudiyiruppu', 'Oddusuddan', 'Mulliyawalai']
  },
  'Vavuniya': {
    name: 'Vavuniya',
    province: 'Northern Province',
    lat: 8.7514,
    lng: 80.4971,
    cities: ['Vavuniya Town', 'Cheddikulam', 'Nedunkeni', 'Puliyankulam']
  },
  'Colombo': {
    name: 'Colombo',
    province: 'Western Province',
    lat: 6.9271,
    lng: 79.8612,
    cities: ['Colombo 01-15', 'Dehiwala', 'Mount Lavinia', 'Moratuwa', 'Kotte', 'Nugegoda', 'Maharagama', 'Homagama']
  },
  'Gampaha': {
    name: 'Gampaha',
    province: 'Western Province',
    lat: 7.0840,
    lng: 79.9943,
    cities: ['Gampaha Town', 'Negombo', 'Kelaniya', 'Ja-Ela', 'Wattala', 'Kadawatha']
  },
  'Kalutara': {
    name: 'Kalutara',
    province: 'Western Province',
    lat: 6.5854,
    lng: 79.9607,
    cities: ['Kalutara Town', 'Panadura', 'Horana', 'Beruwala', 'Matugama']
  },
  'Kandy': {
    name: 'Kandy',
    province: 'Central Province',
    lat: 7.2906,
    lng: 80.6337,
    cities: ['Kandy City', 'Peradeniya', 'Katugastota', 'Gampola', 'Kundasale']
  },
  'Matale': {
    name: 'Matale',
    province: 'Central Province',
    lat: 7.4675,
    lng: 80.6234,
    cities: ['Matale Town', 'Dambulla', 'Galewela', 'Ukuwela']
  },
  'Nuwara Eliya': {
    name: 'Nuwara Eliya',
    province: 'Central Province',
    lat: 6.9497,
    lng: 80.7891,
    cities: ['Nuwara Eliya Town', 'Hatton', 'Talawakele', 'Ginigathena']
  },
  'Galle': {
    name: 'Galle',
    province: 'Southern Province',
    lat: 6.0535,
    lng: 80.2210,
    cities: ['Galle Fort', 'Karapitiya', 'Hikkaduwa', 'Ambalangoda', 'Baddegama']
  },
  'Matara': {
    name: 'Matara',
    province: 'Southern Province',
    lat: 5.9549,
    lng: 80.5550,
    cities: ['Matara Town', 'Weligama', 'Akuressa', 'Dikwella']
  },
  'Hambantota': {
    name: 'Hambantota',
    province: 'Southern Province',
    lat: 6.1429,
    lng: 81.1212,
    cities: ['Hambantota Town', 'Tangalle', 'Tissamaharama', 'Ambalantota']
  },
  'Batticaloa': {
    name: 'Batticaloa',
    province: 'Eastern Province',
    lat: 7.7310,
    lng: 81.6747,
    cities: ['Batticaloa Town', 'Kattankudy', 'Eravur', 'Valaichchenai']
  },
  'Ampara': {
    name: 'Ampara',
    province: 'Eastern Province',
    lat: 7.2912,
    lng: 81.6724,
    cities: ['Ampara Town', 'Kalmunai', 'Sammanthurai', 'Akkaraipattu']
  },
  'Trincomalee': {
    name: 'Trincomalee',
    province: 'Eastern Province',
    lat: 8.5874,
    lng: 81.2152,
    cities: ['Trincomalee Town', 'Kinniya', 'Muttur', 'Kantale']
  },
  'Kurunegala': {
    name: 'Kurunegala',
    province: 'North Western Province',
    lat: 7.4863,
    lng: 80.3623,
    cities: ['Kurunegala Town', 'Kuliyapitiya', 'Narammala', 'Pannala']
  },
  'Puttalam': {
    name: 'Puttalam',
    province: 'North Western Province',
    lat: 8.0408,
    lng: 79.8394,
    cities: ['Puttalam Town', 'Chilaw', 'Marawila', 'Wennappuwa']
  },
  'Anuradhapura': {
    name: 'Anuradhapura',
    province: 'North Central Province',
    lat: 8.3114,
    lng: 80.4037,
    cities: ['Anuradhapura Town', 'Medawachchiya', 'Kekirawa', 'Tambuttegama']
  },
  'Polonnaruwa': {
    name: 'Polonnaruwa',
    province: 'North Central Province',
    lat: 7.9403,
    lng: 81.0188,
    cities: ['Polonnaruwa Town', 'Kaduruwela', 'Hingurakgoda', 'Medirigiriya']
  },
  'Badulla': {
    name: 'Badulla',
    province: 'Uva Province',
    lat: 6.9934,
    lng: 81.0550,
    cities: ['Badulla Town', 'Bandarawela', 'Haputale', 'Mahiyanganaya', 'Welimada']
  },
  'Monaragala': {
    name: 'Monaragala',
    province: 'Uva Province',
    lat: 6.8728,
    lng: 81.3507,
    cities: ['Monaragala Town', 'Wellawaya', 'Bibile', 'Buttala']
  },
  'Ratnapura': {
    name: 'Ratnapura',
    province: 'Sabaragamuwa Province',
    lat: 6.7056,
    lng: 80.3847,
    cities: ['Ratnapura Town', 'Pelmadulla', 'Balangoda', 'Embilipitiya']
  },
  'Kegalle': {
    name: 'Kegalle',
    province: 'Sabaragamuwa Province',
    lat: 7.2513,
    lng: 80.3464,
    cities: ['Kegalle Town', 'Mawanella', 'Warakapola', 'Rambukkana']
  }
};

export const SRI_LANKA_HOSPITALS: HospitalRecord[] = [
  {
    id: 'hosp-001',
    name: 'Teaching Hospital Jaffna',
    district: 'Jaffna',
    province: 'Northern Province',
    type: 'Teaching Hospital',
    phone: '+94 21 222 2261',
    hasBloodBank: true,
    lat: 9.6644,
    lng: 80.0177
  },
  {
    id: 'hosp-002',
    name: 'Tellippalai Trail Cancer Hospital',
    district: 'Jaffna',
    province: 'Northern Province',
    type: 'Specialized',
    phone: '+94 21 225 5224',
    hasBloodBank: true,
    lat: 9.7712,
    lng: 80.0384
  },
  {
    id: 'hosp-003',
    name: 'Base Hospital Point Pedro',
    district: 'Jaffna',
    province: 'Northern Province',
    type: 'Base Hospital',
    phone: '+94 21 226 2261',
    hasBloodBank: true,
    lat: 9.8242,
    lng: 80.2341
  },
  {
    id: 'hosp-004',
    name: 'Base Hospital Chavakachcheri',
    district: 'Jaffna',
    province: 'Northern Province',
    type: 'Base Hospital',
    phone: '+94 21 227 2261',
    hasBloodBank: true,
    lat: 9.6582,
    lng: 80.1558
  },
  {
    id: 'hosp-005',
    name: 'District General Hospital Kilinochchi',
    district: 'Kilinochchi',
    province: 'Northern Province',
    type: 'Provincial General',
    phone: '+94 21 228 5326',
    hasBloodBank: true,
    lat: 9.3905,
    lng: 80.4012
  },
  {
    id: 'hosp-006',
    name: 'National Hospital of Sri Lanka (NHSL), Colombo',
    district: 'Colombo',
    province: 'Western Province',
    type: 'Teaching Hospital',
    phone: '+94 11 269 1111',
    hasBloodBank: true,
    lat: 6.9197,
    lng: 79.8688
  },
  {
    id: 'hosp-007',
    name: 'National Blood Transfusion Service (NBTS) Blood Center, Narahenpita',
    district: 'Colombo',
    province: 'Western Province',
    type: 'Specialized',
    phone: '+94 11 269 8891',
    hasBloodBank: true,
    lat: 6.8943,
    lng: 79.8823
  },
  {
    id: 'hosp-008',
    name: 'National Hospital Kandy',
    district: 'Kandy',
    province: 'Central Province',
    type: 'Teaching Hospital',
    phone: '+94 81 222 2261',
    hasBloodBank: true,
    lat: 7.2882,
    lng: 80.6274
  },
  {
    id: 'hosp-009',
    name: 'Teaching Hospital Karapitiya, Galle',
    district: 'Galle',
    province: 'Southern Province',
    type: 'Teaching Hospital',
    phone: '+94 91 223 2250',
    hasBloodBank: true,
    lat: 6.0683,
    lng: 80.2294
  },
  {
    id: 'hosp-010',
    name: 'Teaching Hospital Batticaloa',
    district: 'Batticaloa',
    province: 'Eastern Province',
    type: 'Teaching Hospital',
    phone: '+94 65 222 2261',
    hasBloodBank: true,
    lat: 7.7183,
    lng: 81.7011
  },
  {
    id: 'hosp-011',
    name: 'District General Hospital Vavuniya',
    district: 'Vavuniya',
    province: 'Northern Province',
    type: 'Provincial General',
    phone: '+94 24 222 2261',
    hasBloodBank: true,
    lat: 8.7542,
    lng: 80.4982
  },
  {
    id: 'hosp-012',
    name: 'District General Hospital Mannar',
    district: 'Mannar',
    province: 'Northern Province',
    type: 'Provincial General',
    phone: '+94 23 222 2261',
    hasBloodBank: true,
    lat: 8.9772,
    lng: 79.9124
  },
  {
    id: 'hosp-013',
    name: 'District General Hospital Mullaitivu',
    district: 'Mullaitivu',
    province: 'Northern Province',
    type: 'Provincial General',
    phone: '+94 21 229 0024',
    hasBloodBank: true,
    lat: 9.2731,
    lng: 80.8142
  },
  {
    id: 'hosp-014',
    name: 'Teaching Hospital Anuradhapura',
    district: 'Anuradhapura',
    province: 'North Central Province',
    type: 'Teaching Hospital',
    phone: '+94 25 222 2261',
    hasBloodBank: true,
    lat: 8.3341,
    lng: 80.4085
  },
  {
    id: 'hosp-015',
    name: 'Teaching Hospital Kurunegala',
    district: 'Kurunegala',
    province: 'North Western Province',
    type: 'Teaching Hospital',
    phone: '+94 37 222 2261',
    hasBloodBank: true,
    lat: 7.4892,
    lng: 80.3644
  },
  {
    id: 'hosp-016',
    name: 'Provincial General Hospital Badulla',
    district: 'Badulla',
    province: 'Uva Province',
    type: 'Provincial General',
    phone: '+94 55 222 2261',
    hasBloodBank: true,
    lat: 6.9892,
    lng: 81.0567
  },
  {
    id: 'hosp-017',
    name: 'Provincial General Hospital Ratnapura',
    district: 'Ratnapura',
    province: 'Sabaragamuwa Province',
    type: 'Provincial General',
    phone: '+94 45 222 2261',
    hasBloodBank: true,
    lat: 6.6983,
    lng: 80.3951
  },
  {
    id: 'hosp-018',
    name: 'District General Hospital Trincomalee',
    district: 'Trincomalee',
    province: 'Eastern Province',
    type: 'Provincial General',
    phone: '+94 26 222 2261',
    hasBloodBank: true,
    lat: 8.5781,
    lng: 81.2291
  },
  {
    id: 'hosp-019',
    name: 'Colombo South Teaching Hospital (Kalubowila)',
    district: 'Colombo',
    province: 'Western Province',
    type: 'Teaching Hospital',
    phone: '+94 11 276 3066',
    hasBloodBank: true,
    lat: 6.8719,
    lng: 79.8856
  },
  {
    id: 'hosp-020',
    name: 'Colombo North Teaching Hospital (Ragama)',
    district: 'Gampaha',
    province: 'Western Province',
    type: 'Teaching Hospital',
    phone: '+94 11 295 8271',
    hasBloodBank: true,
    lat: 7.0272,
    lng: 79.9198,
    sector: 'GOVERNMENT'
  },
  // -------------------------------------------------------------
  // PRIVATE HOSPITALS & HEALTHCARE CENTERS (JAFFNA & ISLAND-WIDE)
  // -------------------------------------------------------------
  {
    id: 'hosp-pvt-001',
    name: 'Northern Central Hospital, Jaffna',
    district: 'Jaffna',
    province: 'Northern Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 21 221 2222',
    hasBloodBank: true,
    lat: 9.6748,
    lng: 80.0210,
    address: 'Palaly Road, Jaffna'
  },
  {
    id: 'hosp-pvt-002',
    name: 'Yarl Hospital, Jaffna',
    district: 'Jaffna',
    province: 'Northern Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 21 222 2673',
    hasBloodBank: true,
    lat: 9.6601,
    lng: 80.0275,
    address: 'No. 52, Kandy Road, Chundikuli, Jaffna'
  },
  {
    id: 'hosp-pvt-003',
    name: 'Moolai Cooperative Hospital, Chankanai',
    district: 'Jaffna',
    province: 'Northern Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 21 225 0244',
    hasBloodBank: true,
    lat: 9.7381,
    lng: 79.9324,
    address: 'Moolai, Chankanai, Jaffna'
  },
  {
    id: 'hosp-pvt-004',
    name: 'Manipay Green Memorial Hospital',
    district: 'Jaffna',
    province: 'Northern Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 21 225 5225',
    hasBloodBank: true,
    lat: 9.7042,
    lng: 79.9984,
    address: 'Hospital Road, Manipay, Jaffna'
  },
  {
    id: 'hosp-pvt-005',
    name: 'Suveekaran Medical Centre & Hospital, Jaffna',
    district: 'Jaffna',
    province: 'Northern Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 21 222 2844',
    hasBloodBank: true,
    lat: 9.6628,
    lng: 80.0201,
    address: 'Hospital Road, Jaffna Town'
  },
  {
    id: 'hosp-pvt-006',
    name: 'The Lanka Hospitals PLC, Colombo',
    district: 'Colombo',
    province: 'Western Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 11 543 0000',
    hasBloodBank: true,
    lat: 6.8912,
    lng: 79.8834,
    address: 'No. 578, Elvitigala Mawatha, Narahenpita, Colombo 05'
  },
  {
    id: 'hosp-pvt-007',
    name: 'Asiri Central Hospital, Colombo',
    district: 'Colombo',
    province: 'Western Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 11 466 5500',
    hasBloodBank: true,
    lat: 6.9234,
    lng: 79.8702,
    address: 'No. 114, Norris Canal Road, Colombo 10'
  },
  {
    id: 'hosp-pvt-008',
    name: 'Nawaloka Hospital, Colombo',
    district: 'Colombo',
    province: 'Western Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 11 557 7111',
    hasBloodBank: true,
    lat: 6.9247,
    lng: 79.8558,
    address: 'No. 23, Deshamanya H. K. Dharmadasa Mawatha, Colombo 02'
  },
  {
    id: 'hosp-pvt-009',
    name: 'Durdans Hospital, Colombo',
    district: 'Colombo',
    province: 'Western Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 11 214 0000',
    hasBloodBank: true,
    lat: 6.9015,
    lng: 79.8540,
    address: 'No. 3, Alfred Place, Kollupitiya, Colombo 03'
  },
  {
    id: 'hosp-pvt-010',
    name: 'Hemas Hospital, Wattala',
    district: 'Gampaha',
    province: 'Western Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 11 788 8888',
    hasBloodBank: true,
    lat: 6.9881,
    lng: 79.8924,
    address: 'No. 336, Negombo Road, Wattala'
  },
  {
    id: 'hosp-pvt-011',
    name: 'Asiri Hospital Kandy',
    district: 'Kandy',
    province: 'Central Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 81 452 8800',
    hasBloodBank: true,
    lat: 7.2798,
    lng: 80.6124,
    address: 'No. 907, Peradeniya Road, Kandy'
  },
  {
    id: 'hosp-pvt-012',
    name: 'Suwasevana Hospitals, Kandy',
    district: 'Kandy',
    province: 'Central Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 81 222 2404',
    hasBloodBank: true,
    lat: 7.2831,
    lng: 80.6210,
    address: 'No. 532, Peradeniya Road, Kandy'
  },
  {
    id: 'hosp-pvt-013',
    name: 'Asiri Hospital Galle',
    district: 'Galle',
    province: 'Southern Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 91 464 0640',
    hasBloodBank: true,
    lat: 6.0412,
    lng: 80.2185,
    address: 'No. 10, Wackwella Road, Galle'
  },
  {
    id: 'hosp-pvt-014',
    name: 'Co-operative Hospital, Batticaloa',
    district: 'Batticaloa',
    province: 'Eastern Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 65 222 2271',
    hasBloodBank: true,
    lat: 7.7124,
    lng: 81.6982,
    address: 'Bar Road, Batticaloa'
  },
  {
    id: 'hosp-pvt-015',
    name: 'Kings Hospital Colombo',
    district: 'Colombo',
    province: 'Western Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 11 774 3743',
    hasBloodBank: true,
    lat: 6.8988,
    lng: 79.8821,
    address: 'Evergreen Park Road, Narahenpita, Colombo 05'
  },
  {
    id: 'hosp-pvt-016',
    name: 'Browns Hospital Ragama',
    district: 'Gampaha',
    province: 'Western Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 11 571 4714',
    hasBloodBank: true,
    lat: 7.0311,
    lng: 79.9215,
    address: 'Mahabage Road, Ragama'
  },
  {
    id: 'hosp-pvt-017',
    name: 'St. Joseph\'s Private Hospital, Jaffna',
    district: 'Jaffna',
    province: 'Northern Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 21 222 2012',
    hasBloodBank: true,
    lat: 9.6631,
    lng: 80.0195,
    address: 'Main Street, Jaffna Town'
  },
  {
    id: 'hosp-pvt-018',
    name: 'Golden Key Eye & ENT Hospital, Rajagiriya',
    district: 'Colombo',
    province: 'Western Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 11 288 0288',
    hasBloodBank: true,
    lat: 6.9074,
    lng: 79.8972,
    address: 'No. 511/3, Kotte Road, Rajagiriya'
  },
  {
    id: 'hosp-pvt-019',
    name: 'Oasis Hospital, Colombo',
    district: 'Colombo',
    province: 'Western Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 11 550 6000',
    hasBloodBank: true,
    lat: 6.8924,
    lng: 79.8860,
    address: 'Narahenpita, Colombo 05'
  },
  {
    id: 'hosp-pvt-020',
    name: 'Pannai Medical Centre & Transfusion Support, Jaffna',
    district: 'Jaffna',
    province: 'Northern Province',
    type: 'Private Hospital',
    sector: 'PRIVATE',
    phone: '+94 21 222 3456',
    hasBloodBank: true,
    lat: 9.6542,
    lng: 80.0102,
    address: 'Pannai Causeway Road, Jaffna'
  }
];

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = typeof BLOOD_GROUPS[number];

export const BLOOD_COMPATIBILITY: Record<BloodGroup, { canGiveTo: BloodGroup[]; canReceiveFrom: BloodGroup[] }> = {
  'O-': {
    canGiveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-']
  },
  'O+': {
    canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-']
  },
  'A-': {
    canGiveTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-']
  },
  'A+': {
    canGiveTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-']
  },
  'B-': {
    canGiveTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-']
  },
  'B+': {
    canGiveTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-']
  },
  'AB-': {
    canGiveTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-']
  },
  'AB+': {
    canGiveTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  }
};
