-- Test recipes for user 5ed9a9a9-c2f2-48da-85f4-9f23ee0f94d8
-- Run in the Supabase SQL Editor.
-- That user_id must already exist in public.profiles (FK).

insert into public.recipes (
  user_id,
  title,
  ingredients,
  instructions,
  cooking_time,
  difficulty,
  category,
  image_url
)
values
  (
    '5ed9a9a9-c2f2-48da-85f4-9f23ee0f94d8',
    'Weeknight Tomato Pasta',
    array[
      '400g spaghetti',
      '2 garlic cloves, sliced',
      '1 can crushed tomatoes',
      '3 tbsp olive oil',
      'salt and black pepper'
    ],
    'Boil the pasta in salted water until al dente. Warm the olive oil in a pan, cook the garlic until fragrant, then add the tomatoes and simmer 10 minutes. Toss with the pasta and season to taste.',
    25,
    'easy',
    'Dinner',
    null
  ),
  (
    '5ed9a9a9-c2f2-48da-85f4-9f23ee0f94d8',
    'Spiced Lentil Soup',
    array[
      '1 cup red lentils, rinsed',
      '1 onion, chopped',
      '1 tsp cumin',
      '1 tsp smoked paprika',
      '4 cups vegetable broth',
      'lemon juice'
    ],
    'Sauté the onion until soft. Stir in cumin and paprika, then add lentils and broth. Simmer 20–25 minutes until the lentils break down. Finish with lemon juice and serve.',
    40,
    'medium',
    'Soup',
    null
  );

-- Test recipes for user 8fe32cd4-0104-4f0f-8f30-944d2c916e00
-- Run only this insert if the recipes above are already in the table.

insert into public.recipes (
  user_id,
  title,
  ingredients,
  instructions,
  cooking_time,
  difficulty,
  category,
  image_url
)
values
  (
    '8fe32cd4-0104-4f0f-8f30-944d2c916e00',
    'Sesame Ginger Stir-Fry',
    array[
      '2 cups mixed vegetables',
      '1 tbsp sesame oil',
      '1 tbsp grated ginger',
      '2 tbsp soy sauce',
      '1 tsp honey',
      'sesame seeds'
    ],
    'Heat the sesame oil in a skillet. Add ginger and vegetables, stir-fry until crisp-tender. Mix soy sauce and honey, pour over the vegetables, and toss. Finish with sesame seeds.',
    20,
    'easy',
    'Dinner',
    null
  ),
  (
    '8fe32cd4-0104-4f0f-8f30-944d2c916e00',
    'Blueberry Oat Muffins',
    array[
      '1.5 cups rolled oats',
      '1 cup flour',
      '1 tsp baking powder',
      '1/3 cup honey',
      '1 egg',
      '1 cup blueberries'
    ],
    'Heat the oven to 180°C. Mix the dry ingredients, then stir in honey, egg, and a splash of milk. Fold in blueberries, scoop into a muffin tin, and bake 20–22 minutes.',
    35,
    'easy',
    'Breakfast',
    null
  );
