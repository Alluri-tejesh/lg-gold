import { Recipe } from '../types';

export const RECIPE_CATEGORIES = [
  'All',
  'Quick & Easy',
  'Everyday Meals',
  'Biryani',
  'South Indian',
  'Lunch',
  'Dinner',
  'Traditional',
  'Vegetarian'
];

export const RECIPES: Recipe[] = [
  {
    id: 'hmt-rice-biryani',
    slug: 'hmt-rice-biryani',
    title: 'Hyderabadi Dum Vegetable Biryani',
    shortDescription: 'Fragrant, slow-cooked layers of saffron-infused LG Gold HMT Rice and spiced seasonal vegetables.',
    fullDescription: 'Experience the royal flavors of Hyderabad prepared with the pristine, elongated grains of LG Gold HMT Rice. Naturally aged for over a year, each grain cooks separate and fluffy, trapping the rich steam of saffron, fried onions, mint, and whole aromatic spices during the traditional Dum sealing method.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=85',
    prepTimeMinutes: 25,
    cookTimeMinutes: 35,
    totalTimeMinutes: 60,
    servings: 4,
    difficulty: 'Medium',
    categories: ['Biryani', 'Dinner', 'Special Occasions', 'Traditional', 'Vegetarian'],
    recommendedProductId: 'lg-gold-hmt-rice',
    recommendedPackSize: '26kg Bag',
    cuisine: 'Hyderabadi / South Indian',
    nutritionPerServing: '385 kcal, 9g Protein, 68g Carbs',
    chefTips: [
      'Par-cook the LG Gold HMT Rice to 75% doneness before layering for the ultimate grain separation.',
      'Seal the heavy-bottomed pot with dough or aluminum foil to trap every bit of aromatic steam.'
    ],
    ingredients: [
      { item: 'LG Gold HMT Rice', amount: '2 cups (washed and soaked for 20 mins)', isLGGoldRice: true },
      { item: 'Mixed Vegetables (Carrots, Beans, Peas, Potatoes)', amount: '2.5 cups diced' },
      { item: 'Thick Curd / Yogurt', amount: '1/2 cup whisked' },
      { item: 'Fried Onions (Birista)', amount: '1 cup crispy golden' },
      { item: 'Saffron strands dissolved in warm milk', amount: '2 tbsp milk + 12 strands' },
      { item: 'Fresh Mint & Coriander leaves', amount: '1 cup finely chopped' },
      { item: 'Whole Spices (Cardamom, Cloves, Cinnamon, Star Anise, Bay Leaf)', amount: '1 standard mix' },
      { item: 'Pure Cow Ghee', amount: '3 tbsp' },
      { item: 'Ginger-Garlic Paste & Biryani Masala', amount: '1.5 tbsp each' }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: 'Rinse LG Gold HMT Rice gently until water runs clear. Soak in clean water for 20 minutes.',
        tip: 'Gentle handling prevents grain breakage and preserves the long slender grain shape.'
      },
      {
        stepNumber: 2,
        instruction: 'Bring 6 cups of water to a rolling boil with whole spices, 1 tsp oil, and salt. Add drained rice and cook until 70-75% done (around 5 to 6 minutes). Drain completely and set aside.',
      },
      {
        stepNumber: 3,
        instruction: 'In a heavy pot, heat ghee and oil. Sauté ginger-garlic paste and diced vegetables with curd, turmeric, chili powder, and biryani masala until aromatic (7-8 minutes).',
      },
      {
        stepNumber: 4,
        instruction: 'Layer the par-cooked LG Gold HMT Rice evenly over the spiced vegetable base. Top with fried onions, chopped mint, coriander, saffron milk, and a drizzle of ghee.',
      },
      {
        stepNumber: 5,
        instruction: 'Cover with a tight lid. Cook on low heat (dum) for 15-18 minutes until rice is fully tender and fragrant. Let rest 5 minutes before gently serving with raita.',
      }
    ],
    featured: true
  },
  {
    id: 'lemon-rice',
    slug: 'lemon-rice',
    title: 'Classic South Indian Lemon Rice (Chitranna)',
    shortDescription: 'Zesty, turmeric-tinted rice tempered with crunchy peanuts, mustard seeds, curry leaves, and fresh lime.',
    fullDescription: 'The quintessential South Indian comfort meal. LG Gold HMT Rice is steamed to delicate perfection, cooled slightly so each grain remains distinct, and tossed with fresh lemon juice, golden roasted peanuts, chana dal, curry leaves, and spicy green chilies.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=85',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    servings: 4,
    difficulty: 'Easy',
    categories: ['Quick & Easy', 'Everyday Meals', 'South Indian', 'Lunch', 'Breakfast', 'Vegetarian'],
    recommendedProductId: 'lg-gold-hmt-rice',
    recommendedPackSize: '26kg Bag',
    cuisine: 'South Indian / Karnataka & Andhra Style',
    nutritionPerServing: '290 kcal, 6g Protein, 52g Carbs',
    chefTips: [
      'Always cool the cooked LG Gold Rice on a wide plate with 1 tsp sesame oil before tempering.',
      'Add freshly squeezed lemon juice after taking the pan off heat to retain bright citrus flavor.'
    ],
    ingredients: [
      { item: 'LG Gold HMT Rice', amount: '1.5 cups (cooked and cooled)', isLGGoldRice: true },
      { item: 'Fresh Lemon Juice', amount: '3 to 4 tbsp' },
      { item: 'Raw Peanuts', amount: '3 tbsp' },
      { item: 'Mustard Seeds & Urad Dal & Chana Dal', amount: '1 tsp each' },
      { item: 'Green Chilies & Ginger', amount: '2 slit chilies + 1 tsp minced ginger' },
      { item: 'Fresh Curry Leaves & Hing (Asafoetida)', amount: '1 sprig + pinch of hing' },
      { item: 'Turmeric Powder', amount: '1/2 tsp' },
      { item: 'Sesame Oil or Ghee', amount: '2 tbsp' }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: 'Cook LG Gold HMT Rice with 1:2 water ratio. Spread on a wide platter, drizzle 1 tsp oil, and let cool completely so grains remain firm and separate.',
      },
      {
        stepNumber: 2,
        instruction: 'Heat 2 tbsp oil in a pan. Add peanuts and fry on medium flame until golden and crunchy.',
      },
      {
        stepNumber: 3,
        instruction: 'Add mustard seeds, urad dal, chana dal, green chilies, ginger, and curry leaves. Sauté until spluttering.',
      },
      {
        stepNumber: 4,
        instruction: 'Turn off heat. Add turmeric, hing, salt, and freshly squeezed lemon juice to the tempering.',
      },
      {
        stepNumber: 5,
        instruction: 'Pour the fragrant tempering over the cooled LG Gold Rice and mix gently with a flat ladle.',
      }
    ],
    featured: true
  },
  {
    id: 'curd-rice',
    slug: 'curd-rice',
    title: 'Soothing Temple Style Curd Rice (Thayir Sadam)',
    shortDescription: 'Velvety, cool curd rice made with tender LG Gold JSR Rice, tempered with ginger, mustard, and pomegranate.',
    fullDescription: 'The ultimate cooling dish for Indian summers. Made with soft-cooked LG Gold JSR Rice, fresh creamy homemade curd, a dash of warm milk to maintain freshness, and aromatic tempering of mustard, curry leaves, and ginger.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=85',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    servings: 3,
    difficulty: 'Easy',
    categories: ['Everyday Meals', 'South Indian', 'Lunch', 'Quick & Easy', 'Vegetarian'],
    recommendedProductId: 'lg-gold-jsr-rice',
    recommendedPackSize: '26kg Bag',
    cuisine: 'Traditional South Indian',
    nutritionPerServing: '260 kcal, 8g Protein, 44g Carbs',
    chefTips: [
      'LG Gold JSR Rice is naturally soft and fine, making it effortless to mash lightly while warm.',
      'Add a splash of fresh milk if packing for travel or tiffin to keep the curd from turning sour.'
    ],
    ingredients: [
      { item: 'LG Gold JSR Rice', amount: '1 cup (cooked soft with 2.5 cups water)', isLGGoldRice: true },
      { item: 'Fresh Creamy Curd / Yogurt', amount: '1.5 cups' },
      { item: 'Fresh Whole Milk', amount: '1/4 cup' },
      { item: 'Mustard Seeds & Cumin Seeds', amount: '1/2 tsp each' },
      { item: 'Ginger (minced) & Green Chili', amount: '1 tsp ginger + 1 chili' },
      { item: 'Fresh Pomegranate Pearls & Coriander', amount: '3 tbsp for garnish' },
      { item: 'Ghee / Oil', amount: '1 tbsp' }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: 'Cook LG Gold JSR Rice until soft and tender. Mash lightly with the back of a ladle while still warm.',
      },
      {
        stepNumber: 2,
        instruction: 'Once rice reaches room temperature, mix in fresh curd, milk, and salt until silky and homogenous.',
      },
      {
        stepNumber: 3,
        instruction: 'Heat ghee in a tadka pan. Splutter mustard seeds, cumin, green chili, ginger, and curry leaves.',
      },
      {
        stepNumber: 4,
        instruction: 'Pour the tempering over the curd rice. Garnish with ruby pomegranate seeds and fresh coriander.',
      }
    ],
    featured: true
  },
  {
    id: 'vegetable-pulao',
    slug: 'vegetable-pulao',
    title: 'Aromatic One-Pot Vegetable Pulao',
    shortDescription: 'Lightly spiced, ghee-roasted vegetable pulao featuring pristine LG Gold HMT long-slender grains.',
    fullDescription: 'A classic Sunday lunch favorite. Made with whole spices, sweet green peas, carrots, beans, and the exquisite non-sticky grains of LG Gold HMT Rice. Each bite offers warmth, sweetness, and garden-fresh flavor.',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=85',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    totalTimeMinutes: 35,
    servings: 4,
    difficulty: 'Easy',
    categories: ['Everyday Meals', 'Lunch', 'Dinner', 'Vegetarian'],
    recommendedProductId: 'lg-gold-hmt-rice',
    recommendedPackSize: '26kg Bag',
    cuisine: 'North / South Indian Fusion',
    nutritionPerServing: '310 kcal, 7g Protein, 58g Carbs',
    chefTips: [
      'Gently sauté the soaked LG Gold rice in spiced ghee for 1 minute before adding hot water to seal in the flavor.'
    ],
    ingredients: [
      { item: 'LG Gold HMT Rice', amount: '1.5 cups (soaked 15 mins)', isLGGoldRice: true },
      { item: 'Green Peas, Diced Carrots & Beans', amount: '1.5 cups' },
      { item: 'Sliced Onions', amount: '1 large' },
      { item: 'Cumin Seeds, Bay Leaf, Cardamom & Clove', amount: '1 tsp whole spices' },
      { item: 'Ginger-Garlic Paste', amount: '1 tbsp' },
      { item: 'Fresh Mint & Coriander', amount: '1/2 cup chopped' },
      { item: 'Desi Ghee', amount: '2 tbsp' }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: 'Heat ghee in a pot. Add whole spices and sliced onions. Sauté until onions turn light golden.',
      },
      {
        stepNumber: 2,
        instruction: 'Add ginger-garlic paste, diced veggies, mint, and coriander. Sauté for 3 minutes.',
      },
      {
        stepNumber: 3,
        instruction: 'Add drained LG Gold HMT Rice and gently stir to coat grains in aromatic ghee.',
      },
      {
        stepNumber: 4,
        instruction: 'Pour 3 cups of hot water and salt. Bring to a boil, then cover and cook on low heat for 12-14 minutes.',
      }
    ],
    featured: true
  },
  {
    id: 'andhra-pulihora',
    slug: 'andhra-pulihora',
    title: 'Traditional Andhra Tamarind Pulihora',
    shortDescription: 'Tangy, spicy, and festive tamarind rice prepared with aged LG Gold HMT Rice and stone-ground spices.',
    fullDescription: 'The crown jewel of Andhra festive feasts and temple offerings. Rich tamarind pulp is simmered with jaggery, turmeric, green chilies, and sesame-fenugreek spice mix, then mixed into glistening grains of LG Gold HMT Rice.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=85',
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    totalTimeMinutes: 45,
    servings: 6,
    difficulty: 'Medium',
    categories: ['Traditional', 'South Indian', 'Special Occasions', 'Lunch', 'Vegetarian'],
    recommendedProductId: 'lg-gold-hmt-rice',
    recommendedPackSize: '26kg Bag',
    cuisine: 'Traditional Andhra / Telangana',
    nutritionPerServing: '340 kcal, 6g Protein, 60g Carbs',
    chefTips: [
      'Let the pulihora rest for at least 1 hour after mixing for the tamarind paste to deeply infuse into the rice grains.'
    ],
    ingredients: [
      { item: 'LG Gold HMT Rice', amount: '2 cups (cooked fluffy & cooled)', isLGGoldRice: true },
      { item: 'Tamarind Pulp', amount: '1 large lemon size soaked & extracted' },
      { item: 'Peanuts & Roasted Chana Dal', amount: '1/4 cup each' },
      { item: 'Sesame & Fenugreek Powder', amount: '1.5 tsp roasted & ground' },
      { item: 'Green Chilies & Dried Red Chilies', amount: '4 green + 3 red' },
      { item: 'Mustard Seeds & Curry Leaves', amount: '1 tbsp each' },
      { item: 'Groundnut Oil', amount: '3 tbsp' }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: 'Cook LG Gold HMT Rice and spread on a wide tray. Mix with 1 tbsp sesame oil, turmeric, and fresh curry leaves while warm.',
      },
      {
        stepNumber: 2,
        instruction: 'In a pan, cook tamarind extract with green chilies, turmeric, salt, and a small pinch of jaggery until thick and oil separates (pulihora paste).',
      },
      {
        stepNumber: 3,
        instruction: 'In another pan, prepare the tempering with groundnut oil, peanuts, chana dal, mustard seeds, red chilies, and hing.',
      },
      {
        stepNumber: 4,
        instruction: 'Combine the thickened tamarind paste and tempering with the cooled rice. Sprinkle freshly roasted sesame-methi powder and mix lovingly.',
      }
    ]
  },
  {
    id: 'authentic-ven-pongal',
    slug: 'authentic-ven-pongal',
    title: 'Ghee-Loaded Authentic Ven Pongal',
    shortDescription: 'Comforting, peppery, creamy breakfast rice cooked with LG Gold JSR Rice, yellow moong dal, cashews, and cumin.',
    fullDescription: 'South India’s ultimate warm breakfast delicacy. The fine, tender grains of LG Gold JSR Rice blend harmoniously with roasted moong dal, crowned with a generous sizzle of golden cashews, crushed black peppercorns, cumin, and pure desi ghee.',
    image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=1000&q=85',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    totalTimeMinutes: 30,
    servings: 4,
    difficulty: 'Easy',
    categories: ['Breakfast', 'Quick & Easy', 'South Indian', 'Vegetarian', 'Traditional'],
    recommendedProductId: 'lg-gold-jsr-rice',
    recommendedPackSize: '26kg Bag',
    cuisine: 'Traditional South Indian',
    nutritionPerServing: '320 kcal, 9g Protein, 48g Carbs',
    chefTips: [
      'Lightly dry-roast the moong dal until fragrant before cooking with LG Gold JSR Rice for that authentic aroma.'
    ],
    ingredients: [
      { item: 'LG Gold JSR Rice', amount: '1 cup', isLGGoldRice: true },
      { item: 'Yellow Moong Dal', amount: '1/2 cup (lightly dry roasted)' },
      { item: 'Whole Black Peppercorns & Cumin Seeds', amount: '1 tsp each' },
      { item: 'Whole Cashew Nuts', amount: '15 split pieces' },
      { item: 'Grated Ginger & Curry Leaves', amount: '1 tbsp ginger + 2 sprigs' },
      { item: 'Pure Desi Ghee', amount: '4 tbsp' }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: 'Pressure cook or pot cook LG Gold JSR Rice and roasted moong dal with 4.5 cups water and salt until creamy and soft.',
      },
      {
        stepNumber: 2,
        instruction: 'Heat desi ghee in a pan. Fry cashews until golden brown and remove.',
      },
      {
        stepNumber: 3,
        instruction: 'In the same ghee, crackle crushed peppercorns, cumin seeds, ginger, and curry leaves.',
      },
      {
        stepNumber: 4,
        instruction: 'Pour the sizzling ghee and cashew tempering over the hot cooked pongal and mix thoroughly.',
      }
    ]
  },
  {
    id: 'bagara-rice',
    slug: 'bagara-rice',
    title: 'Telangana Special Bagara Rice',
    shortDescription: 'Fragrant Telangana celebratory tempered rice cooked with whole spices, mint, coriander, and LG Gold JSR Rice.',
    fullDescription: 'The authentic flavor of Telangana festivities. Prepared by tempering whole garam masalas, onions, green chilies, mint, and coriander in ghee, then cooking fine LG Gold JSR Rice to fluffy perfection. Pairs with Mirchi ka Salan, Bagara Baingan, or rich curries.',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=85',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    totalTimeMinutes: 35,
    servings: 5,
    difficulty: 'Easy',
    categories: ['Everyday Meals', 'Lunch', 'Dinner', 'Traditional'],
    recommendedProductId: 'lg-gold-jsr-rice',
    recommendedPackSize: '26kg Bag',
    cuisine: 'Telangana Heritage',
    nutritionPerServing: '305 kcal, 6g Protein, 55g Carbs',
    chefTips: [
      'Do not overpower with powdered spices; the authentic Telangana bagara flavor comes purely from whole spices and generous fresh mint.'
    ],
    ingredients: [
      { item: 'LG Gold JSR Rice', amount: '2 cups (soaked 15 mins)', isLGGoldRice: true },
      { item: 'Onions (thinly sliced)', amount: '2 medium' },
      { item: 'Ginger-Garlic Paste', amount: '1.5 tbsp' },
      { item: 'Fresh Mint (Pudina) & Coriander', amount: '1 cup packed' },
      { item: 'Whole Spices (Shahi Jeera, Cloves, Cardamom, Cinnamon, Mace, Bay Leaf)', amount: '1 tbsp mix' },
      { item: 'Ghee & Cooking Oil', amount: '2 tbsp each' }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: 'Heat ghee and oil in a heavy cooking pot. Add shahi jeera and whole spices until fragrant.',
      },
      {
        stepNumber: 2,
        instruction: 'Add sliced onions and green chilies. Sauté until light brown. Add ginger-garlic paste, fresh mint, and coriander.',
      },
      {
        stepNumber: 3,
        instruction: 'Add soaked and drained LG Gold JSR Rice. Sauté gently for 1 minute.',
      },
      {
        stepNumber: 4,
        instruction: 'Add 4 cups hot water and salt. Cover and cook on medium flame until water is absorbed and grains are fluffy.',
      }
    ]
  },
  {
    id: 'tomato-mint-rice',
    slug: 'tomato-mint-rice',
    title: 'Spiced Tomato & Mint Rice',
    shortDescription: 'Tangy, aromatic lunchbox favorite made with vine-ripened tomatoes, garden mint, and LG Gold HMT Rice.',
    fullDescription: 'A vibrant, savory rice dish made by simmering rich tomato masala with aromatic spices, tossed with the non-sticky, distinct grains of LG Gold HMT Rice.',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=85',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    totalTimeMinutes: 30,
    servings: 4,
    difficulty: 'Easy',
    categories: ['Quick & Easy', 'Everyday Meals', 'Lunch', 'Vegetarian'],
    recommendedProductId: 'lg-gold-hmt-rice',
    recommendedPackSize: '26kg Bag',
    cuisine: 'South Indian',
    nutritionPerServing: '280 kcal, 6g Protein, 50g Carbs',
    chefTips: ['Use ripe, juicy country tomatoes for the best natural tanginess.'],
    ingredients: [
      { item: 'LG Gold HMT Rice', amount: '1.5 cups (cooked & cooled)', isLGGoldRice: true },
      { item: 'Ripe Tomatoes (finely chopped)', amount: '4 large' },
      { item: 'Fresh Mint Leaves', amount: '1/2 cup' },
      { item: 'Mustard Seeds & Cumin', amount: '1 tsp' },
      { item: 'Sambar Powder / Garam Masala', amount: '1 tbsp' },
      { item: 'Oil', amount: '2 tbsp' }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: 'Heat oil, crackle mustard and cumin. Sauté onions, green chilies, and fresh mint until fragrant.',
      },
      {
        stepNumber: 2,
        instruction: 'Add chopped tomatoes, turmeric, sambar powder, and salt. Cook until tomatoes turn mushy and oil leaves the sides.',
      },
      {
        stepNumber: 3,
        instruction: 'Gently fold in the cooked LG Gold HMT Rice until uniformly coated with tomato masala.',
      }
    ]
  }
];

export const getRecipeBySlug = (slug: string): Recipe | undefined => {
  return RECIPES.find(r => r.slug === slug || r.id === slug);
};
