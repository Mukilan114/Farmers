
import { Equipment, Category, Produce, ProduceCategory } from './types';

export const EQUIPMENT_DATA: Equipment[] = [
  {
    id: 'e7',
    name: 'John Deere 6150M Heavy Duty',
    category: Category.TRACTOR,
    // Using a very stable, high-quality Unsplash tractor image
    image: 'https://images.unsplash.com/photo-1530268577195-201550970087?q=80&w=1000&auto=format&fit=crop',
    pricePerDay: 750,
    specs: ['150 HP', '4WD', 'High Payload Trailer'],
    availability: 'Available',
    description: 'A massive powerhouse for large scale field work and heavy transportation. Well maintained and powerful.',
    rating: 4.9,
    reviews: 342,
    ownerName: 'Gurbaksh Singh',
    isAnonymous: false
  },
  {
    id: 'e2',
    name: 'Sonalika Tiger DI 65 - AC Cabin',
    category: Category.TRACTOR,
    image: 'https://images.unsplash.com/photo-1599933310631-897c5054700d?q=80&w=1000&auto=format&fit=crop',
    pricePerDay: 850,
    specs: ['65 HP', 'AC Cabin', 'Power Steering'],
    availability: 'Available',
    description: 'Premium comfort and high torque. The AC cabin is a lifesaver for long shifts in the heat.',
    rating: 4.9,
    reviews: 112,
    ownerName: 'Suresh Kumar',
    isAnonymous: false
  },
  {
    id: 'e1',
    name: 'Mahindra Jivo 225 DI 4WD',
    category: Category.TRACTOR,
    image: 'https://images.unsplash.com/photo-1594411130632-4748df1211e6?q=80&w=1000&auto=format&fit=crop',
    pricePerDay: 450,
    specs: ['20 HP', '4WD', 'Compact Size'],
    availability: 'Available',
    description: 'The small giant of Indian farms. Perfect for orchard work and narrow spaces between rows.',
    rating: 4.8,
    reviews: 156,
    ownerName: 'Rajesh G.',
    isAnonymous: false
  },
  {
    id: 'e8',
    name: 'Swaraj 855 FE - Blue Edition',
    category: Category.TRACTOR,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=1000&auto=format&fit=crop',
    pricePerDay: 620,
    specs: ['52 HP', 'Multi-Speed PTO', 'Direction Control Valve'],
    availability: 'Available',
    description: 'Legendary performance and reliability. Known for its raw power in tough terrain.',
    rating: 4.9,
    reviews: 289,
    ownerName: 'Harpreet Dhillon',
    isAnonymous: false
  },
  {
    id: 'e4',
    name: 'Kubota DC-68G Rice Harvester',
    category: Category.HARVESTER,
    image: 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=1000&auto=format&fit=crop',
    pricePerDay: 2800,
    specs: ['Combine Harvester', 'High Speed', 'Clean Grain'],
    availability: 'Available',
    description: 'Specialized for paddy harvesting. Minimal wastage and extremely fast operation.',
    rating: 4.7,
    reviews: 88,
    ownerName: 'Vikram Singh',
    isAnonymous: false
  },
  {
    id: 'e11',
    name: 'Shrachi SF 15 Power Tiller',
    category: Category.ATTACHMENT,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1000&auto=format&fit=crop',
    pricePerDay: 350,
    specs: ['15 HP', 'Diesel Engine', 'Multi-crop Tilling'],
    availability: 'Available',
    description: 'Lightweight and powerful. Ideal for small land owners and inter-crop cultivation.',
    rating: 4.5,
    reviews: 56,
    ownerName: 'Amit Patel',
    isAnonymous: false
  },
  {
    id: 'e9',
    name: 'New Holland 3630 TX Plus',
    category: Category.TRACTOR,
    image: 'https://images.unsplash.com/photo-1620850232777-94d075204ef9?q=80&w=1000&auto=format&fit=crop',
    pricePerDay: 700,
    specs: ['55 HP', 'Double Clutch', 'Independent PTO'],
    availability: 'Available',
    description: 'High performance engine with excellent fuel economy. Ideal for both farming and commercial transport.',
    rating: 4.8,
    reviews: 143,
    ownerName: 'Manjeet K.',
    isAnonymous: false
  },
  {
    id: 'e3',
    name: 'Fieldking Heavy Rotavator',
    category: Category.ATTACHMENT,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1000&auto=format&fit=crop',
    pricePerDay: 250,
    specs: ['6 Feet', '42 Blades', 'Deep Tillage'],
    availability: 'Available',
    description: 'Prepare your seedbed in a single pass. Sharp, durable blades for tough soil.',
    rating: 4.6,
    reviews: 67,
    ownerName: 'Amit Patel',
    isAnonymous: false
  },
  {
    id: 'e12',
    name: 'Automatic Seed Drill - 9 Tynes',
    category: Category.PLOW,
    image: 'https://images.unsplash.com/photo-1534073733331-c5bb07dc62e8?q=80&w=1000&auto=format&fit=crop',
    pricePerDay: 300,
    specs: ['Adjustable Depth', 'Seed & Fertilizer Box', 'Heavy Frame'],
    availability: 'Available',
    description: 'Precision sowing for wheat and soy. Ensures uniform depth and spacing for maximum yield.',
    rating: 4.4,
    reviews: 32,
    ownerName: 'Suresh Kumar',
    isAnonymous: false
  }
];

export const PRODUCE_DATA: Produce[] = [
  {
    id: 'p1',
    name: 'Organic Sharbati Wheat',
    category: ProduceCategory.GRAINS,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1000&auto=format&fit=crop',
    pricePerKg: 38,
    origin: 'Sehore, MP',
    stock: 500,
    description: 'Premium golden wheat grains, known for softness and taste.',
    rating: 4.9,
    reviews: 210,
    farmerName: 'Rajesh G.'
  },
  {
    id: 'p4',
    name: 'Aromatic Basmati Rice',
    category: ProduceCategory.GRAINS,
    image: 'https://images.unsplash.com/photo-1586201327693-d6f4693a100a?q=80&w=1000&auto=format&fit=crop',
    pricePerKg: 110,
    origin: 'Karnal, Haryana',
    stock: 800,
    description: 'Long grain extra aromatic basmati. Aged for 12 months for perfect texture.',
    rating: 4.8,
    reviews: 320,
    farmerName: 'Harpreet Dhillon'
  },
  {
    id: 'p2',
    name: 'Fresh Red Onions',
    category: ProduceCategory.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=1000&auto=format&fit=crop',
    pricePerKg: 28,
    origin: 'Nashik, Maharashtra',
    stock: 1200,
    description: 'High-quality export grade red onions directly from the farm.',
    rating: 4.6,
    reviews: 450,
    farmerName: 'Suresh Kumar'
  },
  {
    id: 'p5',
    name: 'Desi Pink Tomatoes',
    category: ProduceCategory.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop',
    pricePerKg: 42,
    origin: 'Bangalore, KA',
    stock: 350,
    description: 'Sun-ripened organic tomatoes. Juicy, firm, and full of natural vitamins.',
    rating: 4.5,
    reviews: 180,
    farmerName: 'Anil Babu'
  },
  {
    id: 'p6',
    name: 'Premium Vermicompost',
    category: ProduceCategory.FERTILIZER,
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=1000&auto=format&fit=crop',
    pricePerKg: 15,
    origin: 'Indore, MP',
    stock: 2000,
    description: '100% organic earthworm compost. Boosts soil health and plant immunity.',
    rating: 4.7,
    reviews: 124,
    farmerName: 'Manjeet K.'
  }
];

export const EQUIPMENT_CATEGORIES = Object.values(Category);
export const PRODUCE_CATEGORIES = Object.values(ProduceCategory);
