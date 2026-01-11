import { useState, useEffect } from 'react'
import MealPlanDay from '../components/MealPlanDay'
import './MealPlanner.css'

const API_URL = 'http://localhost:3000/api'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner']

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

  return (
    <div className="meal-planner">
      <div className="planner-header">
        <h1>Meal Planner</h1>
        <div className="week-navigation">
          <button onClick={() => changeWeek(-1)}>Previous Week</button>
          <span className="current-week">Week of {weekStart}</span>
          <button onClick={() => changeWeek(1)}>Next Week</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading meal plan...</div>
      ) : (
        <div className="planner-grid">
          <div className="planner-header-row">
            <div className="meal-type-label"></div>
            {DAYS.map((day) => (
              <div key={day} className="day-header">{day}</div>
            ))}
          </div>

          {MEAL_TYPES.map((mealType) => (
            <div key={mealType} className="planner-row">
              <div className="meal-type-label">{mealType}</div>
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
      )}
    </div>
  )
}

export default MealPlanner
