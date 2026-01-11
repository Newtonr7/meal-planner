const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'meal_planner.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create recipes table
      db.run(`
        CREATE TABLE IF NOT EXISTS recipes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          meal_type TEXT CHECK(meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
          cuisine TEXT,
          dish_type TEXT,
          protein_type TEXT,
          cooking_method TEXT,
          cook_time INTEGER,
          serving_size INTEGER,
          instructions TEXT,
          image_url TEXT
        )
      `);

      // Create recipe_ingredients table
      db.run(`
        CREATE TABLE IF NOT EXISTS recipe_ingredients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          recipe_id INTEGER NOT NULL,
          ingredient_name TEXT NOT NULL,
          quantity TEXT,
          FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        )
      `);

      // Create meal_plan table
      db.run(`
        CREATE TABLE IF NOT EXISTS meal_plan (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          recipe_id INTEGER NOT NULL,
          day_of_week TEXT CHECK(day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
          meal_type TEXT CHECK(meal_type IN ('breakfast', 'lunch', 'dinner')),
          week_start_date TEXT,
          FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        )
      `);

      // Create grocery_list table
      db.run(`
        CREATE TABLE IF NOT EXISTS grocery_list (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_name TEXT NOT NULL,
          quantity TEXT,
          is_checked INTEGER DEFAULT 0,
          week_start_date TEXT
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

function seedSampleData() {
  return new Promise((resolve, reject) => {
    // Check if data already exists
    db.get('SELECT COUNT(*) as count FROM recipes', (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        resolve();
        return;
      }

      // Insert sample recipes
      const recipes = [
        {
          name: 'Spaghetti Carbonara',
          meal_type: 'dinner',
          cuisine: 'Italian',
          dish_type: 'pasta',
          protein_type: 'pork',
          cooking_method: 'stovetop',
          cook_time: 30,
          serving_size: 4,
          instructions: '1. Cook spaghetti according to package directions.\n2. Fry pancetta until crispy.\n3. Whisk eggs with parmesan cheese.\n4. Toss hot pasta with pancetta, then quickly mix in egg mixture.\n5. Season with black pepper and serve immediately.'
        },
        {
          name: 'Chicken Stir Fry',
          meal_type: 'dinner',
          cuisine: 'Asian',
          dish_type: 'stir-fry',
          protein_type: 'chicken',
          cooking_method: 'stovetop',
          cook_time: 25,
          serving_size: 4,
          instructions: '1. Cut chicken into bite-sized pieces.\n2. Heat oil in wok over high heat.\n3. Stir fry chicken until cooked, set aside.\n4. Stir fry vegetables until crisp-tender.\n5. Return chicken, add sauce, and toss to coat.\n6. Serve over rice.'
        },
        {
          name: 'Classic Pancakes',
          meal_type: 'breakfast',
          cuisine: 'American',
          dish_type: 'pancakes',
          protein_type: 'vegetarian',
          cooking_method: 'stovetop',
          cook_time: 20,
          serving_size: 4,
          instructions: '1. Mix flour, sugar, baking powder, and salt.\n2. Whisk milk, egg, and melted butter.\n3. Combine wet and dry ingredients until just mixed.\n4. Pour batter onto hot griddle.\n5. Flip when bubbles form, cook until golden.\n6. Serve with maple syrup and butter.'
        },
        {
          name: 'Beef Tacos',
          meal_type: 'dinner',
          cuisine: 'Mexican',
          dish_type: 'tacos',
          protein_type: 'beef',
          cooking_method: 'stovetop',
          cook_time: 25,
          serving_size: 4,
          instructions: '1. Brown ground beef in a skillet.\n2. Add taco seasoning and water, simmer.\n3. Warm taco shells in oven.\n4. Fill shells with beef.\n5. Top with lettuce, cheese, tomatoes, and sour cream.'
        },
        {
          name: 'Caesar Salad',
          meal_type: 'lunch',
          cuisine: 'American',
          dish_type: 'salad',
          protein_type: 'vegetarian',
          cooking_method: 'none',
          cook_time: 15,
          serving_size: 2,
          instructions: '1. Tear romaine lettuce into pieces.\n2. Make dressing: whisk garlic, anchovy paste, lemon juice, mustard, and olive oil.\n3. Toss lettuce with dressing.\n4. Add croutons and shaved parmesan.\n5. Season with black pepper.'
        },
        {
          name: 'Air Fryer Salmon',
          meal_type: 'dinner',
          cuisine: 'American',
          dish_type: 'fish',
          protein_type: 'fish',
          cooking_method: 'air-fryer',
          cook_time: 12,
          serving_size: 2,
          instructions: '1. Pat salmon fillets dry.\n2. Season with salt, pepper, and garlic powder.\n3. Brush with olive oil.\n4. Air fry at 400°F for 8-10 minutes.\n5. Squeeze fresh lemon juice on top before serving.'
        }
      ];

      const ingredients = {
        'Spaghetti Carbonara': [
          { name: 'spaghetti', quantity: '1 lb' },
          { name: 'pancetta', quantity: '8 oz' },
          { name: 'eggs', quantity: '4 large' },
          { name: 'parmesan cheese', quantity: '1 cup grated' },
          { name: 'black pepper', quantity: '1 tsp' },
          { name: 'salt', quantity: 'to taste' }
        ],
        'Chicken Stir Fry': [
          { name: 'chicken breast', quantity: '1 lb' },
          { name: 'broccoli', quantity: '2 cups' },
          { name: 'bell pepper', quantity: '1 large' },
          { name: 'soy sauce', quantity: '3 tbsp' },
          { name: 'garlic', quantity: '3 cloves' },
          { name: 'vegetable oil', quantity: '2 tbsp' },
          { name: 'rice', quantity: '2 cups' }
        ],
        'Classic Pancakes': [
          { name: 'all-purpose flour', quantity: '1.5 cups' },
          { name: 'milk', quantity: '1.25 cups' },
          { name: 'egg', quantity: '1 large' },
          { name: 'butter', quantity: '3 tbsp melted' },
          { name: 'sugar', quantity: '2 tbsp' },
          { name: 'baking powder', quantity: '2 tsp' },
          { name: 'salt', quantity: '0.5 tsp' }
        ],
        'Beef Tacos': [
          { name: 'ground beef', quantity: '1 lb' },
          { name: 'taco seasoning', quantity: '1 packet' },
          { name: 'taco shells', quantity: '8 shells' },
          { name: 'shredded lettuce', quantity: '2 cups' },
          { name: 'cheddar cheese', quantity: '1 cup shredded' },
          { name: 'tomatoes', quantity: '2 diced' },
          { name: 'sour cream', quantity: '0.5 cup' }
        ],
        'Caesar Salad': [
          { name: 'romaine lettuce', quantity: '2 heads' },
          { name: 'parmesan cheese', quantity: '0.5 cup shaved' },
          { name: 'croutons', quantity: '1 cup' },
          { name: 'olive oil', quantity: '0.25 cup' },
          { name: 'lemon juice', quantity: '2 tbsp' },
          { name: 'garlic', quantity: '1 clove' },
          { name: 'dijon mustard', quantity: '1 tsp' }
        ],
        'Air Fryer Salmon': [
          { name: 'salmon fillets', quantity: '2 (6 oz each)' },
          { name: 'olive oil', quantity: '1 tbsp' },
          { name: 'garlic powder', quantity: '0.5 tsp' },
          { name: 'salt', quantity: '0.5 tsp' },
          { name: 'black pepper', quantity: '0.25 tsp' },
          { name: 'lemon', quantity: '1' }
        ]
      };

      db.serialize(() => {
        const insertRecipe = db.prepare(`
          INSERT INTO recipes (name, meal_type, cuisine, dish_type, protein_type, cooking_method, cook_time, serving_size, instructions)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const insertIngredient = db.prepare(`
          INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity)
          VALUES (?, ?, ?)
        `);

        let insertedCount = 0;

        recipes.forEach((recipe) => {
          insertRecipe.run(
            recipe.name,
            recipe.meal_type,
            recipe.cuisine,
            recipe.dish_type,
            recipe.protein_type,
            recipe.cooking_method,
            recipe.cook_time,
            recipe.serving_size,
            recipe.instructions,
            function(err) {
              if (err) {
                console.error('Error inserting recipe:', err);
                return;
              }

              const recipeId = this.lastID;
              const recipeIngredients = ingredients[recipe.name] || [];

              recipeIngredients.forEach((ing) => {
                insertIngredient.run(recipeId, ing.name, ing.quantity);
              });

              insertedCount++;
              if (insertedCount === recipes.length) {
                insertRecipe.finalize();
                insertIngredient.finalize();
                console.log('Sample data seeded successfully');
                resolve();
              }
            }
          );
        });
      });
    });
  });
}

module.exports = {
  db,
  initializeDatabase,
  seedSampleData
};
