import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import RecipeBook from './pages/RecipeBook'
import RecipeDetail from './pages/RecipeDetail'
import EditRecipe from './pages/EditRecipe'
import MealPlanner from './pages/MealPlanner'
import GroceryList from './pages/GroceryList'
import AddRecipe from './pages/AddRecipe'
import './App.css'

function App() {
  return (
    <div className="app">
      {/* Floating food sprites */}
      <div className="food-sprites">
        <span className="food-sprite">🍕</span>
        <span className="food-sprite">🍔</span>
        <span className="food-sprite">🌮</span>
        <span className="food-sprite">🍣</span>
        <span className="food-sprite">🍩</span>
      </div>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<RecipeBook />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/recipes/:id/edit" element={<EditRecipe />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/grocery-list" element={<GroceryList />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
