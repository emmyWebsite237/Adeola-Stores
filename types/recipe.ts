export interface RecipeIngredient {
  productId: string;
  name: string;
  amount: string;
  required: boolean;
  notes?: string;
}

export interface Recipe {
  id: string;
  slug: string;
  name: string;
  headline: string;
  image: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Chef';
  category: 'Soups & Stews' | 'Rice & Grains' | 'Breakfast' | 'Swallows' | 'Snacks';
  description: string;
  instructions: string[];
  ingredients: RecipeIngredient[];
}
