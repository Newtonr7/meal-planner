import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { API_URL } from '../config'
import './AddRecipe.css'

function EditRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [recipe, setRecipe] = useState({
    name: '',
    meal_type: '',
    cuisine: '',
    dish_type: '',
    protein_type: '',
    cooking_method: '',
    cook_time: '',
    serving_size: '',
    instructions: ''
  })
  const [ingredients, setIngredients] = useState([{ ingredient_name: '', quantity: '' }])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRecipe()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}`)
      if (!response.ok) {
        setError('Recipe not found')
        setLoading(false)
        return
      }
      const data = await response.json()
      setRecipe({
        name: data.name || '',
        meal_type: data.meal_type || '',
        cuisine: data.cuisine || '',
        dish_type: data.dish_type || '',
        protein_type: data.protein_type || '',
        cooking_method: data.cooking_method || '',
        cook_time: data.cook_time || '',
        serving_size: data.serving_size || '',
        instructions: data.instructions || ''
      })
      if (data.ingredients && data.ingredients.length > 0) {
        setIngredients(data.ingredients.map(ing => ({
          ingredient_name: ing.ingredient_name,
          quantity: ing.quantity || ''
        })))
      }
    } catch (err) {
      setError('Failed to load recipe')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setRecipe({ ...recipe, [name]: value })
  }

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients]
    updated[index][field] = value
    setIngredients(updated)
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredient_name: '', quantity: '' }])
  }

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!recipe.name.trim()) {
      setError('Recipe name is required')
      return
    }

    const validIngredients = ingredients.filter((ing) => ing.ingredient_name.trim())

    try {
      const response = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...recipe,
          cook_time: recipe.cook_time ? parseInt(recipe.cook_time) : null,
          serving_size: recipe.serving_size ? parseInt(recipe.serving_size) : null,
          ingredients: validIngredients
        })
      })

      if (response.ok) {
        navigate('/')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update recipe')
      }
    } catch (err) {
      setError('Failed to update recipe')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe? This cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        navigate('/')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete recipe')
      }
    } catch (err) {
      setError('Failed to delete recipe')
    }
  }

  if (loading) {
    return <div className="add-recipe"><div className="loading">Loading recipe...</div></div>
  }

  return (
    <div className="add-recipe">
      <div className="add-recipe-form">
        <div className="edit-header">
          <h1>Edit Recipe</h1>
          <Link to="/" className="back-link">Back to Recipes</Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Recipe Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="meal_type">Meal Type</label>
            <select id="meal_type" name="meal_type" value={recipe.meal_type} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cuisine">Cuisine</label>
            <input
              type="text"
              id="cuisine"
              name="cuisine"
              value={recipe.cuisine}
              onChange={handleChange}
              placeholder="e.g., Italian, Asian"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dish_type">Dish Type</label>
            <input
              type="text"
              id="dish_type"
              name="dish_type"
              value={recipe.dish_type}
              onChange={handleChange}
              placeholder="e.g., pasta, salad"
            />
          </div>

          <div className="form-group">
            <label htmlFor="protein_type">Protein Type</label>
            <select id="protein_type" name="protein_type" value={recipe.protein_type} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="chicken">Chicken</option>
              <option value="beef">Beef</option>
              <option value="pork">Pork</option>
              <option value="fish">Fish</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cooking_method">Cooking Method</label>
            <select id="cooking_method" name="cooking_method" value={recipe.cooking_method} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="stovetop">Stovetop</option>
              <option value="oven">Oven</option>
              <option value="air-fryer">Air Fryer</option>
              <option value="microwave">Microwave</option>
              <option value="slow-cooker">Slow Cooker</option>
              <option value="none">No Cooking</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cook_time">Cook Time (minutes)</label>
            <input
              type="number"
              id="cook_time"
              name="cook_time"
              value={recipe.cook_time}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="serving_size">Serving Size</label>
            <input
              type="number"
              id="serving_size"
              name="serving_size"
              value={recipe.serving_size}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          {ingredients.map((ing, index) => (
            <div key={index} className="ingredient-row">
              <input
                type="text"
                placeholder="Ingredient name"
                value={ing.ingredient_name}
                onChange={(e) => handleIngredientChange(index, 'ingredient_name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Quantity"
                value={ing.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
              />
              <button type="button" onClick={() => removeIngredient(index)} className="remove-btn">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addIngredient} className="add-ingredient-btn">
            + Add Ingredient
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
            rows="6"
            placeholder="Enter cooking instructions..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">Save Changes</button>
          <button type="button" onClick={handleDelete} className="delete-btn">Delete Recipe</button>
        </div>
        </form>
      </div>
    </div>
  )
}

export default EditRecipe
