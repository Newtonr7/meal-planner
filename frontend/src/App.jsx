import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import RecipeBook from './pages/RecipeBook'
import RecipeDetail from './pages/RecipeDetail'
import MealPlanner from './pages/MealPlanner'
import GroceryList from './pages/GroceryList'
import AddRecipe from './pages/AddRecipe'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<RecipeBook />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/grocery-list" element={<GroceryList />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
