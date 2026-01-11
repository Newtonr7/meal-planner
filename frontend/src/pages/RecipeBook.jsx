import { useState, useEffect } from 'react'
import './RecipeBook.css'

const API_URL = 'http://localhost:3000/api'

function RecipeBook() {
  const [recipes, setRecipes] = useState([])
  const [allRecipes, setAllRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0) // 0 = index, 1+ = recipes
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    meal_type: '',
    cuisine: '',
    protein_type: '',
    cooking_method: ''
  })

  useEffect(() => {
    fetchAllRecipes()
  }, [])

  useEffect(() => {
    filterRecipes()
  }, [filters, allRecipes])

  const fetchAllRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/recipes`)
      const data = await response.json()
      setAllRecipes(data)
      setRecipes(data)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecipeDetails = async (id) => {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}`)
      const data = await response.json()
      setSelectedRecipe(data)
    } catch (error) {
      console.error('Error fetching recipe:', error)
    }
  }

  const filterRecipes = () => {
    let filtered = [...allRecipes]

    if (filters.search) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    if (filters.meal_type) {
      filtered = filtered.filter(r => r.meal_type === filters.meal_type)
    }
    if (filters.cuisine) {
      filtered = filtered.filter(r => r.cuisine === filters.cuisine)
    }
    if (filters.protein_type) {
      filtered = filtered.filter(r => r.protein_type === filters.protein_type)
    }
    if (filters.cooking_method) {
      filtered = filtered.filter(r => r.cooking_method === filters.cooking_method)
    }

    setRecipes(filtered)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      meal_type: '',
      cuisine: '',
      protein_type: '',
      cooking_method: ''
    })
  }

  const goToRecipe = async (recipe, index) => {
    await fetchRecipeDetails(recipe.id)
    setCurrentPage(index + 1)
  }

  const goToIndex = () => {
    setCurrentPage(0)
    setSelectedRecipe(null)
  }

  const nextPage = async () => {
    if (currentPage < recipes.length) {
      const nextRecipe = recipes[currentPage]
      await fetchRecipeDetails(nextRecipe.id)
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = async () => {
    if (currentPage > 1) {
      const prevRecipe = recipes[currentPage - 2]
      await fetchRecipeDetails(prevRecipe.id)
      setCurrentPage(currentPage - 1)
    } else if (currentPage === 1) {
      goToIndex()
    }
  }

  if (loading) {
    return (
      <div className="book-container">
        <div className="book">
          <div className="book-page">
            <div className="page-content loading-page">
              Loading recipes...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="book-container">
      <div className="book">
        {/* Book Spine */}
        <div className="book-spine">
          <span>Recipe Book</span>
        </div>

        {/* Left Page */}
        <div className="book-page left-page">
          {currentPage === 0 ? (
            <div className="page-content index-page">
              <div className="page-header">
                <h1>Recipe Index</h1>
                <div className="decorative-line"></div>
              </div>

              <div className="search-section">
                <input
                  type="text"
                  name="search"
                  placeholder="Search recipes..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="book-search"
                />
              </div>

              <div className="filter-section">
                <select name="meal_type" value={filters.meal_type} onChange={handleFilterChange}>
                  <option value="">All Meals</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>

                <select name="cuisine" value={filters.cuisine} onChange={handleFilterChange}>
                  <option value="">All Cuisines</option>
                  <option value="Italian">Italian</option>
                  <option value="Asian">Asian</option>
                  <option value="American">American</option>
                  <option value="Mexican">Mexican</option>
                </select>

                <select name="protein_type" value={filters.protein_type} onChange={handleFilterChange}>
                  <option value="">All Proteins</option>
                  <option value="chicken">Chicken</option>
                  <option value="beef">Beef</option>
                  <option value="pork">Pork</option>
                  <option value="fish">Fish</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>

                <button onClick={clearFilters} className="clear-btn">Clear</button>
              </div>

              <div className="index-list">
                {recipes.length === 0 ? (
                  <p className="no-results">No recipes found</p>
                ) : (
                  recipes.map((recipe, index) => (
                    <div
                      key={recipe.id}
                      className="index-item"
                      onClick={() => goToRecipe(recipe, index)}
                    >
                      <span className="recipe-title">{recipe.name}</span>
                      <span className="dotted-line"></span>
                      <span className="page-num">{index + 1}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="page-footer">
                <span className="page-number">Index</span>
              </div>
            </div>
          ) : (
            <div className="page-content recipe-page">
              {selectedRecipe && (
                <>
                  <div className="page-header">
                    <h1>{selectedRecipe.name}</h1>
                    <div className="decorative-line"></div>
                  </div>

                  <div className="recipe-meta">
                    <span>{selectedRecipe.cuisine}</span>
                    <span>{selectedRecipe.meal_type}</span>
                    <span>{selectedRecipe.cook_time} min</span>
                    <span>Serves {selectedRecipe.serving_size}</span>
                  </div>

                  <div className="ingredients-section">
                    <h2>Ingredients</h2>
                    <ul>
                      {selectedRecipe.ingredients?.map((ing) => (
                        <li key={ing.id}>
                          <strong>{ing.quantity}</strong> {ing.ingredient_name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="page-footer">
                    <span className="page-number">{currentPage}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Page */}
        <div className="book-page right-page">
          {currentPage === 0 ? (
            <div className="page-content intro-page">
              <div className="book-illustration">
                <div className="illustration-content">
                  <div className="chef-hat"></div>
                  <p className="intro-text">
                    Welcome to your personal recipe collection.
                    Browse through the index to find your favorite dishes,
                    or use the filters to discover something new.
                  </p>
                  <p className="recipe-count">{allRecipes.length} recipes</p>
                </div>
              </div>
              <div className="page-footer">
                <span className="page-number"></span>
              </div>
            </div>
          ) : (
            <div className="page-content recipe-page">
              {selectedRecipe && (
                <>
                  <div className="instructions-section">
                    <h2>Instructions</h2>
                    <div className="instructions-text">
                      {selectedRecipe.instructions?.split('\n').map((step, index) => (
                        <p key={index}>{step}</p>
                      ))}
                    </div>
                  </div>

                  <div className="recipe-tags">
                    <span className="tag">{selectedRecipe.cooking_method}</span>
                    <span className="tag">{selectedRecipe.protein_type}</span>
                    {selectedRecipe.dish_type && (
                      <span className="tag">{selectedRecipe.dish_type}</span>
                    )}
                  </div>

                  <div className="page-footer">
                    <span className="page-number">{currentPage}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="book-navigation">
          <button
            className="nav-btn prev-btn"
            onClick={prevPage}
            disabled={currentPage === 0}
          >
            Previous
          </button>

          <button className="nav-btn index-btn" onClick={goToIndex}>
            Index
          </button>

          <button
            className="nav-btn next-btn"
            onClick={nextPage}
            disabled={currentPage === 0 || currentPage >= recipes.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecipeBook
