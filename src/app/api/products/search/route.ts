import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  image_url?: string;
  image_small_url?: string;
  categories_tags?: string[];
  brands?: string;
}

interface CatalogProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  brand: string;
}

// Map Open Food Facts categories to simpler categories
function mapCategory(categories: string[] | undefined): string {
  if (!categories || categories.length === 0) return 'Other';

  const categoryMap: Record<string, string> = {
    'en:dairy': 'Dairy',
    'en:milks': 'Dairy',
    'en:cheeses': 'Dairy',
    'en:yogurts': 'Dairy',
    'en:beverages': 'Beverages',
    'en:juices': 'Beverages',
    'en:sodas': 'Beverages',
    'en:waters': 'Beverages',
    'en:breads': 'Bakery',
    'en:pastries': 'Bakery',
    'en:cereals': 'Breakfast',
    'en:breakfast-cereals': 'Breakfast',
    'en:meats': 'Meat',
    'en:poultry': 'Meat',
    'en:seafood': 'Seafood',
    'en:fruits': 'Produce',
    'en:vegetables': 'Produce',
    'en:frozen-foods': 'Frozen',
    'en:snacks': 'Snacks',
    'en:chips': 'Snacks',
    'en:cookies': 'Snacks',
    'en:condiments': 'Condiments',
    'en:sauces': 'Condiments',
    'en:pasta': 'Pantry',
    'en:rice': 'Pantry',
    'en:canned-foods': 'Pantry',
  };

  for (const cat of categories) {
    for (const [key, value] of Object.entries(categoryMap)) {
      if (cat.includes(key.replace('en:', ''))) {
        return value;
      }
    }
  }

  return 'Other';
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const category = searchParams.get('category');

  if (!query && !category) {
    return NextResponse.json({ error: 'Query parameter "q" or "category" is required' }, { status: 400 });
  }

  try {
    // Search Open Food Facts API
    let url: string;
    if (query) {
      url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20&fields=code,product_name,image_url,image_small_url,categories_tags,brands`;
    } else {
      url = `https://world.openfoodfacts.org/category/${encodeURIComponent(category!)}.json?page_size=20&fields=code,product_name,image_url,image_small_url,categories_tags,brands`;
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FreshKeep/1.0 (contact@freshkeep.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`Open Food Facts API error: ${response.status}`);
    }

    const data = await response.json();
    const products: OpenFoodFactsProduct[] = data.products || [];

    // Transform to our format
    const catalogProducts: CatalogProduct[] = products
      .filter((p) => p.product_name && p.image_url)
      .map((p) => ({
        id: p.code,
        name: p.product_name,
        image: p.image_small_url || p.image_url || '',
        category: mapCategory(p.categories_tags),
        brand: p.brands || 'Generic',
      }));

    return NextResponse.json(catalogProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
