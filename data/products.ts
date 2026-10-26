import { Product, Category, DeliveryZone } from "@/types/product";

export const CATEGORIES: Category[] = [
  {
    "id": "pantry-grains",
    "name": "Pantry Staples & Grains",
    "icon": "wheat",
    "blurb": "Rice, pasta, semolina & noodles"
  },
  {
    "id": "breakfast-cereals",
    "name": "Breakfast & Cereals",
    "icon": "cup",
    "blurb": "Custard, cereals & malt drinks"
  },
  {
    "id": "milk-dairy",
    "name": "Milk & Dairy",
    "icon": "droplet",
    "blurb": "Powdered milk refills"
  },
  {
    "id": "beverages-drinks",
    "name": "Beverages & Drinks",
    "icon": "cup",
    "blurb": "Soft drinks, water & malt"
  },
  {
    "id": "snacks-sugar",
    "name": "Snacks, Sugar & Confectionery",
    "icon": "cookie",
    "blurb": "Biscuits, sugar & sweets"
  },
  {
    "id": "condiments-canned",
    "name": "Condiments & Canned Foods",
    "icon": "pot",
    "blurb": "Tomato paste, spreads & sardines"
  },
  {
    "id": "baby-care",
    "name": "Baby Care & Infant Nutrition",
    "icon": "baby",
    "blurb": "Diapers, formula & baby milk"
  }
];

export const PRODUCTS: Product[] = [
  {
    "id": "custard-3-in-1-refill",
    "name": "Custard 3 in 1 Refill",
    "category": "breakfast-cereals",
    "price": 3500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 23,
    "stock": 50,
    "short": "Checkers Custard",
    "description": "Powdered custard mix containing milk, sugar, and flavorings in a convenient refill pack.",
    "features": [
      "Brand: Checkers Custard",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Checkers Custard",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "custard-normal-refill",
    "name": "Custard Normal Refill",
    "category": "breakfast-cereals",
    "price": 2000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 18,
    "stock": 50,
    "short": "Checkers Custard",
    "description": "Standard powdered vanilla custard mix refill pack.",
    "features": [
      "Brand: Checkers Custard",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Checkers Custard",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "custard-3-in-1-roll",
    "name": "Custard 3 in 1 Roll",
    "category": "breakfast-cereals",
    "price": 2900,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 17,
    "stock": 50,
    "short": "Checkers Custard",
    "description": "Sachet rolls of 3-in-1 custard mix containing milk and sugar.",
    "features": [
      "Brand: Checkers Custard",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Checkers Custard",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "custard-3-in-1-cup",
    "name": "Custard 3 in 1 Cup",
    "category": "breakfast-cereals",
    "price": 7500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 23,
    "stock": 50,
    "short": "Checkers Custard",
    "description": "Premium 3-in-1 vanilla custard powder packed in a large family plastic tub/cup.",
    "features": [
      "Brand: Checkers Custard",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Checkers Custard",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "cornflakes-roll",
    "name": "Cornflakes Roll",
    "category": "breakfast-cereals",
    "price": 1500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 5,
    "stock": 50,
    "short": "Kellogg's / Nasco",
    "description": "Toasted corn flakes cereal strips packed in retail sachet rolls.",
    "features": [
      "Brand: Kellogg's / Nasco",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Kellogg's / Nasco",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "cocopops-roll",
    "name": "Cocopops Roll",
    "category": "breakfast-cereals",
    "price": 1500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 12,
    "stock": 50,
    "short": "Kellogg's",
    "description": "Chocolate flavored puffed rice cereal strips packed in retail sachet rolls.",
    "features": [
      "Brand: Kellogg's",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Kellogg's",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "milo-big-size-refill",
    "name": "Milo Big Size Refill",
    "category": "breakfast-cereals",
    "price": 9000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 12,
    "stock": 50,
    "short": "Nestlé",
    "description": "Large institutional chocolate malt beverage powder economy refill pouch (approx. 800g/1kg).",
    "features": [
      "Brand: Nestlé",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nestlé",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "milo-big-tin",
    "name": "Milo Big Tin",
    "category": "breakfast-cereals",
    "price": 22000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 17,
    "stock": 50,
    "short": "Nestlé",
    "description": "Premium large metallic tin container of chocolate malt beverage powder.",
    "features": [
      "Brand: Nestlé",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nestlé",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "milo-medium-tin",
    "name": "Milo Medium Tin",
    "category": "breakfast-cereals",
    "price": 13000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 24,
    "stock": 50,
    "short": "Nestlé",
    "description": "Medium-sized metallic tin container of chocolate malt beverage powder.",
    "features": [
      "Brand: Nestlé",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nestlé",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "milo-small-tin",
    "name": "Milo Small Tin",
    "category": "breakfast-cereals",
    "price": 7000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 14,
    "stock": 50,
    "short": "Nestlé",
    "description": "Compact small metallic tin container of chocolate malt beverage powder.",
    "features": [
      "Brand: Nestlé",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nestlé",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "milo-small-size-refill",
    "name": "Milo Small Size Refill",
    "category": "breakfast-cereals",
    "price": 4000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 8,
    "stock": 50,
    "short": "Nestlé",
    "description": "Small economy retail refill pouch of chocolate malt beverage powder.",
    "features": [
      "Brand: Nestlé",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nestlé",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "milo-sachet-roll",
    "name": "Milo Sachet Roll",
    "category": "breakfast-cereals",
    "price": 1800,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 7,
    "stock": 50,
    "short": "Nestlé",
    "description": "Strip of small single-serve sachet packs of Milo chocolate malt powder (roll of 10).",
    "features": [
      "Brand: Nestlé",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nestlé",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "bournvita-big-tin",
    "name": "Bournvita Big Tin",
    "category": "breakfast-cereals",
    "price": 11000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 20,
    "stock": 50,
    "short": "Cadbury",
    "description": "Large premium metallic canister of cocoa-based chocolate malt beverage powder.",
    "features": [
      "Brand: Cadbury",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Cadbury",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "bournvita-small-tin",
    "name": "Bournvita Small Tin",
    "category": "breakfast-cereals",
    "price": 7000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 14,
    "stock": 50,
    "short": "Cadbury",
    "description": "Small metallic canister of cocoa-based chocolate malt beverage powder.",
    "features": [
      "Brand: Cadbury",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Cadbury",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "bournvita-big-size-refill",
    "name": "Bournvita Big Size Refill",
    "category": "breakfast-cereals",
    "price": 4500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 10,
    "stock": 50,
    "short": "Cadbury",
    "description": "Large economy refill pouch of cocoa chocolate malt beverage powder.",
    "features": [
      "Brand: Cadbury",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Cadbury",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "golden-morn-big-size",
    "name": "Golden Morn Big Size",
    "category": "breakfast-cereals",
    "price": 5000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 11,
    "stock": 50,
    "short": "Nestlé",
    "description": "Large family pack of nutritious instant whole maize and soya breakfast cereal.",
    "features": [
      "Brand: Nestlé",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nestlé",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "golden-morn-medium-size",
    "name": "Golden Morn Medium Size",
    "category": "breakfast-cereals",
    "price": 3500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 17,
    "stock": 50,
    "short": "Nestlé",
    "description": "Medium economy pack of instant whole maize and soya breakfast cereal.",
    "features": [
      "Brand: Nestlé",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nestlé",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "golden-morn-small-size",
    "name": "Golden Morn Small Size",
    "category": "breakfast-cereals",
    "price": 2500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 5,
    "stock": 50,
    "short": "Nestlé",
    "description": "Small retail pack of instant whole maize and soya breakfast cereal.",
    "features": [
      "Brand: Nestlé",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nestlé",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "golden-morn-roll",
    "name": "Golden Morn Roll",
    "category": "breakfast-cereals",
    "price": 2800,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 23,
    "stock": 50,
    "short": "Nestlé",
    "description": "Strip of single-serve retail sachet packs of maize cereal.",
    "features": [
      "Brand: Nestlé",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nestlé",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "amazing-day-cereal-refill",
    "name": "Amazing Day Cereal Refill",
    "category": "breakfast-cereals",
    "price": 2700,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 24,
    "stock": 50,
    "short": "Kellogg's Tolaram",
    "description": "Nutritious instant multi-grain breakfast cereal in an economy refill pack.",
    "features": [
      "Brand: Kellogg's Tolaram",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Kellogg's Tolaram",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "amazing-day-cereal-roll",
    "name": "Amazing Day Cereal Roll",
    "category": "breakfast-cereals",
    "price": 2400,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 22,
    "stock": 50,
    "short": "Kellogg's Tolaram",
    "description": "Single-use retail sachet rolls of multi-grain breakfast cereal.",
    "features": [
      "Brand: Kellogg's Tolaram",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Kellogg's Tolaram",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "peak-full-cream-milk-powder-refill",
    "name": "Peak Full Cream Milk Powder Refill",
    "category": "milk-dairy",
    "price": 5000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 21,
    "stock": 50,
    "short": "FrieslandCampina Peak",
    "description": "Premium instant whole milk powder in a large value-sized economy refill pack.",
    "features": [
      "Brand: FrieslandCampina Peak",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "FrieslandCampina Peak",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "peak-refill-big-size-groceries-section",
    "name": "Peak Refill Big Size (Groceries section)",
    "category": "milk-dairy",
    "price": 10500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 18,
    "stock": 50,
    "short": "FrieslandCampina Peak",
    "description": "Institutional-sized extra large full cream milk powder economy refill bag.",
    "features": [
      "Brand: FrieslandCampina Peak",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "FrieslandCampina Peak",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "dano-slim-full-cream-milk-refill",
    "name": "Dano Slim / Full Cream Milk Refill",
    "category": "milk-dairy",
    "price": 3000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 13,
    "stock": 50,
    "short": "Arla Dano",
    "description": "High-quality rich instant milk powder formula refill pouch.",
    "features": [
      "Brand: Arla Dano",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Arla Dano",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "loyal-milk-powder-refill",
    "name": "Loyal Milk Powder Refill",
    "category": "milk-dairy",
    "price": 4500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 9,
    "stock": 50,
    "short": "Promasidor Loyal",
    "description": "Affordable formulation powdered milk product in an economy refill pouch.",
    "features": [
      "Brand: Promasidor Loyal",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Promasidor Loyal",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "peak-123-growing-up-milk-refill",
    "name": "Peak 123 Growing Up Milk Refill",
    "category": "baby-care",
    "price": 7000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 16,
    "stock": 50,
    "short": "FrieslandCampina Peak",
    "description": "Formulated powder milk specialized for young toddlers aged 1 to 3 years.",
    "features": [
      "Brand: FrieslandCampina Peak",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "FrieslandCampina Peak",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "nan-1-infant-formula",
    "name": "Nan 1 Infant Formula",
    "category": "baby-care",
    "price": 12500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 5,
    "stock": 50,
    "short": "Nestlé NAN",
    "description": "Premium starter infant formula powder intended for babies from birth up to 6 months.",
    "features": [
      "Brand: Nestlé NAN",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nestlé NAN",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "nan-2-follow-up-formula",
    "name": "Nan 2 Follow-up Formula",
    "category": "baby-care",
    "price": 12000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 19,
    "stock": 50,
    "short": "Nestlé NAN",
    "description": "Premium follow-up infant formula powder developed for babies aged 6 to 12 months.",
    "features": [
      "Brand: Nestlé NAN",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nestlé NAN",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "kisskids-diapers-big-size",
    "name": "Kisskids Diapers Big Size",
    "category": "baby-care",
    "price": 12000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 18,
    "stock": 50,
    "short": "Kisskids",
    "description": "Bulk/Jumbo pack of highly absorbent disposable baby diapers in a large size option.",
    "features": [
      "Brand: Kisskids",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Kisskids",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "kisskids-diapers-medium-size",
    "name": "Kisskids Diapers Medium Size",
    "category": "baby-care",
    "price": 6500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 17,
    "stock": 50,
    "short": "Kisskids",
    "description": "Standard medium pack of highly absorbent disposable baby diapers.",
    "features": [
      "Brand: Kisskids",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Kisskids",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "kisskids-diapers-small-size",
    "name": "Kisskids Diapers Small Size",
    "category": "baby-care",
    "price": 1500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 14,
    "stock": 50,
    "short": "Kisskids",
    "description": "Mini starter convenience pack of disposable baby diapers.",
    "features": [
      "Brand: Kisskids",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Kisskids",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "softcare-diapers-big-size",
    "name": "Softcare Diapers Big Size",
    "category": "baby-care",
    "price": 12000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 10,
    "stock": 50,
    "short": "Softcare",
    "description": "Premium elastic waistband dry-layer disposable baby diapers, large pack.",
    "features": [
      "Brand: Softcare",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Softcare",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "softcare-diapers-medium-size",
    "name": "Softcare Diapers Medium Size",
    "category": "baby-care",
    "price": 6500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 11,
    "stock": 50,
    "short": "Softcare",
    "description": "Premium elastic waistband dry-layer disposable baby diapers, medium pack.",
    "features": [
      "Brand: Softcare",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Softcare",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "softcare-diapers-small-size",
    "name": "Softcare Diapers Small Size",
    "category": "baby-care",
    "price": 1500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 13,
    "stock": 50,
    "short": "Softcare",
    "description": "Convenience budget mini pack of dry-layer disposable baby diapers.",
    "features": [
      "Brand: Softcare",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Softcare",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "good-fit-diapers-big-size",
    "name": "Good Fit Diapers Big Size",
    "category": "baby-care",
    "price": 10500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 16,
    "stock": 50,
    "short": "Good Fit",
    "description": "High-absorbency leakage protection baby diapers, economy large pack.",
    "features": [
      "Brand: Good Fit",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Good Fit",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "good-fit-diapers-medium-size",
    "name": "Good Fit Diapers Medium Size",
    "category": "baby-care",
    "price": 5500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 19,
    "stock": 50,
    "short": "Good Fit",
    "description": "Leakage protection baby diapers, mid-range size pack.",
    "features": [
      "Brand: Good Fit",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Good Fit",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "good-fit-diapers-small-size",
    "name": "Good Fit Diapers Small Size",
    "category": "baby-care",
    "price": 1200,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 23,
    "stock": 50,
    "short": "Good Fit",
    "description": "Budget single-use or small convenience count pack of diapers.",
    "features": [
      "Brand: Good Fit",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Good Fit",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "maya-diapers-big-size",
    "name": "Maya Diapers Big Size",
    "category": "baby-care",
    "price": 9000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 19,
    "stock": 50,
    "short": "Maya",
    "description": "Comfort-fit anti-rash tech disposable baby diapers, large size option.",
    "features": [
      "Brand: Maya",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Maya",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "maya-diapers-medium-size",
    "name": "Maya Diapers Medium Size",
    "category": "baby-care",
    "price": 6000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 23,
    "stock": 50,
    "short": "Maya",
    "description": "Comfort-fit anti-rash tech disposable baby diapers, mid-range size pack.",
    "features": [
      "Brand: Maya",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Maya",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "my-choice-rice-wholesale-bag",
    "name": "My Choice Rice Wholesale Bag",
    "category": "pantry-grains",
    "price": 66000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 10,
    "stock": 50,
    "short": "My Choice",
    "description": "Commercial bulk commercial bag of parboiled long grain rice (typically 50kg).",
    "features": [
      "Brand: My Choice",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "My Choice",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "spaghetti-slim-and-big",
    "name": "Spaghetti Slim & Big",
    "category": "pantry-grains",
    "price": 1200,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 14,
    "stock": 50,
    "short": "Golden Penny",
    "description": "Long thin pasta strands made from durum wheat semolina, standard pack.",
    "features": [
      "Brand: Golden Penny",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Golden Penny",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "macaroni-big-size",
    "name": "Macaroni Big Size",
    "category": "pantry-grains",
    "price": 1200,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 22,
    "stock": 50,
    "short": "Golden Penny",
    "description": "Elbow pasta pieces made from premium durum semolina, large retail pack.",
    "features": [
      "Brand: Golden Penny",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Golden Penny",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "macaroni-small-size",
    "name": "Macaroni Small Size",
    "category": "pantry-grains",
    "price": 700,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 19,
    "stock": 50,
    "short": "Golden Penny",
    "description": "Elbow pasta pieces, compact single/double meal consumer pack.",
    "features": [
      "Brand: Golden Penny",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Golden Penny",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "semolina-500g",
    "name": "Semolina 500g",
    "category": "pantry-grains",
    "price": 1000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 19,
    "stock": 50,
    "short": "Golden Penny Semovita",
    "description": "Compact 500g retail pouch of whole wheat flour semolina.",
    "features": [
      "Brand: Golden Penny Semovita",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Golden Penny Semovita",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "semolina-1kg",
    "name": "Semolina 1kg",
    "category": "pantry-grains",
    "price": 1700,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 18,
    "stock": 50,
    "short": "Golden Penny Semovita",
    "description": "Standard 1kg convenience retail bag of premium semolina flour.",
    "features": [
      "Brand: Golden Penny Semovita",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Golden Penny Semovita",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "super-pack-indomie-carton",
    "name": "Super Pack Indomie Carton",
    "category": "pantry-grains",
    "price": 15500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 20,
    "stock": 50,
    "short": "Dufil Prima Indomie",
    "description": "Carton of extra-large portion instant noodles in classic chicken flavor.",
    "features": [
      "Brand: Dufil Prima Indomie",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Dufil Prima Indomie",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "indomie-table-size-carton",
    "name": "Indomie Table Size Carton",
    "category": "pantry-grains",
    "price": 9700,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 12,
    "stock": 50,
    "short": "Dufil Prima Indomie",
    "description": "Carton of standard individual regular portion size instant noodles.",
    "features": [
      "Brand: Dufil Prima Indomie",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Dufil Prima Indomie",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "indomie-onion-flavor-carton",
    "name": "Indomie Onion Flavor Carton",
    "category": "pantry-grains",
    "price": 11000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 18,
    "stock": 50,
    "short": "Dufil Prima Indomie",
    "description": "Carton of savory onion flavored aromatic instant noodles.",
    "features": [
      "Brand: Dufil Prima Indomie",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Dufil Prima Indomie",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "oriental-fried-noodles-carton",
    "name": "Oriental Fried Noodles Carton",
    "category": "pantry-grains",
    "price": 10000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 24,
    "stock": 50,
    "short": "Dufil Prima Indomie",
    "description": "Carton of spice-rich oriental blend instant stir-fry style noodles.",
    "features": [
      "Brand: Dufil Prima Indomie",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Dufil Prima Indomie",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "miemie-instant-noodles-carton",
    "name": "Miemie Instant Noodles Carton",
    "category": "pantry-grains",
    "price": 8500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 6,
    "stock": 50,
    "short": "Miemie Noodles",
    "description": "Competitor value brand instant noodles, whole carton wholesale pricing.",
    "features": [
      "Brand: Miemie Noodles",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Miemie Noodles",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "bellefull-indomie-carton",
    "name": "Bellefull Indomie Carton",
    "category": "pantry-grains",
    "price": 15000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 5,
    "stock": 50,
    "short": "Dufil Bellefull",
    "description": "Carton of maximum heavy-weight jumbo portion size instant noodles.",
    "features": [
      "Brand: Dufil Bellefull",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Dufil Bellefull",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "coca-cola-plastic-pack",
    "name": "Coca-Cola Plastic Pack",
    "category": "beverages-drinks",
    "price": 4500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 8,
    "stock": 50,
    "short": "Coca-Cola",
    "description": "Shrink-wrapped wholesale bundle case of plastic carbonated soft drink bottles.",
    "features": [
      "Brand: Coca-Cola",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Coca-Cola",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "american-cola-pack",
    "name": "American Cola Pack",
    "category": "beverages-drinks",
    "price": 4000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 11,
    "stock": 50,
    "short": "American Cola",
    "description": "Value competitor brand carbonated cola bottles shrink wholesale case.",
    "features": [
      "Brand: American Cola",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "American Cola",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "pepsi-plastic-pack",
    "name": "Pepsi Plastic Pack",
    "category": "beverages-drinks",
    "price": 4500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 8,
    "stock": 50,
    "short": "Pepsi",
    "description": "Shrink-wrapped bundle case of refreshing carbonated cola PET bottles.",
    "features": [
      "Brand: Pepsi",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Pepsi",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "fanta-orange-plastic-pack",
    "name": "Fanta Orange Plastic Pack",
    "category": "beverages-drinks",
    "price": 4700,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 5,
    "stock": 50,
    "short": "Fanta",
    "description": "Shrink-wrapped bundle case of fruity orange carbonated beverage PET bottles.",
    "features": [
      "Brand: Fanta",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Fanta",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "maltina-plastic-bottle-pack",
    "name": "Maltina Plastic Bottle Pack",
    "category": "beverages-drinks",
    "price": 6000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 8,
    "stock": 50,
    "short": "Nigerian Breweries Maltina",
    "description": "Wholesale case bundle of premium non-alcoholic malt drinks in plastic bottles.",
    "features": [
      "Brand: Nigerian Breweries Maltina",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nigerian Breweries Maltina",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "maltina-big-plastic-pack",
    "name": "Maltina Big Plastic Pack",
    "category": "beverages-drinks",
    "price": 9500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 6,
    "stock": 50,
    "short": "Nigerian Breweries Maltina",
    "description": "Wholesale case bundle of non-alcoholic malt drinks in extra-large plastic bottles.",
    "features": [
      "Brand: Nigerian Breweries Maltina",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Nigerian Breweries Maltina",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "cway-water-pack-dispenser",
    "name": "Cway Water Pack / Dispenser",
    "category": "beverages-drinks",
    "price": 2000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 13,
    "stock": 50,
    "short": "Cway",
    "description": "Bundle pack of clean purified bottled drinking water or dispenser refill.",
    "features": [
      "Brand: Cway",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Cway",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "mr-v-purified-water-pack",
    "name": "Mr. V Purified Water Pack",
    "category": "beverages-drinks",
    "price": 1900,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 14,
    "stock": 50,
    "short": "Mr. V",
    "description": "Case pack of standard filtered treated bottled drinking water.",
    "features": [
      "Brand: Mr. V",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Mr. V",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "eva-water-big-size-pack",
    "name": "Eva Water Big Size Pack",
    "category": "beverages-drinks",
    "price": 4500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 11,
    "stock": 50,
    "short": "Coca-Cola NBC Eva",
    "description": "Premium purified distilled bottled table water, bundle case of large bottles.",
    "features": [
      "Brand: Coca-Cola NBC Eva",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Coca-Cola NBC Eva",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "eva-water-small-size-pack",
    "name": "Eva Water Small Size Pack",
    "category": "beverages-drinks",
    "price": 3500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 10,
    "stock": 50,
    "short": "Coca-Cola NBC Eva",
    "description": "Premium purified distilled bottled table water, bundle case of personal size bottles.",
    "features": [
      "Brand: Coca-Cola NBC Eva",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Coca-Cola NBC Eva",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "aquafina-water-pack",
    "name": "Aquafina Water Pack",
    "category": "beverages-drinks",
    "price": 3000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 12,
    "stock": 50,
    "short": "Varun Aquafina",
    "description": "Premium filtered refreshing clear table water, wholesale shrink pack case.",
    "features": [
      "Brand: Varun Aquafina",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Varun Aquafina",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "gino-tomato-party-jollof-paste",
    "name": "Gino Tomato Party Jollof Paste",
    "category": "condiments-canned",
    "price": 1100,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 15,
    "stock": 50,
    "short": "GB Foods Gino",
    "description": "Concentrated tomato paste pre-spiced with local party jollof seasoning blends.",
    "features": [
      "Brand: GB Foods Gino",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "GB Foods Gino",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "gino-pepper-and-onion-paste",
    "name": "Gino Pepper and Onion Paste",
    "category": "condiments-canned",
    "price": 1100,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 15,
    "stock": 50,
    "short": "GB Foods Gino",
    "description": "Concentrated tomato paste infused with ground habanero peppers and onions.",
    "features": [
      "Brand: GB Foods Gino",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "GB Foods Gino",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "sonia-tomato-paste-big-tin",
    "name": "Sonia Tomato Paste Big Tin",
    "category": "condiments-canned",
    "price": 3000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 5,
    "stock": 50,
    "short": "Sonia Tomato",
    "description": "Large size premium metal tin of highly concentrated double-refined tomato paste.",
    "features": [
      "Brand: Sonia Tomato",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Sonia Tomato",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "sonia-tomato-paste-medium-tin",
    "name": "Sonia Tomato Paste Medium Tin",
    "category": "condiments-canned",
    "price": 1500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 10,
    "stock": 50,
    "short": "Sonia Tomato",
    "description": "Medium size metal tin of rich double-refined concentrated tomato paste.",
    "features": [
      "Brand: Sonia Tomato",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Sonia Tomato",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "sonia-tomato-paste-small-tin",
    "name": "Sonia Tomato Paste Small Tin",
    "category": "condiments-canned",
    "price": 1000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 23,
    "stock": 50,
    "short": "Sonia Tomato",
    "description": "Compact small metal tin of double-refined tomato paste for light meals.",
    "features": [
      "Brand: Sonia Tomato",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Sonia Tomato",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "sonia-tomato-paste-smallest-tin",
    "name": "Sonia Tomato Paste Smallest Tin",
    "category": "condiments-canned",
    "price": 200,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 24,
    "stock": 50,
    "short": "Sonia Tomato",
    "description": "Mini pocket size convenience small tin of concentrated tomato paste.",
    "features": [
      "Brand: Sonia Tomato",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Sonia Tomato",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "golden-penny-butter-big-size",
    "name": "Golden Penny Butter Big Size",
    "category": "condiments-canned",
    "price": 2800,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 15,
    "stock": 50,
    "short": "Golden Penny",
    "description": "Large tub premium cooking/baking table butter spread margarine.",
    "features": [
      "Brand: Golden Penny",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Golden Penny",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "golden-penny-butter-medium-size",
    "name": "Golden Penny Butter Medium Size",
    "category": "condiments-canned",
    "price": 1300,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 6,
    "stock": 50,
    "short": "Golden Penny",
    "description": "Medium tub cooking/baking table butter spread margarine.",
    "features": [
      "Brand: Golden Penny",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Golden Penny",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "blue-band-margarine-big-size",
    "name": "Blue Band Margarine Big Size",
    "category": "condiments-canned",
    "price": 4000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 10,
    "stock": 50,
    "short": "Upfield Blue Band",
    "description": "Classic rich spread catering/family sized tub of premium margarine.",
    "features": [
      "Brand: Upfield Blue Band",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Upfield Blue Band",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "bama-mayonnaise-big-size",
    "name": "Bama Mayonnaise Big Size",
    "category": "condiments-canned",
    "price": 4500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 18,
    "stock": 50,
    "short": "Bama",
    "description": "Large glass jar premium rich creamy sandwich spread mayonnaise.",
    "features": [
      "Brand: Bama",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Bama",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "bama-mayonnaise-medium-size",
    "name": "Bama Mayonnaise Medium Size",
    "category": "condiments-canned",
    "price": 3500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 10,
    "stock": 50,
    "short": "Bama",
    "description": "Medium glass jar premium rich creamy mayonnaise spread.",
    "features": [
      "Brand: Bama",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Bama",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "bama-mayonnaise-small-size",
    "name": "Bama Mayonnaise Small Size",
    "category": "condiments-canned",
    "price": 2000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 21,
    "stock": 50,
    "short": "Bama",
    "description": "Small glass jar rich creamy sandwich mayonnaise spread.",
    "features": [
      "Brand: Bama",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Bama",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "titus-sardines-can",
    "name": "Titus Sardines Can",
    "category": "condiments-canned",
    "price": 2000,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 15,
    "stock": 50,
    "short": "Titus",
    "description": "Premium canned Atlantic sardines preserved in pure vegetable oil.",
    "features": [
      "Brand: Titus",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Titus",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "sardines-can-alternative",
    "name": "Sardines Can Alternative",
    "category": "condiments-canned",
    "price": 4500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 7,
    "stock": 50,
    "short": "Generic",
    "description": "Canned oil-preserved fish sardines alternative brands.",
    "features": [
      "Brand: Generic",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Generic",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "golden-penny-sugar-refill-pouch",
    "name": "Golden Penny Sugar Refill Pouch",
    "category": "snacks-sugar",
    "price": 1500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 9,
    "stock": 50,
    "short": "Golden Penny",
    "description": "Premium refined fine granulated white sugar refill packaging.",
    "features": [
      "Brand: Golden Penny",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "Golden Penny",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  },
  {
    "id": "st-louis-sugar-cube-box",
    "name": "St. Louis Sugar Cube Box",
    "category": "snacks-sugar",
    "price": 2500,
    "size": "Each",
    "image": "/images/product-placeholder.svg",
    "rating": 4.8,
    "reviewCount": 5,
    "stock": 50,
    "short": "St. Louis",
    "description": "Classic premium white hard pressed sugar cubes, traditional package.",
    "features": [
      "Brand: St. Louis",
      "Pack: Each"
    ],
    "specs": {
      "Brand": "St. Louis",
      "Size": "Each",
      "Quality": "Sealed Original Pack"
    }
  }
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    "id": "island",
    "name": "Lagos Island & Victoria Island",
    "fee": 1500,
    "eta": "Same day",
    "coverage": "Ikoyi, VI, Lekki Phase 1"
  },
  {
    "id": "mainland",
    "name": "Lagos Mainland",
    "fee": 2000,
    "eta": "Same day",
    "coverage": "Ikeja, Yaba, Surulere, Maryland"
  },
  {
    "id": "outskirts",
    "name": "Lagos Outskirts",
    "fee": 3000,
    "eta": "1–2 days",
    "coverage": "Ikorodu, Badagry, Epe, Ajah"
  },
  {
    "id": "abuja",
    "name": "Abuja (FCT)",
    "fee": 4500,
    "eta": "2–3 days",
    "coverage": "Wuse, Garki, Maitama, Gwarinpa"
  },
  {
    "id": "ph",
    "name": "Port Harcourt & Rivers",
    "fee": 5000,
    "eta": "2–3 days",
    "coverage": "GRA, Old Port Harcourt"
  },
  {
    "id": "other",
    "name": "Other States (Nationwide)",
    "fee": 6000,
    "eta": "3–5 days",
    "coverage": "Nationwide express delivery"
  },
  {
    "id": "pickup",
    "name": "Pickup at Lagos Store",
    "fee": 0,
    "eta": "Ready in 2 hours",
    "coverage": "Ladydee Minimart Store, Lagos"
  }
];
