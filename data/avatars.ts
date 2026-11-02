export interface PresetAvatar {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  svgUrl: string;
}

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'mama-kitchen',
    name: 'Mama Kitchen',
    emoji: '👩🏾‍🍳',
    bgColor: '#166534',
    svgUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23166534"/><text x="50" y="65" font-size="46" text-anchor="middle">👩🏾‍🍳</text></svg>',
  },
  {
    id: 'happy-shopper',
    name: 'Happy Shopper',
    emoji: '🛒',
    bgColor: '#0284c7',
    svgUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230284c7"/><text x="50" y="65" font-size="46" text-anchor="middle">🛒</text></svg>',
  },
  {
    id: 'market-basket',
    name: 'Market Basket',
    emoji: '🧺',
    bgColor: '#d97706',
    svgUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23d97706"/><text x="50" y="65" font-size="46" text-anchor="middle">🧺</text></svg>',
  },
  {
    id: 'ata-rodo',
    name: 'Ata Rodo Spices',
    emoji: '🌶️',
    bgColor: '#dc2626',
    svgUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23dc2626"/><text x="50" y="65" font-size="46" text-anchor="middle">🌶️</text></svg>',
  },
  {
    id: 'fresh-harvest',
    name: 'Fresh Harvest',
    emoji: '🍅',
    bgColor: '#e11d48',
    svgUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23e11d48"/><text x="50" y="65" font-size="46" text-anchor="middle">🍅</text></svg>',
  },
  {
    id: 'smiling-farmer',
    name: 'Green Farmer',
    emoji: '👨🏾‍🌾',
    bgColor: '#15803d',
    svgUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%2315803d"/><text x="50" y="65" font-size="46" text-anchor="middle">👨🏾‍🌾</text></svg>',
  },
  {
    id: 'golden-grains',
    name: 'Golden Maize',
    emoji: '🌽',
    bgColor: '#ca8a04',
    svgUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23ca8a04"/><text x="50" y="65" font-size="46" text-anchor="middle">🌽</text></svg>',
  },
  {
    id: 'lagos-foodie',
    name: 'Lagos Foodie',
    emoji: '🍲',
    bgColor: '#7c3aed',
    svgUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%237c3aed"/><text x="50" y="65" font-size="46" text-anchor="middle">🍲</text></svg>',
  },
];
