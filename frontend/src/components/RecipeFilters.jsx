import './RecipeFilters.css'

function RecipeFilters({ filters, onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onFilterChange({ ...filters, [name]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      search: '',
      meal_type: '',
      cuisine: '',
      protein_type: '',
      cooking_method: ''
    })
  }

  return (
    <div className="recipe-filters">
      <div className="search-box">
        <input
          type="text"
          name="search"
          placeholder="Search recipes..."
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      <div className="filter-row">
        <select name="meal_type" value={filters.meal_type} onChange={handleChange}>
          <option value="">All Meal Types</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>

        <select name="cuisine" value={filters.cuisine} onChange={handleChange}>
          <option value="">All Cuisines</option>
          <option value="Italian">Italian</option>
          <option value="Asian">Asian</option>
          <option value="American">American</option>
          <option value="Mexican">Mexican</option>
        </select>

        <select name="protein_type" value={filters.protein_type} onChange={handleChange}>
          <option value="">All Proteins</option>
          <option value="chicken">Chicken</option>
          <option value="beef">Beef</option>
          <option value="pork">Pork</option>
          <option value="fish">Fish</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>

        <select name="cooking_method" value={filters.cooking_method} onChange={handleChange}>
          <option value="">All Methods</option>
          <option value="stovetop">Stovetop</option>
          <option value="oven">Oven</option>
          <option value="air-fryer">Air Fryer</option>
          <option value="microwave">Microwave</option>
          <option value="slow-cooker">Slow Cooker</option>
        </select>

        <button onClick={clearFilters} className="clear-btn">Clear</button>
      </div>
    </div>
  )
}

export default RecipeFilters
