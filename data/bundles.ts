export interface BundlePack {
  id: string;
  name: string;
  tagline: string;
  price: number;
  oldPrice: number;
  savings: number;
  itemsCount: number;
  badge: string;
  image: string;
  idealFor: string;
  items: {
    name: string;
    size: string;
    qty: number;
  }[];
}

export const BUNDLE_PACKS: BundlePack[] = [
  {
    id: 'monthly-family-staples',
    name: 'Aunt Adeola Monthly Family Feast Kit',
    tagline: 'Complete household pantry restock for families of 3–6. All monthly staples in one delivery.',
    price: 68500,
    oldPrice: 79000,
    savings: 10500,
    itemsCount: 8,
    badge: 'Save ₦10,500',
    image: '/images/scene-hero.png',
    idealFor: 'Families of 3–6 people',
    items: [
      { name: 'Long Grain Parboiled Rice', size: '10kg Bag', qty: 1 },
      { name: 'Pure Vegetable Oil', size: '3L Canister', qty: 1 },
      { name: 'Golden Penny Spaghetti', size: 'Pack of 5', qty: 1 },
      { name: 'Indomie Onion Chicken', size: 'Carton of 40', qty: 1 },
      { name: 'Knorr Seasoning Cubes', size: 'Pack of 50', qty: 1 },
      { name: 'Derica Tomato Paste', size: 'Pack of 6', qty: 1 },
      { name: 'Peak Milk Refill Pouch', size: '850g Pouch', qty: 1 },
      { name: 'Dangote Refined Sugar', size: '1kg Pack', qty: 1 }
    ]
  },
  {
    id: 'student-campus-survival',
    name: 'Student & Youth Survival Bundle',
    tagline: 'Fast cooking, high yield, and pocket-friendly groceries for campus and single living.',
    price: 24500,
    oldPrice: 28900,
    savings: 4400,
    itemsCount: 5,
    badge: 'Popular for Campus',
    image: '/images/scene-payment.png',
    idealFor: 'Students & Single Professionals',
    items: [
      { name: 'Indomie Hungryman Noodles', size: 'Carton of 24', qty: 1 },
      { name: 'Checkers Custard Powder', size: '1kg Refill', qty: 1 },
      { name: 'Peak Full Cream Evaporated Milk', size: '6 Tins', qty: 1 },
      { name: 'Golden Penny Spaghetti', size: '3 Packs', qty: 1 },
      { name: 'Table Eggs', size: 'Crate of 30', qty: 1 }
    ]
  },
  {
    id: 'weekend-soup-stew-pot',
    name: 'Weekend Soup & Stew Master Pack',
    tagline: 'All core pantry condiments, oils, and spices needed to cook 2 large pots of soup and stew.',
    price: 36000,
    oldPrice: 42000,
    savings: 6000,
    itemsCount: 6,
    badge: 'Sunday Special',
    image: '/images/scene-warehouse.png',
    idealFor: 'Weekend Cooking & Meal Prep',
    items: [
      { name: 'Pure Red Palm Oil', size: '2 Litres', qty: 1 },
      { name: 'Pure Vegetable Cooking Oil', size: '2 Litres', qty: 1 },
      { name: 'Ground Crayfish Pure', size: '250g Jar', qty: 1 },
      { name: 'Gino Peppe & Onion Tomato Paste', size: 'Pack of 10', qty: 1 },
      { name: 'Maggi Star Stock Cubes', size: 'Pack of 100', qty: 1 },
      { name: 'Dry Bay Leaves & Thyme Set', size: 'Dual Pack', qty: 1 }
    ]
  }
];
