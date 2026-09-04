// Shared court data for Court Finder and Preferred Courts
// Courts are categorized as Indoor (clubs) or Outdoor (public)

export interface Court {
  id: number;
  name: string;
  address: string;
  city: string;
  distance?: string;
  type: 'Indoor' | 'Outdoor';
  surface: 'Hard' | 'Clay' | 'Grass' | 'Synthetic';
  hasLights: boolean;
  price: string;
  hours: string;
  courtCount: number;
  rating: number;
  reviewCount: number;
  phone: string;
  amenities: string[];
  isPublic: boolean;
  isSaved?: boolean;
}

// Cities for autocomplete
export const CITIES = [
  "Vancouver, BC",
  "Burnaby, BC", 
  "Richmond, BC",
  "Surrey, BC",
  "North Vancouver, BC",
  "West Vancouver, BC",
  "Coquitlam, BC",
  "New Westminster, BC",
  "Victoria, BC",
  "Toronto, ON",
  "Calgary, AB",
  "Montreal, QC"
];

// Outdoor Courts (Public)
export const OUTDOOR_COURTS: Court[] = [
  {
    id: 1,
    name: 'Stanley Park Tennis Courts',
    address: '8901 Stanley Park Dr',
    city: 'Vancouver, BC',
    distance: '2.1 km',
    type: 'Outdoor',
    surface: 'Hard',
    hasLights: true,
    price: 'Free',
    hours: '6am - 10pm',
    courtCount: 17,
    rating: 4.5,
    reviewCount: 128,
    phone: '604-257-8400',
    amenities: ['Lights', 'Washrooms', 'Parking', 'Pro Shop'],
    isPublic: true,
  },
  {
    id: 2,
    name: 'Queen Elizabeth Park Courts',
    address: '4600 Cambie St',
    city: 'Vancouver, BC',
    distance: '3.2 km',
    type: 'Outdoor',
    surface: 'Hard',
    hasLights: true,
    price: 'Free',
    hours: '6am - 10pm',
    courtCount: 8,
    rating: 4.3,
    reviewCount: 89,
    phone: '604-257-8584',
    amenities: ['Lights', 'Washrooms', 'Parking'],
    isPublic: true,
  },
  {
    id: 3,
    name: 'Kitsilano Beach Courts',
    address: '2305 Cornwall Ave',
    city: 'Vancouver, BC',
    distance: '4.0 km',
    type: 'Outdoor',
    surface: 'Hard',
    hasLights: false,
    price: 'Free',
    hours: '6am - Dusk',
    courtCount: 10,
    rating: 4.6,
    reviewCount: 156,
    phone: '604-257-8400',
    amenities: ['Beach Access', 'Washrooms', 'Concession'],
    isPublic: true,
  },
  {
    id: 4,
    name: 'Jericho Beach Courts',
    address: '3941 Point Grey Rd',
    city: 'Vancouver, BC',
    distance: '5.5 km',
    type: 'Outdoor',
    surface: 'Hard',
    hasLights: false,
    price: 'Free',
    hours: '6am - Dusk',
    courtCount: 6,
    rating: 4.4,
    reviewCount: 67,
    phone: '604-257-8400',
    amenities: ['Beach Access', 'Washrooms', 'Parking'],
    isPublic: true,
  },
  {
    id: 5,
    name: 'Central Park Courts',
    address: '3883 Imperial St',
    city: 'Burnaby, BC',
    distance: '6.8 km',
    type: 'Outdoor',
    surface: 'Hard',
    hasLights: true,
    price: 'Free',
    hours: '6am - 10pm',
    courtCount: 12,
    rating: 4.2,
    reviewCount: 45,
    phone: '604-294-7450',
    amenities: ['Lights', 'Washrooms', 'Parking', 'Playground'],
    isPublic: true,
  },
  {
    id: 6,
    name: 'UBC Tennis Courts',
    address: '6000 Student Union Blvd',
    city: 'Vancouver, BC',
    distance: '8.2 km',
    type: 'Outdoor',
    surface: 'Hard',
    hasLights: true,
    price: '$15/hr',
    hours: '7am - 11pm',
    courtCount: 10,
    rating: 4.5,
    reviewCount: 112,
    phone: '604-822-6000',
    amenities: ['Lights', 'Pro Shop', 'Lessons', 'Locker Rooms'],
    isPublic: true,
  },
];

// Indoor Courts (Clubs)
export const INDOOR_COURTS: Court[] = [
  {
    id: 101,
    name: 'Vancouver Lawn Tennis Club',
    address: '1630 W 15th Ave',
    city: 'Vancouver, BC',
    distance: '2.8 km',
    type: 'Indoor',
    surface: 'Hard',
    hasLights: true,
    price: '$35/hr',
    hours: '6am - 11pm',
    courtCount: 8,
    rating: 4.8,
    reviewCount: 234,
    phone: '604-731-8141',
    amenities: ['Indoor', 'Pro Shop', 'Lessons', 'Locker Rooms', 'Fitness Center', 'Restaurant'],
    isPublic: false,
  },
  {
    id: 102,
    name: 'Jericho Tennis Club',
    address: '3837 Point Grey Rd',
    city: 'Vancouver, BC',
    distance: '5.3 km',
    type: 'Indoor',
    surface: 'Clay',
    hasLights: true,
    price: '$30/hr',
    hours: '7am - 10pm',
    courtCount: 12,
    rating: 4.7,
    reviewCount: 189,
    phone: '604-224-2128',
    amenities: ['Indoor', 'Outdoor', 'Clay Courts', 'Pro Shop', 'Lessons', 'Clubhouse'],
    isPublic: false,
  },
  {
    id: 103,
    name: 'Burnaby Tennis Club',
    address: '3890 Kensington Ave',
    city: 'Burnaby, BC',
    distance: '7.1 km',
    type: 'Indoor',
    surface: 'Hard',
    hasLights: true,
    price: '$25/hr',
    hours: '6am - 10pm',
    courtCount: 6,
    rating: 4.5,
    reviewCount: 98,
    phone: '604-291-1234',
    amenities: ['Indoor', 'Pro Shop', 'Lessons', 'Locker Rooms', 'Parking'],
    isPublic: false,
  },
  {
    id: 104,
    name: 'Richmond Tennis Club',
    address: '6820 Gilbert Rd',
    city: 'Richmond, BC',
    distance: '9.5 km',
    type: 'Indoor',
    surface: 'Hard',
    hasLights: true,
    price: '$28/hr',
    hours: '7am - 10pm',
    courtCount: 8,
    rating: 4.4,
    reviewCount: 76,
    phone: '604-278-4653',
    amenities: ['Indoor', 'Pro Shop', 'Junior Programs', 'Locker Rooms'],
    isPublic: false,
  },
  {
    id: 105,
    name: 'North Shore Winter Club',
    address: '1325 E Keith Rd',
    city: 'North Vancouver, BC',
    distance: '8.9 km',
    type: 'Indoor',
    surface: 'Hard',
    hasLights: true,
    price: '$40/hr',
    hours: '6am - 11pm',
    courtCount: 10,
    rating: 4.9,
    reviewCount: 312,
    phone: '604-985-4135',
    amenities: ['Indoor', 'Pro Shop', 'Lessons', 'Fitness Center', 'Pool', 'Restaurant'],
    isPublic: false,
  },
];

// Combined courts
export const ALL_COURTS: Court[] = [...OUTDOOR_COURTS, ...INDOOR_COURTS];

// Get courts by type
export const getCourtsByType = (type: 'Indoor' | 'Outdoor' | 'All'): Court[] => {
  if (type === 'Indoor') return INDOOR_COURTS;
  if (type === 'Outdoor') return OUTDOOR_COURTS;
  return ALL_COURTS;
};

// Get courts by city
export const getCourtsByCity = (city: string, courts: Court[] = ALL_COURTS): Court[] => {
  if (!city || city === 'All') return courts;
  return courts.filter(c => c.city.toLowerCase().includes(city.toLowerCase()));
};

// Search courts by name
export const searchCourts = (query: string, courts: Court[] = ALL_COURTS): Court[] => {
  if (!query) return courts;
  const lowerQuery = query.toLowerCase();
  return courts.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.city.toLowerCase().includes(lowerQuery) ||
    c.address.toLowerCase().includes(lowerQuery)
  );
};
