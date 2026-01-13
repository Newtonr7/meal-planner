import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import './RecipeDetail.css'

function RecipeDetail() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecipe()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}`)
      const data = await response.json()
      setRecipe(data)
    } catch (error) {
      console.error('Error fetching recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading recipe...</div>
  }

  if (!recipe) {
    return <div className="error">Recipe not found</div>
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-header">
        <Link to="/" className="back-link">Back to Recipes</Link>
        <Link to={`/recipes/${id}/edit`} className="edit-link">Edit Recipe</Link>
      </div>

      <h1>{recipe.name}</h1>

      <div className="recipe-meta">
        <span className="meta-item">{recipe.meal_type}</span>
        <span className="meta-item">{recipe.cuisine}</span>
        <span className="meta-item">{recipe.cooking_method}</span>
        <span className="meta-item">{recipe.cook_time} min</span>
        <span className="meta-item">Serves {recipe.serving_size}</span>
      </div>

      <div className="recipe-content">
        <section className="ingredients-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients?.map((ing) => (
              <li key={ing.id}>
                <span className="quantity">{ing.quantity}</span>
                <span className="ingredient-name">{ing.ingredient_name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="instructions-section">
          <h2>Instructions</h2>
          <div className="instructions">
            {recipe.instructions?.split('\n').map((step, index) => (
              <p key={index}>{step}</p>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default RecipeDetail
