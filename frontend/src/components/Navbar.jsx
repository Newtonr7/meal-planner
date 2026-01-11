import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      {/* Animated food icons in navbar */}
      <div className="navbar-food-icons">
        <span className="nav-food" style={{ animationDelay: '0s' }}>🍳</span>
        <span className="nav-food" style={{ animationDelay: '0.5s' }}>🥗</span>
        <span className="nav-food" style={{ animationDelay: '1s' }}>🍜</span>
      </div>

      <div className="navbar-brand">
        <NavLink to="/">
          <span className="brand-icon">🎮</span>
          <span className="brand-text">
            <span className="text-cyan">Meal</span>
            <span className="text-pink">Quest</span>
          </span>
        </NavLink>
      </div>

      <ul className="navbar-links">
        <li>
          <NavLink to="/" end>
            <span className="nav-icon">📖</span>
            <span className="nav-text">Recipes</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/meal-planner">
            <span className="nav-icon">📅</span>
            <span className="nav-text">Planner</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/grocery-list">
            <span className="nav-icon">🛒</span>
            <span className="nav-text">Shop</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-recipe">
            <span className="nav-icon">✨</span>
            <span className="nav-text">Create</span>
          </NavLink>
        </li>
      </ul>

      {/* Animated pixel border */}
      <div className="navbar-border"></div>
    </nav>
  )
}

export default Navbar
