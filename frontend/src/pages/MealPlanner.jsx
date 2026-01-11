import { useState, useEffect } from 'react'
import MealPlanDay from '../components/MealPlanDay'
import './MealPlanner.css'

const API_URL = 'http://localhost:3000/api'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_EMOJIS = ['🌙', '🔥', '💧', '🌿', '⚡', '🪐', '☀️']
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner']
const MEAL_EMOJIS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙' }

function getWeekStart(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

function MealPlanner() {
  const [weekStart, setWeekStart] = useState(getWeekStart())
  const [mealPlan, setMealPlan] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMealPlan()
  }, [weekStart])

  const fetchMealPlan = async () => {
    try {
      const response = await fetch(`${API_URL}/meal-plan?week_start=${weekStart}`)
      const data = await response.json()
      setMealPlan(data)
    } catch (error) {
      console.error('Error fetching meal plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMeal = async (mealId) => {
    try {
      await fetch(`${API_URL}/meal-plan/${mealId}`, { method: 'DELETE' })
      fetchMealPlan()
    } catch (error) {
      console.error('Error removing meal:', error)
    }
  }

  const getMealForSlot = (day, mealType) => {
    return mealPlan.find(
      (meal) => meal.day_of_week === day && meal.meal_type === mealType
    )
  }

  const changeWeek = (direction) => {
    const current = new Date(weekStart)
    current.setDate(current.getDate() + (direction * 7))
    setWeekStart(current.toISOString().split('T')[0])
  }

  const filledSlots = mealPlan.length
  const totalSlots = DAYS.length * MEAL_TYPES.length

  return (
    <div className="meal-planner">
      {/* Floating food decorations */}
      <div className="planner-decorations">
        <span className="decoration" style={{ top: '10%', left: '5%' }}>🥐</span>
        <span className="decoration" style={{ top: '30%', right: '3%' }}>🍳</span>
        <span className="decoration" style={{ bottom: '20%', left: '8%' }}>🥗</span>
        <span className="decoration" style={{ bottom: '10%', right: '5%' }}>🍝</span>
      </div>

      <div className="planner-container">
        {/* Header */}
        <div className="planner-header">
          <div className="header-left">
            <h1 className="planner-title">
              <span className="title-icon">📅</span>
              Meal Quest Planner
            </h1>
            <div className="progress-display">
              <span className="progress-label">MEALS PLANNED:</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(filledSlots / totalSlots) * 100}%` }}
                ></div>
              </div>
              <span className="progress-value">{filledSlots}/{totalSlots}</span>
            </div>
          </div>

          <div className="week-navigation">
            <button onClick={() => changeWeek(-1)} className="nav-btn">
              <span>◀</span> PREV
            </button>
            <div className="current-week">
              <span className="week-icon">📆</span>
              <span className="week-text">{weekStart}</span>
            </div>
            <button onClick={() => changeWeek(1)} className="nav-btn">
              NEXT <span>▶</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <span className="loading-icon">🍳</span>
            <p>Loading meal plan...</p>
          </div>
        ) : (
          <div className="calendar-board">
            {/* Calendar Header */}
            <div className="calendar-header">
              <div className="calendar-corner">
                <span>🗓️</span>
              </div>
              {DAYS.map((day, idx) => (
                <div key={day} className="day-header">
                  <span className="day-emoji">{DAY_EMOJIS[idx]}</span>
                  <span className="day-name">{day.slice(0, 3)}</span>
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="calendar-body">
              {MEAL_TYPES.map((mealType) => (
                <div key={mealType} className="calendar-row">
                  <div className="meal-type-label">
                    <span className="meal-emoji">{MEAL_EMOJIS[mealType]}</span>
                    <span className="meal-name">{mealType}</span>
                  </div>
                  {DAYS.map((day) => (
                    <MealPlanDay
                      key={`${day}-${mealType}`}
                      day={day}
                      mealType={mealType}
                      meal={getMealForSlot(day, mealType)}
                      onRemove={handleRemoveMeal}
                      weekStart={weekStart}
                      onMealAdded={fetchMealPlan}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MealPlanner
