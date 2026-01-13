require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { db, initializeDatabase, seedSampleData } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    await seedSampleData();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// ============================================
// RECIPE ENDPOINTS
// ============================================

// GET /api/recipes - Get all recipes with optional filters
app.get('/api/recipes', (req, res) => {
  const { meal_type, cuisine, dish_type, protein_type, cooking_method, search } = req.query;

  let sql = 'SELECT * FROM recipes WHERE 1=1';
  const params = [];

  if (meal_type) {
    sql += ' AND meal_type = ?';
    params.push(meal_type);
  }
  if (cuisine) {
    sql += ' AND cuisine = ?';
    params.push(cuisine);
  }
  if (dish_type) {
    sql += ' AND dish_type = ?';
    params.push(dish_type);
  }
  if (protein_type) {
    sql += ' AND protein_type = ?';
    params.push(protein_type);
  }
  if (cooking_method) {
    sql += ' AND cooking_method = ?';
    params.push(cooking_method);
  }
  if (search) {
    sql += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  sql += ' ORDER BY name';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /api/recipes/:id - Get single recipe with ingredients
app.get('/api/recipes/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM recipes WHERE id = ?', [id], (err, recipe) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    db.all(
      'SELECT id, ingredient_name, quantity FROM recipe_ingredients WHERE recipe_id = ?',
      [id],
      (err, ingredients) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ ...recipe, ingredients });
      }
    );
  });
});

// POST /api/recipes - Add new recipe
app.post('/api/recipes', (req, res) => {
  const {
    name,
    meal_type,
    cuisine,
    dish_type,
    protein_type,
    cooking_method,
    cook_time,
    serving_size,
    instructions,
    image_url,
    ingredients
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Recipe name is required' });
  }

  const sql = `
    INSERT INTO recipes (name, meal_type, cuisine, dish_type, protein_type, cooking_method, cook_time, serving_size, instructions, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [name, meal_type, cuisine, dish_type, protein_type, cooking_method, cook_time, serving_size, instructions, image_url],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const recipeId = this.lastID;

      // Insert ingredients if provided
      if (ingredients && ingredients.length > 0) {
        const insertIngredient = db.prepare(
          'INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity) VALUES (?, ?, ?)'
        );

        ingredients.forEach((ing) => {
          insertIngredient.run(recipeId, ing.ingredient_name, ing.quantity);
        });

        insertIngredient.finalize();
      }

      res.status(201).json({ id: recipeId, message: 'Recipe created successfully' });
    }
  );
});

// PUT /api/recipes/:id - Update existing recipe
app.put('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  const {
    name,
    meal_type,
    cuisine,
    dish_type,
    protein_type,
    cooking_method,
    cook_time,
    serving_size,
    instructions,
    image_url,
    ingredients
  } = req.body;

  // First check if recipe exists
  db.get('SELECT id FROM recipes WHERE id = ?', [id], (err, recipe) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Build dynamic update query
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (meal_type !== undefined) {
      updates.push('meal_type = ?');
      params.push(meal_type);
    }
    if (cuisine !== undefined) {
      updates.push('cuisine = ?');
      params.push(cuisine);
    }
    if (dish_type !== undefined) {
      updates.push('dish_type = ?');
      params.push(dish_type);
    }
    if (protein_type !== undefined) {
      updates.push('protein_type = ?');
      params.push(protein_type);
    }
    if (cooking_method !== undefined) {
      updates.push('cooking_method = ?');
      params.push(cooking_method);
    }
    if (cook_time !== undefined) {
      updates.push('cook_time = ?');
      params.push(cook_time);
    }
    if (serving_size !== undefined) {
      updates.push('serving_size = ?');
      params.push(serving_size);
    }
    if (instructions !== undefined) {
      updates.push('instructions = ?');
      params.push(instructions);
    }
    if (image_url !== undefined) {
      updates.push('image_url = ?');
      params.push(image_url);
    }

    // Update recipe fields if any provided
    if (updates.length > 0) {
      params.push(id);
      db.run(
        `UPDATE recipes SET ${updates.join(', ')} WHERE id = ?`,
        params,
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
        }
      );
    }

    // Update ingredients if provided
    if (ingredients !== undefined) {
      // Delete existing ingredients
      db.run('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [id], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Insert new ingredients
        if (ingredients.length > 0) {
          const insertIngredient = db.prepare(
            'INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity) VALUES (?, ?, ?)'
          );

          ingredients.forEach((ing) => {
            insertIngredient.run(id, ing.ingredient_name, ing.quantity);
          });

          insertIngredient.finalize();
        }

        res.json({ message: 'Recipe updated successfully' });
      });
    } else {
      res.json({ message: 'Recipe updated successfully' });
    }
  });
});

// DELETE /api/recipes/:id - Delete recipe
app.delete('/api/recipes/:id', (req, res) => {
  const { id } = req.params;

  // Check if recipe exists
  db.get('SELECT id FROM recipes WHERE id = ?', [id], (err, recipe) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Delete recipe (ingredients will cascade delete due to foreign key)
    db.run('DELETE FROM recipes WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Recipe deleted successfully' });
    });
  });
});

// ============================================
// MEAL PLAN ENDPOINTS
// ============================================

// GET /api/meal-plan - Get meal plan for a week
app.get('/api/meal-plan', (req, res) => {
  const { week_start } = req.query;

  if (!week_start) {
    return res.status(400).json({ error: 'week_start parameter is required' });
  }

  const sql = `
    SELECT mp.id, mp.day_of_week, mp.meal_type, mp.week_start_date,
           r.id as recipe_id, r.name as recipe_name, r.cook_time, r.cuisine
    FROM meal_plan mp
    JOIN recipes r ON mp.recipe_id = r.id
    WHERE mp.week_start_date = ?
    ORDER BY
      CASE mp.day_of_week
        WHEN 'Monday' THEN 1
        WHEN 'Tuesday' THEN 2
        WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4
        WHEN 'Friday' THEN 5
        WHEN 'Saturday' THEN 6
        WHEN 'Sunday' THEN 7
      END,
      CASE mp.meal_type
        WHEN 'breakfast' THEN 1
        WHEN 'lunch' THEN 2
        WHEN 'dinner' THEN 3
      END
  `;

  db.all(sql, [week_start], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /api/meal-plan - Add recipe to meal plan
app.post('/api/meal-plan', (req, res) => {
  const { recipe_id, day_of_week, meal_type, week_start_date } = req.body;

  if (!recipe_id || !day_of_week || !meal_type || !week_start_date) {
    return res.status(400).json({ error: 'recipe_id, day_of_week, meal_type, and week_start_date are required' });
  }

  // Check if there's already a meal for this slot
  db.get(
    'SELECT id FROM meal_plan WHERE day_of_week = ? AND meal_type = ? AND week_start_date = ?',
    [day_of_week, meal_type, week_start_date],
    (err, existing) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (existing) {
        // Update existing slot
        db.run(
          'UPDATE meal_plan SET recipe_id = ? WHERE id = ?',
          [recipe_id, existing.id],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ id: existing.id, message: 'Meal plan updated' });
          }
        );
      } else {
        // Insert new
        db.run(
          'INSERT INTO meal_plan (recipe_id, day_of_week, meal_type, week_start_date) VALUES (?, ?, ?, ?)',
          [recipe_id, day_of_week, meal_type, week_start_date],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, message: 'Meal added to plan' });
          }
        );
      }
    }
  );
});

// DELETE /api/meal-plan/:id - Remove meal from plan
app.delete('/api/meal-plan/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM meal_plan WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Meal plan entry not found' });
    }
    res.json({ message: 'Meal removed from plan' });
  });
});

// ============================================
// GROCERY LIST ENDPOINTS
// ============================================

// GET /api/grocery-list - Get grocery list for a week
app.get('/api/grocery-list', (req, res) => {
  const { week_start } = req.query;

  if (!week_start) {
    return res.status(400).json({ error: 'week_start parameter is required' });
  }

  db.all(
    'SELECT * FROM grocery_list WHERE week_start_date = ? ORDER BY is_checked, item_name',
    [week_start],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// POST /api/grocery-list/generate - Auto-generate from meal plan
app.post('/api/grocery-list/generate', (req, res) => {
  const { week_start } = req.body;

  if (!week_start) {
    return res.status(400).json({ error: 'week_start is required' });
  }

  // Get all ingredients from meals in the plan for this week
  const sql = `
    SELECT ri.ingredient_name, ri.quantity
    FROM meal_plan mp
    JOIN recipe_ingredients ri ON mp.recipe_id = ri.recipe_id
    WHERE mp.week_start_date = ?
  `;

  db.all(sql, [week_start], (err, ingredients) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Clear existing grocery list for this week
    db.run('DELETE FROM grocery_list WHERE week_start_date = ?', [week_start], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (ingredients.length === 0) {
        return res.json({ message: 'Grocery list generated', items: [] });
      }

      // Combine duplicate ingredients
      const combined = {};
      ingredients.forEach((ing) => {
        const key = ing.ingredient_name.toLowerCase();
        if (combined[key]) {
          combined[key].quantities.push(ing.quantity);
        } else {
          combined[key] = {
            name: ing.ingredient_name,
            quantities: [ing.quantity]
          };
        }
      });

      // Insert combined ingredients
      const insertStmt = db.prepare(
        'INSERT INTO grocery_list (item_name, quantity, is_checked, week_start_date) VALUES (?, ?, 0, ?)'
      );

      const items = [];
      Object.values(combined).forEach((item) => {
        const quantity = item.quantities.join(' + ');
        insertStmt.run(item.name, quantity, week_start);
        items.push({ item_name: item.name, quantity });
      });

      insertStmt.finalize();

      res.json({ message: 'Grocery list generated', items });
    });
  });
});

// POST /api/grocery-list - Add manual item
app.post('/api/grocery-list', (req, res) => {
  const { item_name, quantity, week_start_date } = req.body;

  if (!item_name || !week_start_date) {
    return res.status(400).json({ error: 'item_name and week_start_date are required' });
  }

  db.run(
    'INSERT INTO grocery_list (item_name, quantity, is_checked, week_start_date) VALUES (?, ?, 0, ?)',
    [item_name, quantity || '', week_start_date],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Item added to grocery list' });
    }
  );
});

// PUT /api/grocery-list/:id - Update item
app.put('/api/grocery-list/:id', (req, res) => {
  const { id } = req.params;
  const { item_name, quantity, is_checked } = req.body;

  // Build dynamic update query
  const updates = [];
  const params = [];

  if (item_name !== undefined) {
    updates.push('item_name = ?');
    params.push(item_name);
  }
  if (quantity !== undefined) {
    updates.push('quantity = ?');
    params.push(quantity);
  }
  if (is_checked !== undefined) {
    updates.push('is_checked = ?');
    params.push(is_checked ? 1 : 0);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  params.push(id);

  db.run(
    `UPDATE grocery_list SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json({ message: 'Item updated' });
    }
  );
});

// DELETE /api/grocery-list/:id - Delete item
app.delete('/api/grocery-list/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM grocery_list WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  });
});

// Start the server
startServer();
