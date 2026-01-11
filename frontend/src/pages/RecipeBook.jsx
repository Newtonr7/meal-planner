import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import RecipeFilters from '../components/RecipeFilters'
import './RecipeBook.css'

const API_URL = 'http://localhost:3000/api'

function RecipeBook() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    meal_type: '',
    cuisine: '',
    protein_type: '',
    cooking_method: ''
  })

  useEffect(() => {
    fetchRecipes()
  }, [filters])

  const fetchRecipes = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`${API_URL}/recipes?${params}`)
      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  if (loading) {
    return <div className="loading">Loading recipes...</div>
  }

  return (
    <div className="recipe-book">
      <h1>Recipe Book</h1>
      <RecipeFilters filters={filters} onFilterChange={handleFilterChange} />
      <div className="recipe-grid">
        {recipes.length === 0 ? (
          <p className="no-recipes">No recipes found. Try adjusting your filters.</p>
        ) : (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        )}
      </div>
    </div>
  )
}

export default RecipeBook
