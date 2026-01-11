import { useState } from 'react'
import { Link } from 'react-router-dom'
import './MealPlanDay.css'

const API_URL = 'http://localhost:3000/api'

function MealPlanDay({ day, mealType, meal, onRemove, weekStart, onMealAdded }) {
  const [showPicker, setShowPicker] = useState(false)
  const [recipes, setRecipes] = useState([])

  const openPicker = async () => {
    try {
      const response = await fetch(`${API_URL}/recipes?meal_type=${mealType}`)
      const data = await response.json()
      setRecipes(data)
      setShowPicker(true)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    }
  }

  const selectRecipe = async (recipeId) => {
    try {
      await fetch(`${API_URL}/meal-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipe_id: recipeId,
          day_of_week: day,
          meal_type: mealType,
          week_start_date: weekStart
        })
      })
      setShowPicker(false)
      onMealAdded()
    } catch (error) {
      console.error('Error adding meal:', error)
    }
  }

  return (
    <div className="meal-plan-day">
      {meal ? (
        <div className="meal-assigned">
          <Link to={`/recipes/${meal.recipe_id}`} className="meal-name">
            {meal.recipe_name}
          </Link>
          <span className="meal-time">{meal.cook_time} min</span>
          <button onClick={() => onRemove(meal.id)} className="remove-meal">
            x
          </button>
        </div>
      ) : (
        <button onClick={openPicker} className="add-meal-btn">
          + Add
        </button>
      )}

      {showPicker && (
        <div className="recipe-picker-overlay" onClick={() => setShowPicker(false)}>
          <div className="recipe-picker" onClick={(e) => e.stopPropagation()}>
            <h3>Select a Recipe</h3>
            <ul>
              {recipes.length === 0 ? (
                <li className="no-recipes">No {mealType} recipes found</li>
              ) : (
                recipes.map((recipe) => (
                  <li key={recipe.id} onClick={() => selectRecipe(recipe.id)}>
                    {recipe.name}
                  </li>
                ))
              )}
            </ul>
            <button onClick={() => setShowPicker(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MealPlanDay
