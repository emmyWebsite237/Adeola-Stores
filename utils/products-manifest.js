// /utils/products-manifest.js
// Master catalogue manifest (ledger items). Image files live under /assets/products/.
// Categories use the same title-case labels as the rest of the site.

export const groceryCatalogManifest = [
  // ---------- CUSTARD, DAIRY & PAPS ----------
  { id: "cust_3in1_refill",   category: "Groceries", name: "Custard Refill 3 in 1",  price: 3500,  localAssetPath: "/assets/products/custard-3in1-refill.jpg" },
  { id: "cust_normal_refill", category: "Groceries", name: "Custard Refill Normal",  price: 2000,  localAssetPath: "/assets/products/custard-normal-refill.jpg" },
  { id: "cust_3in1_roll",     category: "Groceries", name: "Custard 3 in 1 Roll",    price: 2900,  localAssetPath: "/assets/products/custard-3in1-roll.jpg" },
  { id: "dano_refill_std",    category: "Groceries", name: "Dano Milk Refill",       price: 3000,  localAssetPath: "/assets/products/dano-milk-refill.jpg" },
  { id: "loyal_refill_std",   category: "Groceries", name: "Loyal Milk Refill",      price: 4500,  localAssetPath: "/assets/products/loyal-milk-refill.jpg" },
  { id: "peak_refill_std",    category: "Groceries", name: "Peak Milk Refill",       price: 5000,  localAssetPath: "/assets/products/peak-milk-refill.jpg" },
  { id: "cornflakes_roll_std",category: "Groceries", name: "Cornflakes Roll",        price: 1500,  localAssetPath: "/assets/products/cornflakes-roll.jpg" },
  { id: "cocopops_roll_std",  category: "Groceries", name: "Cocopops Roll",          price: 1500,  localAssetPath: "/assets/products/cocopops-roll.jpg" },
  { id: "peak_123_refill",    category: "Groceries", name: "Peak 123 Milk Refill",   price: 7000,  localAssetPath: "/assets/products/peak-123-refill.jpg" },
  { id: "nan_1_formula",      category: "Groceries", name: "Nan 1 Baby Formula",     price: 12500, localAssetPath: "/assets/products/nan-1.jpg" },
  { id: "nan_2_formula",      category: "Groceries", name: "Nan 2 Baby Formula",     price: 12000, localAssetPath: "/assets/products/nan-2.jpg" },

  // ---------- BABY DIAPERS ----------
  { id: "diaper_kiddies_l",   category: "Baby Diapers", name: "Kiddies Diapers Big Size",     price: 12000, localAssetPath: "/assets/products/kiddies-big.jpg" },
  { id: "diaper_kiddies_m",   category: "Baby Diapers", name: "Kiddies Diapers Medium Size",  price: 11000, localAssetPath: "/assets/products/kiddies-medium.jpg" },
  { id: "diaper_kiddies_s",   category: "Baby Diapers", name: "Kiddies Diapers Small Size",   price: 9500,  localAssetPath: "/assets/products/kiddies-small.jpg" },
  { id: "diaper_softcare_l",  category: "Baby Diapers", name: "Softcare Diapers Big Size",    price: 12000, localAssetPath: "/assets/products/softcare-big.jpg" },
  { id: "diaper_softcare_m",  category: "Baby Diapers", name: "Softcare Diapers Medium Size", price: 10500, localAssetPath: "/assets/products/softcare-medium.jpg" },
  { id: "diaper_softcare_s",  category: "Baby Diapers", name: "Softcare Diapers Small Size",  price: 9000,  localAssetPath: "/assets/products/softcare-small.jpg" },
  { id: "diaper_goodfit_l",   category: "Baby Diapers", name: "Good Fit Diapers Big Size",    price: 11500, localAssetPath: "/assets/products/goodfit-big.jpg" },
  { id: "diaper_goodfit_m",   category: "Baby Diapers", name: "Good Fit Diapers Medium Size", price: 10500, localAssetPath: "/assets/products/goodfit-medium.jpg" },
  { id: "diaper_goodfit_s",   category: "Baby Diapers", name: "Good Fit Diapers Small Size",  price: 11000, localAssetPath: "/assets/products/goodfit-small.jpg" },
  { id: "diaper_molfix_l",    category: "Baby Diapers", name: "Molfix Diapers Big Size",      price: 14500, localAssetPath: "/assets/products/molfix-big.jpg" },

  // ---------- FOOD STUFFS & BULK GRAINS ----------
  { id: "fs_mychoice_5kg",    category: "Food Stuffs", name: "My Choice Rice 5kg",          price: 14000, localAssetPath: "/assets/products/mychoice-5kg.jpg" },
  { id: "fs_spag_bag",        category: "Food Stuffs", name: "Spaghetti Slim Bag",          price: 12500, localAssetPath: "/assets/products/spaghetti-bag.jpg" },
  { id: "fs_macaroni_big",    category: "Food Stuffs", name: "Macaroni Big Size",           price: 12500, localAssetPath: "/assets/products/macaroni-big.jpg" },
  { id: "fs_macaroni_small",  category: "Food Stuffs", name: "Macaroni Small Size",         price: 1100,  localAssetPath: "/assets/products/macaroni-small.jpg" },
  { id: "fs_indomie_super",   category: "Food Stuffs", name: "Super Pack Indomie Case",     price: 15500, localAssetPath: "/assets/products/indomie-super-pack.jpg" },
  { id: "fs_indomie_table",   category: "Food Stuffs", name: "Indomie Table Case",          price: 11500, localAssetPath: "/assets/products/indomie-table.jpg" },
  { id: "fs_indomie_onion",   category: "Food Stuffs", name: "Indomie Onion Flavor Case",   price: 11500, localAssetPath: "/assets/products/indomie-onion.jpg" },
  { id: "fs_soyin_big",       category: "Food Stuffs", name: "Soyin Big Size",              price: 3000,  localAssetPath: "/assets/products/soyin-big.jpg" },
  { id: "fs_soyin_medium",    category: "Food Stuffs", name: "Soyin Medium Size",           price: 1500,  localAssetPath: "/assets/products/soyin-medium.jpg" },
  { id: "fs_soyin_small",     category: "Food Stuffs", name: "Soyin Small Size",            price: 1000,  localAssetPath: "/assets/products/soyin-small.jpg" },

  // ---------- DRINKS & PACKS ----------
  { id: "drink_coca_cola",          category: "Drinks", name: "Coca-Cola Pack",           price: 4500, localAssetPath: "/assets/products/coca-cola-pack.jpg" },
  { id: "drink_american_cola",      category: "Drinks", name: "American Cola Pack",       price: 4000, localAssetPath: "/assets/products/american-cola.jpg" },
  { id: "drink_pepsi_pack",         category: "Drinks", name: "Pepsi Pack",               price: 4500, localAssetPath: "/assets/products/pepsi-pack.jpg" },
  { id: "drink_fanta_pack",         category: "Drinks", name: "Fanta Pack",               price: 4700, localAssetPath: "/assets/products/fanta-pack.jpg" },
  { id: "drink_maltina_plastic",    category: "Drinks", name: "Maltina Plastic Pack",     price: 6000, localAssetPath: "/assets/products/maltina-plastic.jpg" },
  { id: "drink_maltina_big_plastic",category: "Drinks", name: "Maltina Big Plastic Pack", price: 9500, localAssetPath: "/assets/products/maltina-big-plastic.jpg" },
  { id: "drink_cway_water",         category: "Drinks", name: "Cway Water Bottle",        price: 2000, localAssetPath: "/assets/products/cway-water.jpg" },
  { id: "drink_mr_v_juice",         category: "Drinks", name: "Mr V Juice",               price: 1900, localAssetPath: "/assets/products/mr-v-juice.jpg" },
  { id: "drink_eva_water_big",      category: "Drinks", name: "Eva Water Big Size",       price: 4500, localAssetPath: "/assets/products/eva-water-big.jpg" },
  { id: "drink_eva_water_small",    category: "Drinks", name: "Eva Water Small Size",     price: 3500, localAssetPath: "/assets/products/eva-water-small.jpg" },
  { id: "drink_aquafina_water",     category: "Drinks", name: "Aquafina Water",           price: 3000, localAssetPath: "/assets/products/aquafina-water.jpg" },

  // ---------- PREMIUM PANTRY BEVERAGES ----------
  { id: "bev_milo_can_lg",    category: "Groceries", name: "Milo Big Size (Can)",           price: 21000, localAssetPath: "/assets/products/milo-can-large.jpg" },
  { id: "bev_milo_tin_std",   category: "Groceries", name: "Milo Tin Standard",             price: 22000, localAssetPath: "/assets/products/milo-tin.jpg" },
  { id: "bev_milo_can_md",    category: "Groceries", name: "Milo Medium Can",               price: 15000, localAssetPath: "/assets/products/milo-can-medium.jpg" },
  { id: "bev_milo_tin_sm",    category: "Groceries", name: "Milo Small Tin",                price: 7800,  localAssetPath: "/assets/products/milo-tin-small.jpg" },
  { id: "bev_bournvita_lg",   category: "Groceries", name: "Bournvita Big Tin",             price: 11800, localAssetPath: "/assets/products/bournvita-large.jpg" },
  { id: "bev_bournvita_sm",   category: "Groceries", name: "Bournvita Small Tin",           price: 1000,  localAssetPath: "/assets/products/bournvita-small.jpg" },
  { id: "bev_gp_butter_lg",   category: "Groceries", name: "Golden Penny Butter Big Size",  price: 2800,  localAssetPath: "/assets/products/gp-butter-large.jpg" },
  { id: "bev_gp_butter_md",   category: "Groceries", name: "Golden Penny Butter Medium",    price: 1500,  localAssetPath: "/assets/products/gp-butter-medium.jpg" }
];

// Backwards-compatible alias for the previous export name.
export const expandedGroceryInventory = groceryCatalogManifest;
