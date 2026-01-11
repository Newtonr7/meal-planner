# Meal Planner Web App - Project Brief

## Project Goal
Build a full-stack web application to help plan weekly meals, browse recipes, and auto-generate grocery lists. The app should work seamlessly on both desktop and mobile devices.

## Core Features (MVP - Phase 1)

### 1. Recipe Book
- Browse all recipes in card/grid layout
- Search recipes by name
- Filter by:
  - Meal type (breakfast, lunch, dinner, snack)
  - Cuisine (Italian, Asian, American, Mexican, etc.)
  - Dish type (pasta, salad, sandwich, soup, etc.)
  - Protein type (chicken, beef, pork, fish, vegetarian, vegan)
  - Cooking method (stovetop, oven, air-fryer, microwave, slow-cooker)
- Click recipe to see full details

### 2. Recipe Detail Page
- Recipe name
- All metadata (meal type, cuisine, cook time, serving size, etc.)
- Complete ingredients list with quantities
- Step-by-step cooking instructions
- "Add to Meal Plan" buttons for each day of the week

### 3. Weekly Meal Planner
- 7-day view (Monday through Sunday)
- Show assigned recipe for each day (if any)
- Different sections for breakfast, lunch, dinner
- Remove meal from day functionality
- "Generate Grocery List" button

### 4. Grocery List
- Auto-generated from all recipes in the week's meal plan
- Combines duplicate ingredients intelligently
- Checkbox to mark items as purchased/checked off
- Manual add item functionality
- Edit quantities
- Delete items
- Persists across page refreshes

### 5. Add Custom Recipes
- Form with fields:
  - Name
  - Meal type
  - Cuisine
  - Dish type
  - Protein type
  - Cooking method
  - Cook time (minutes)
  - Serving size
  - Instructions (textarea)
  - Multiple ingredients with quantities (dynamic form)
- Saves to database

## Technology Stack

### Backend
- Node.js + Express (REST API)
- SQLite database (file-based, simple)
- Port: 3000

### Frontend
- React (with Vite)
- React Router (for navigation)
- CSS with Flexbox/Grid for responsive design
- Fetch API for backend communication

### Database Schema

**recipes table:**
- id (PRIMARY KEY)
- name
- meal_type (breakfast/lunch/dinner/snack)
- cuisine (Italian/Asian/American/Mexican/etc)
- dish_type (pasta/salad/sandwich/soup/etc)
- protein_type (chicken/beef/pork/fish/vegetarian/vegan)
- cooking_method (stovetop/oven/air-fryer/microwave/slow-cooker)
- cook_time (integer, minutes)
- serving_size (integer)
- instructions (text)
- image_url (optional, for future)

**recipe_ingredients table:**
- id (PRIMARY KEY)
- recipe_id (FOREIGN KEY → recipes.id)
- ingredient_name
- quantity (e.g., "2 cups", "1 lb")

**meal_plan table:**
- id (PRIMARY KEY)
- recipe_id (FOREIGN KEY → recipes.id)
- day_of_week (Monday/Tuesday/etc)
- meal_type (breakfast/lunch/dinner)
- week_start_date (to track different weeks)

**grocery_list table:**
- id (PRIMARY KEY)
- item_name
- quantity
- is_checked (boolean, default false)
- week_start_date

## File Structure
```
meal-planner/
├── backend/
│   ├── server.js           (Express API)
│   ├── database.js         (SQLite setup + sample data)
│   ├── package.json
│   └── meal_planner.db     (created automatically)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── RecipeFilters.jsx
│   │   │   ├── MealPlanDay.jsx
│   │   │   ├── GroceryItem.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── RecipeBook.jsx
│   │   │   ├── RecipeDetail.jsx
│   │   │   ├── MealPlanner.jsx
│   │   │   ├── GroceryList.jsx
│   │   │   └── AddRecipe.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── docs/
│   └── PROJECT.md (this file)
└── README.md
```

## API Endpoints

### Recipes
- GET `/api/recipes` - Get all recipes (with query params for filters)
- GET `/api/recipes/:id` - Get single recipe with ingredients
- POST `/api/recipes` - Add new recipe

### Meal Plan
- GET `/api/meal-plan?week_start=YYYY-MM-DD` - Get meal plan for week
- POST `/api/meal-plan` - Add recipe to a day
- DELETE `/api/meal-plan/:id` - Remove meal from day

### Grocery List
- GET `/api/grocery-list?week_start=YYYY-MM-DD` - Get list for week
- POST `/api/grocery-list/generate` - Auto-generate from meal plan
- POST `/api/grocery-list` - Add manual item
- PUT `/api/grocery-list/:id` - Update item (edit/check off)
- DELETE `/api/grocery-list/:id` - Delete item

## Responsive Design Requirements

### Desktop
- Recipe cards in 3-column grid
- Sidebar for filters
- Full navigation bar

### Mobile
- Recipe cards stack vertically (1 column)
- Hamburger menu
- Filter chips
- Bottom navigation for main sections
- Larger touch targets
- Swipeable meal planner

## Design Vision
- Unique recipe book aesthetic (not generic)
- Clean, modern interface
- Easy to use while cooking
- Personal, cookbook-like feel

## Development Phases

### Phase 1: Backend (Current Focus)
1. Set up Node.js + Express project
2. Create SQLite database with schema
3. Build all API endpoints
4. Add sample recipes
5. Test with Postman/curl

### Phase 2: React Frontend
1. Set up React with Vite
2. Create component structure
3. Build Recipe Book with filters
4. Build Recipe Detail page
5. Build Meal Planner
6. Build Grocery List
7. Build Add Recipe form

### Phase 3: Styling & Polish
1. Make fully responsive
2. Add unique design elements
3. Test on mobile browser
4. Refine UX

### Phase 4: Deployment
1. Deploy backend to Railway/Render
2. Deploy frontend to Vercel
3. Test production version

## Future Enhancements (Phase 2+)
- Recipe rating system
- Allergy tracking and warnings
- User accounts and authentication
- Recipe images
- Serving size adjustment
- AI recipe generation (Gemini API)
- Recipe sharing

## Current Status
- Environment setup complete
- Ready to start Phase 1: Backend development