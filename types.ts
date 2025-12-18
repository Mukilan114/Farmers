
export enum Category {
  TRACTOR = 'Tractors',
  HARVESTER = 'Harvesters',
  ATTACHMENT = 'Attachments',
  IRRIGATION = 'Irrigation',
  PLOW = 'Plows & Tillage'
}

export enum ProduceCategory {
  GRAINS = 'Grains & Cereals',
  VEGETABLES = 'Fresh Vegetables',
  FRUITS = 'Fresh Fruits',
  SEEDS = 'High Quality Seeds',
  FERTILIZER = 'Organic Fertilizer'
}

export type AppTab = 'RENT' | 'SHOP' | 'SELL' | 'WISHLIST' | 'RENT_HISTORY';

export interface Equipment {
  id: string;
  name: string;
  category: Category;
  image: string;
  pricePerDay: number;
  specs: string[];
  availability: 'Available' | 'Busy' | 'Maintenance';
  description: string;
  rating: number;
  reviews: number;
  ownerName: string; 
  isAnonymous: boolean;
}

export interface Produce {
  id: string;
  name: string;
  category: ProduceCategory;
  image: string;
  pricePerKg: number;
  origin: string;
  stock: number;
  description: string;
  rating: number;
  reviews: number;
  farmerName: string;
}

export interface BookingDetails {
  equipmentId: string;
  equipmentName: string;
  customerName: string;
  phone: string;
  village: string;
  startDate: string;
  endDate: string;
}

export interface RentHistoryEntry extends BookingDetails {
  id: string;
  bookingDate: string;
  pricePerDay: number;
}

export interface RecommendationResponse {
  recommendation: string;
  suggestedIds: string[];
}
