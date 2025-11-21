import { filterRecipes, Filters } from "@/utils/filterRecipes";
import { Recipe } from "@/types/recipe";

const mockRecipes: Recipe[] = [
  {
    id: '1',
    slug: 'spam-musubi',
    title: 'Spam Musubi',
    cookTime: 20,
    difficulty: 'Easy',
    diet: 'Any',
    ingredients: ['spam', 'white rice', 'nori'],
  },
  {
    id: '2',
    slug: 'shoyu-chicken',
    title: 'Shoyu Chicken',
    cookTime: 40,
    difficulty: 'Easy',
    diet: 'Any',
    ingredients: ['chicken thighs', 'soy sauce', 'brown sugar', 'garlic'],
  },
  {
    id: '3',
    slug: 'huli-huli-chicken',
    title: 'Huli Huli Chicken',
    cookTime: 60,
    difficulty: 'Hard',
    diet: 'Any',
    ingredients: ['chicken thighs', 'pineapple juice', 'soy sauce', 'rice'],
  },
  {
    id: '4',
    slug: 'chicken-stir-fry',
    title: 'Chicken Stir Fry',
    cookTime: 30,
    difficulty: 'Normal',
    diet: 'Any',
    ingredients: ['chicken breast', 'mixed vegetables', 'soy sauce', 'ginger'],
  },
];

describe('filterRecipes', () => {
    it('filters all recipes if no filters are applied', () => {
        const filters: Filters = {
            searchQuery: '',
            ingredients: [],
            maxMinutes: null,
            difficulty: 'Any',
            diet: 'Any',
        };
        const result = filterRecipes(mockRecipes, filters);
        expect(result).toEqual(mockRecipes);
        expect(result.length).toBe(4);
    });

    it('filters recipes by single search query', () => {
        const filters: Filters = {
            searchQuery: 'chicken',
            ingredients: [],
            maxMinutes: null,
            difficulty: 'Any',
            diet: 'Any',
        };
        const result = filterRecipes(mockRecipes, filters);
        expect(result.length).toBe(3);
        expect(result.map(r => r.slug)).toEqual(['shoyu-chicken', 'huli-huli-chicken', 'chicken-stir-fry']);
    });

    it('filters recipes by incomplete words', () => {
        const filters: Filters = {
            searchQuery: 'chi',
            ingredients: [],
            maxMinutes: null,
            difficulty: 'Any',
            diet: 'Any',
        };
        const result = filterRecipes(mockRecipes, filters);
        expect(result.length).toBe(3);
        expect(result.map(r => r.slug)).toEqual(['shoyu-chicken', 'huli-huli-chicken', 'chicken-stir-fry']);
    });

    it('filters recipes by ingredients', () => {
        const filters: Filters = {
            searchQuery: '',
            ingredients: ['rice'],
            maxMinutes: null,
            difficulty: 'Any',
            diet: 'Any',
        };
        const result = filterRecipes(mockRecipes, filters);
        expect(result.length).toBe(2);
        expect(result.map(r => r.slug)).toEqual(['spam-musubi', 'huli-huli-chicken']);
    });

    it('filters recipes by max cook time', () => {
        const filters: Filters = {
            searchQuery: '',
            ingredients: [],
            maxMinutes: 30,
            difficulty: 'Any',
            diet: 'Any',
        };
        const result = filterRecipes(mockRecipes, filters);
        expect(result.length).toBe(2);
        expect(result.map(r => r.slug)).toEqual(['spam-musubi', 'chicken-stir-fry']);
    });
    
    it('filters recipes by difficulty', () => {
        const filters: Filters = {
            searchQuery: '',
            ingredients: [],
            maxMinutes: null,
            difficulty: 'Easy',
            diet: 'Any',
        };
        const result = filterRecipes(mockRecipes, filters);
        expect(result.length).toBe(2);
        expect(result.map(r => r.slug)).toEqual(['spam-musubi', 'shoyu-chicken']);
    });

    it('filters recipes using multiple filters simultaneously', () => {
        const filters: Filters = {
            searchQuery: 'chicken',
            ingredients: ['soy sauce'],
            maxMinutes: null,
            difficulty: 'Easy',
            diet: 'Any',
        };
        const result = filterRecipes(mockRecipes, filters);
        expect(result.length).toBe(1);
        expect(result.map(r => r.slug)).toEqual(['shoyu-chicken']);
    });

    it('returns empty array if no recipes match filters', () => {
        const filters: Filters = {
            searchQuery: 'beef',
            ingredients: ['rice'],
            maxMinutes: 10,
            difficulty: 'Hard',
            diet: 'Vegan',
        };
        const result = filterRecipes(mockRecipes, filters);
        expect(result.length).toBe(0);
    });

    it('is case insensitive in search and ingredients', () => {
        const filters: Filters = {
            searchQuery: 'CHICKEN',
            ingredients: ['SOY SAUCE'],
            maxMinutes: null,
            difficulty: 'Any',
            diet: 'Any',
        };
        const result = filterRecipes(mockRecipes, filters);
        expect(result.length).toBe(3);
        expect(result.map(r => r.slug)).toEqual(['shoyu-chicken', 'huli-huli-chicken', 'chicken-stir-fry']);
    });
});