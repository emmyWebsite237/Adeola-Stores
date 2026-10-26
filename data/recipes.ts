import { Recipe } from '@/types/recipe';

export const RECIPES: Recipe[] = [
  {
    id: 'party-jollof-rice',
    slug: 'party-jollof-rice',
    name: 'Smoky Lagos Party Jollof Rice',
    headline: 'The undisputed king of Nigerian parties — rich, smoky, and perfectly seasoned.',
    image: '/images/scene-hero.png',
    prepTime: '20 mins',
    cookTime: '45 mins',
    servings: 6,
    difficulty: 'Medium',
    category: 'Rice & Grains',
    description: 'The secret to authentic Lagos party jollof is a rich, reduced tomato-pepper base fried to perfection, followed by parboiled long grain rice cooked in seasoned chicken broth until smoky and tender.',
    instructions: [
      'Blend red bell peppers, scotch bonnet (ata rodo), tomatoes, onions, and ginger until smooth.',
      'Heat vegetable oil in a sturdy pot. Fry sliced onions, then add tomato paste and fry for 5 minutes until darkened.',
      'Pour in the blended pepper puree and fry on medium heat until oil separates from the stew.',
      'Season with curry powder, thyme, bay leaves, stock cubes, and salt. Stir in rich chicken stock.',
      'Wash parboiled rice thoroughly and pour into the boiling stew. The liquid level should just cover the rice.',
      'Cover tightly with foil and a lid to trap steam. Cook on low heat for 30 minutes until grains are tender and a distinct smoky party aroma develops.'
    ],
    ingredients: [
      { productId: 'golden-penny-pure-vegetable-oil', name: 'Pure Vegetable Oil (2L or 1L)', amount: '1 cup', required: true },
      { productId: 'derica-tomato-paste', name: 'Rich Tomato Paste Can', amount: '2 tins', required: true },
      { productId: 'curry-powder', name: 'Curry Powder & Dried Thyme', amount: '2 tbsp', required: true },
      { productId: 'knorr-chicken-seasoning-cubes', name: 'Knorr Chicken Stock Cubes', amount: '4 cubes', required: true },
      { productId: 'bay-leaves-spice-pack', name: 'Aromatic Dried Bay Leaves', amount: '4 leaves', required: false }
    ]
  },
  {
    id: 'rich-egusi-soup',
    slug: 'rich-egusi-soup',
    name: 'Lumpy Egusi Soup with Bitterleaf & Ugu',
    headline: 'Rich melon seed soup simmered with dried fish, stockfish, and aromatic leafy greens.',
    image: '/images/scene-warehouse.png',
    prepTime: '25 mins',
    cookTime: '40 mins',
    servings: 5,
    difficulty: 'Medium',
    category: 'Soups & Stews',
    description: 'Hearty Nigerian ground melon seed soup prepared frying-method style to create signature tender egusi lumps, loaded with crayfish, smoked fish, palm oil, and fresh greens.',
    instructions: [
      'Boil seasoned assorted meat and stockfish until tender, reserving the concentrated broth.',
      'Blend ground melon seeds (egusi) with warm water or egg to form a thick, moldable paste.',
      'Heat palm oil in a pot and sauté diced onions for 2 minutes.',
      'Drop teaspoon-sized balls of the egusi paste into the oil. Fry on low heat for 10 minutes without stirring to form lumps.',
      'Gently pour in meat stock and crayfish. Cover and simmer for 15 minutes until egusi is thoroughly cooked.',
      'Add washed bitterleaf or spinach/ugu, simmer for 3 more minutes, and serve with hot Pounded Yam or Semovita.'
    ],
    ingredients: [
      { productId: 'ground-egusi-melon-seeds', name: 'Milled White Egusi Melon Seeds', amount: '3 cups', required: true },
      { productId: 'red-palm-oil', name: 'Pure Nigerian Red Palm Oil', amount: '1.5 cups', required: true },
      { productId: 'ground-crayfish', name: 'Dried Ground Crayfish', amount: '1/2 cup', required: true },
      { productId: 'stockfish-chunks', name: 'Dried Stockfish & Smoked Catfish', amount: '350g', required: true },
      { productId: 'maggi-star-seasoning-cubes', name: 'Maggi Star Seasoning Cubes', amount: '3 cubes', required: true }
    ]
  },
  {
    id: 'quick-indomie-special',
    slug: 'quick-indomie-special',
    name: 'Student & Late Night Indomie Supreme',
    headline: 'The classic Nigerian noodle upgrade with eggs, sweet peppers, and tomato relish.',
    image: '/images/scene-payment.png',
    prepTime: '5 mins',
    cookTime: '10 mins',
    servings: 2,
    difficulty: 'Easy',
    category: 'Snacks',
    description: 'Transform regular instant noodles into a rich, comforting meal in 10 minutes. Sautéed with fresh peppers, onions, seasoning, and topped with sunny-side fried or boiled eggs.',
    instructions: [
      'Boil 2 packs of noodles in 1.5 cups of water for 3 minutes until semi-soft, then drain excess water.',
      'Heat 1 tablespoon of vegetable oil in a pan. Sauté diced onions and fresh scotch bonnet peppers for 1 minute.',
      'Add half a spoon of tomato paste, sardine or corned beef, and noodle seasoning powder.',
      'Toss the drained noodles into the pan, stirring well to coat evenly in the savory sauce.',
      'Serve hot with a freshly fried sunny-side egg on top.'
    ],
    ingredients: [
      { productId: 'indomie-instant-noodles-hungryman', name: 'Indomie Hungryman / Onion Chicken', amount: '2 packs', required: true },
      { productId: 'fresh-table-eggs-crate', name: 'Farm Fresh Table Eggs', amount: '2 eggs', required: true },
      { productId: 'titus-sardines-in-oil', name: 'Titus Sardines in Vegetable Oil', amount: '1 tin', required: false },
      { productId: 'golden-penny-pure-vegetable-oil', name: 'Pure Vegetable Oil', amount: '1 tbsp', required: false }
    ]
  },
  {
    id: 'creamy-breakfast-custard',
    slug: 'creamy-breakfast-custard',
    name: 'Creamy Vanilla Custard & Akara Combo',
    headline: 'Silky smooth hot vanilla custard topped with rich evaporated milk and sugar.',
    image: '/images/scene-hero.png',
    prepTime: '5 mins',
    cookTime: '5 mins',
    servings: 3,
    difficulty: 'Easy',
    category: 'Breakfast',
    description: 'The beloved Saturday morning Nigerian breakfast. Silky smooth custard prepared with hot boiling water, sweetened with Peak milk and granulated sugar, paired with hot bean cakes (akara) or fried plantain.',
    instructions: [
      'In a wide bowl, mix 4 tablespoons of Checkers custard powder with 3 tablespoons of cold water to form a smooth, lump-free paste.',
      'Bring fresh water to a rolling boil.',
      'Gently pour boiling water into the custard paste while stirring continuously in one direction until it instantly thickens into a glossy, translucent pudding.',
      'Drizzle with rich Peak milk and sugar to taste. Enjoy warm!'
    ],
    ingredients: [
      { productId: 'custard-3-in-1-cup', name: 'Checkers Custard Powder (Vanilla)', amount: '4 tbsp', required: true },
      { productId: 'peak-full-cream-evaporated-milk', name: 'Peak Full Cream Evaporated Milk', amount: '1 tin', required: true },
      { productId: 'dangote-granulated-sugar-refill', name: 'Dangote Refined White Sugar', amount: '2 tbsp', required: false }
    ]
  }
];
