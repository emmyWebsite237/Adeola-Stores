import { Recipe } from '@/types/recipe';

export const RECIPES: Recipe[] = [
  {
    id: 'party-jollof-rice',
    slug: 'party-jollof-rice',
    name: 'Smoky Lagos Party Jollof Rice',
    headline: 'The undisputed king of Nigerian parties — rich, firewood-smoky, and cooked with authentic ingredients.',
    image: '/images/scene-hero.png',
    prepTime: '20 mins',
    cookTime: '45 mins',
    servings: 8,
    difficulty: 'Medium',
    category: 'Rice & Grains',
    description: 'Authentic Nigerian party jollof gets its signature taste and brick-red color from frying concentrated Gino Party Jollof paste and pepper puree in pure vegetable oil, boiling in seasoned chicken broth, and sealing with foil to steam until smoky and tender.',
    instructions: [
      'Wash parboiled rice in lukewarm water until the water runs completely clear, then drain in a colander.',
      'Heat Kings pure vegetable oil in a heavy-bottomed pot. Sauté diced onions for 2 minutes.',
      'Add Gino Tomato Party Jollof Paste and Gino Pepper & Onion Paste. Fry on medium-low heat for 10-12 minutes, stirring continuously until the oil turns red and separates from the stew.',
      'Stir in Knorr chicken cubes, Ducros curry powder, thyme, bay leaves, and salt. Pour in seasoned chicken stock and bring to a rapid boil.',
      'Pour in the washed rice. The broth should sit level with the rice (not too drowned, to prevent soggy grains).',
      'Dot the top with slices of Golden Penny butter/margarine and onion rings for authentic party sheen and aroma.',
      'Seal the pot tightly with aluminum foil before putting on the lid to trap high-pressure steam. Cook on low heat for 30 minutes.',
      'Let the bottom layer catch and caramelize slightly for 3-5 minutes to infuse the signature smoky party aroma. Stir gently from the bottom with a wooden spatula and serve!'
    ],
    ingredients: [
      { productId: 'my-choice-rice-wholesale-bag', name: 'My Choice Long-Grain Parboiled Rice', amount: '1 bag / 4 cups', required: true },
      { productId: 'gino-tomato-party-jollof-paste', name: 'Gino Tomato Party Jollof Paste', amount: '2 sachets / tins', required: true },
      { productId: 'gino-pepper-and-onion-paste', name: 'Gino Pepper & Onion Puree Mix', amount: '2 sachets', required: true },
      { productId: 'kings-pure-vegetable-oil', name: 'Kings Pure Vegetable Oil', amount: '1 cup (for frying)', required: true },
      { productId: 'knorr-chicken-seasoning-cubes', name: 'Knorr Chicken Stock Cubes', amount: '4 cubes', required: true },
      { productId: 'golden-penny-butter-big-size', name: 'Golden Penny Butter / Margarine', amount: '2 tbsp (for party gloss)', required: true },
      { productId: 'ducros-curry-powder-and-thyme-pack', name: 'Ducros Curry Powder & Thyme Duo', amount: '2 tbsp', required: true },
      { productId: 'aromatic-bay-leaves-pouch', name: 'Aromatic Dried Bay Leaves', amount: '4 whole leaves', required: false }
    ]
  },
  {
    id: 'quick-indomie-special',
    slug: 'quick-indomie-special',
    name: 'Classic Nigerian Indomie & Sardine Supreme',
    headline: 'The ultimate quick Nigerian comfort meal sautéed with fresh pepper relish and Titus sardine.',
    image: '/images/scene-payment.png',
    prepTime: '5 mins',
    cookTime: '10 mins',
    servings: 2,
    difficulty: 'Easy',
    category: 'Snacks & Noodles',
    description: 'Transform regular instant noodles into a rich gourmet meal in 10 minutes. Sautéed with pepper and onion paste, whole Titus sardine in oil, and noodle seasoning.',
    instructions: [
      'Boil 2 packs of Indomie noodles in 1.5 cups of boiling water for 3 minutes until parboiled, then drain excess liquid.',
      'Heat 1 tablespoon of vegetable oil in a pan. Sauté 1 tablespoon of Gino pepper and onion paste for 1 minute.',
      'Flake in half a tin of Titus sardine along with its rich oil.',
      'Toss in the parboiled noodles and the Indomie seasoning sachet. Stir evenly on medium heat for 2 minutes until glossy and infused with flavor.',
      'Serve hot with a boiled or fried egg.'
    ],
    ingredients: [
      { productId: 'super-pack-indomie-carton', name: 'Super Pack Indomie Noodles', amount: '2-4 packs', required: true },
      { productId: 'titus-sardines-can', name: 'Titus Sardines in Vegetable Oil', amount: '1 tin', required: true },
      { productId: 'gino-pepper-and-onion-paste', name: 'Gino Pepper and Onion Paste', amount: '1 sachet', required: false },
      { productId: 'kings-pure-vegetable-oil', name: 'Kings Pure Vegetable Oil', amount: '1 tbsp', required: false }
    ]
  },
  {
    id: 'creamy-breakfast-custard',
    slug: 'creamy-breakfast-custard',
    name: 'Creamy Golden Breakfast Custard',
    headline: 'Silky smooth vanilla custard enriched with Peak full cream milk and sugar.',
    image: '/images/scene-hero.png',
    prepTime: '3 mins',
    cookTime: '4 mins',
    servings: 3,
    difficulty: 'Easy',
    category: 'Breakfast Cereals',
    description: 'The beloved traditional Nigerian morning breakfast. Silky smooth Checkers vanilla custard prepared with boiling water, enriched with Peak full cream powdered milk and sweet sugar cubes.',
    instructions: [
      'In a wide cereal bowl, dissolve 4 heaped tablespoons of Checkers custard powder in 3 tablespoons of cold water to form a smooth, lump-free paste.',
      'Bring fresh water to a full, rolling boil.',
      'Pour the boiling water slowly in a continuous stream into the custard paste while stirring vigorously in one direction until it thickens into a glossy, velvety consistency.',
      'Top generously with Peak full cream milk powder and St. Louis sugar cubes to taste. Enjoy piping hot!'
    ],
    ingredients: [
      { productId: 'custard-3-in-1-refill', name: 'Checkers Custard 3-in-1 Refill', amount: '4 tbsp', required: true },
      { productId: 'peak-full-cream-milk-powder-refill', name: 'Peak Full Cream Milk Powder', amount: '3 tbsp', required: true },
      { productId: 'st-louis-sugar-cube-box', name: 'St. Louis Sugar Cube Box', amount: '3 cubes', required: false }
    ]
  },
  {
    id: 'party-fried-rice-special',
    slug: 'party-fried-rice-special',
    name: 'Authentic Nigerian Party Fried Rice',
    headline: 'Fragrant golden rice infused with rich seasoned meat stock, curry, sweet corn, and savory liver.',
    image: '/images/scene-delivery.png',
    prepTime: '25 mins',
    cookTime: '35 mins',
    servings: 6,
    difficulty: 'Medium',
    category: 'Rice & Grains',
    description: 'The celebrated staple of every Lagos owambe. Parboiled rice cooked 80% through in deeply seasoned chicken stock and curry, then stir-fried on high heat with Green Giant sweet corn, diced carrots, green beans, and seasoned liver for distinct, non-soggy grains.',
    instructions: [
      'Wash parboiled rice thoroughly in lukewarm water until the starch is completely washed away and the water is clear.',
      'In a wide pot, bring seasoned chicken broth to a boil with Ducros curry powder, thyme, and Knorr chicken cubes.',
      'Add the washed rice to the boiling stock. Parboil until the liquid is absorbed and rice is 80% tender (firm to the bite). Remove from heat and spread out on a tray to cool.',
      'Heat Kings pure vegetable oil and Golden Penny butter in a large wok or wide non-stick skillet.',
      'Sauté diced onions, Green Giant sweet corn, diced carrots, and seasonings on high heat for 3 minutes.',
      'Toss in the parboiled rice in batches, stir-frying on medium-high heat for 6-8 minutes until steam rises and each grain is infused with fragrant curry aroma and vegetables.',
      'Serve hot alongside crispy fried chicken, peppered gizzard, or fried plantains.'
    ],
    ingredients: [
      { productId: 'my-choice-rice-wholesale-bag', name: 'My Choice Long-Grain Parboiled Rice', amount: '1 bag / 4 cups', required: true },
      { productId: 'green-giant-sweet-corn-tin', name: 'Green Giant Sweet Corn in Brine', amount: '1 tin', required: true },
      { productId: 'kings-pure-vegetable-oil', name: 'Kings Pure Vegetable Oil', amount: '4 tbsp (stir-fry)', required: true },
      { productId: 'ducros-curry-powder-and-thyme-pack', name: 'Ducros Curry Powder & Thyme Duo', amount: '2 tbsp', required: true },
      { productId: 'knorr-chicken-seasoning-cubes', name: 'Knorr Chicken Stock Cubes', amount: '3 cubes', required: true },
      { productId: 'golden-penny-butter-big-size', name: 'Golden Penny Butter / Margarine', amount: '1 tbsp', required: false }
    ]
  },
  {
    id: 'owambe-jollof-spaghetti',
    slug: 'owambe-jollof-spaghetti',
    name: 'Quick Lagos Jollof Spaghetti & Beef',
    headline: 'Al dente spaghetti simmered in rich Gino party jollof pepper sauce and tender savory corned beef.',
    image: '/images/scene-hero.png',
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: 4,
    difficulty: 'Easy',
    category: 'Pasta & Noodles',
    description: 'A beloved weekday dinner favorite across Nigerian homes. Golden Penny spaghetti tossed and simmered in a reduced tomato and pepper base, seasoned with Knorr cubes, thyme, and Exeter corned beef.',
    instructions: [
      'Bring a large pot of salted water to a rolling boil. Add Golden Penny spaghetti (broken into halves or whole) and cook for 6-7 minutes until al dente. Drain and set aside.',
      'In a wide saucepan, heat Kings vegetable oil and sauté chopped onions for 2 minutes.',
      'Add Gino Tomato Party Jollof Paste and Gino Pepper & Onion Puree. Fry on medium heat until the sourness is cooked out and the oil turns deep red.',
      'Stir in Exeter corned beef, breaking it gently into savory chunks with a wooden spoon.',
      'Season with Knorr chicken cubes, curry powder, and thyme. Pour in 1 cup of stock or water and bring to a simmer.',
      'Fold the drained spaghetti into the sauce, tossing gently until every strand is coated in red sauce.',
      'Cover with foil and lid, let steam on the lowest heat setting for 5 minutes, then serve piping hot!'
    ],
    ingredients: [
      { productId: 'spaghetti-golden-penny-carton', name: 'Golden Penny Spaghetti Pasta', amount: '1-2 packs (500g)', required: true },
      { productId: 'gino-tomato-party-jollof-paste', name: 'Gino Tomato Party Jollof Paste', amount: '2 sachets', required: true },
      { productId: 'gino-pepper-and-onion-paste', name: 'Gino Pepper & Onion Puree Mix', amount: '1 sachet', required: true },
      { productId: 'exeter-corned-beef-can', name: 'Exeter Corned Beef Original Can', amount: '1 tin (340g)', required: true },
      { productId: 'kings-pure-vegetable-oil', name: 'Kings Pure Vegetable Oil', amount: '3 tbsp', required: true },
      { productId: 'knorr-chicken-seasoning-cubes', name: 'Knorr Chicken Stock Cubes', amount: '2 cubes', required: true },
      { productId: 'ducros-curry-powder-and-thyme-pack', name: 'Ducros Curry Powder & Thyme Duo', amount: '1 tbsp', required: false }
    ]
  }
];
