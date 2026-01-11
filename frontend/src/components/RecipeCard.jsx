import { Link } from 'react-router-dom'
import './RecipeCard.css'

function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card">
      <div className="recipe-card-content">
        <h3 className="recipe-name">{recipe.name}</h3>
        <div className="recipe-tags">
          <span className="tag">{recipe.meal_type}</span>
          <span className="tag">{recipe.cuisine}</span>
        </div>
        <div className="recipe-info">
          <span>{recipe.cook_time} min</span>
          <span>Serves {recipe.serving_size}</span>
        </div>
        <div className="recipe-meta-tags">
          <span className="meta-tag">{recipe.cooking_method}</span>
          <span className="meta-tag">{recipe.protein_type}</span>
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard
