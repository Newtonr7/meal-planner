import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">
          <span className="brand-text">Meal Planner</span>
        </NavLink>
      </div>

      <ul className="navbar-links">
        <li>
          <NavLink to="/" end>
            <span className="nav-text">Recipes</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/meal-planner">
            <span className="nav-text">Planner</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/grocery-list">
            <span className="nav-text">Shop</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-recipe">
            <span className="nav-text">Create</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
