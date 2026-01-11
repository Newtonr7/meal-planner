import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">Meal Planner</NavLink>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end>Recipes</NavLink>
        </li>
        <li>
          <NavLink to="/meal-planner">Meal Plan</NavLink>
        </li>
        <li>
          <NavLink to="/grocery-list">Grocery List</NavLink>
        </li>
        <li>
          <NavLink to="/add-recipe">Add Recipe</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
