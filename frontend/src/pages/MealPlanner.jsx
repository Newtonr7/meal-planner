import { useState, useEffect } from 'react'
import MealPlanDay from '../components/MealPlanDay'
import { API_URL } from '../config'
import './MealPlanner.css'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function getWeekStart(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

function getMonthData(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  // Get the day of week for the first day (0 = Sunday, adjust for Monday start)
  let startDay = firstDay.getDay() - 1
  if (startDay < 0) startDay = 6

  const weeks = []
  let currentWeek = []

  // Add empty cells for days before the first of the month
  for (let i = 0; i < startDay; i++) {
    currentWeek.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  // Fill the last week with empty cells
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek)
  }

  return weeks
}

function MealPlanner() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(today)
  const [weekStart, setWeekStart] = useState(getWeekStart(today))
  const [mealPlan, setMealPlan] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('calendar') // 'calendar' or 'week'

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

  const changeMonth = (direction) => {
    let newMonth = currentMonth + direction
    let newYear = currentYear

    if (newMonth > 11) {
      newMonth = 0
      newYear++
    } else if (newMonth < 0) {
      newMonth = 11
      newYear--
    }

    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  const selectDay = (day) => {
    if (day) {
      const selected = new Date(currentYear, currentMonth, day)
      setSelectedDate(selected)
      setWeekStart(getWeekStart(selected))
      setView('week')
    }
  }

  const goToToday = () => {
    const now = new Date()
    setCurrentMonth(now.getMonth())
    setCurrentYear(now.getFullYear())
    setSelectedDate(now)
    setWeekStart(getWeekStart(now))
  }

  const isToday = (day) => {
    if (!day) return false
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
  }

  const isSelected = (day) => {
    if (!day) return false
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    )
  }

  const isInSelectedWeek = (day) => {
    if (!day) return false
    const date = new Date(currentYear, currentMonth, day)
    const weekStartDate = new Date(weekStart)
    const weekEndDate = new Date(weekStart)
    weekEndDate.setDate(weekEndDate.getDate() + 6)
    return date >= weekStartDate && date <= weekEndDate
  }

  const monthWeeks = getMonthData(currentYear, currentMonth)
  const filledSlots = mealPlan.length
  const totalSlots = DAYS.length * MEAL_TYPES.length

  const formatWeekRange = () => {
    const start = new Date(weekStart)
    const end = new Date(weekStart)
    end.setDate(end.getDate() + 6)

    const startStr = `${MONTH_NAMES[start.getMonth()].slice(0, 3)} ${start.getDate()}`
    const endStr = `${MONTH_NAMES[end.getMonth()].slice(0, 3)} ${end.getDate()}`

    return `${startStr} - ${endStr}, ${end.getFullYear()}`
  }

  return (
    <div className="meal-planner">
      <div className="planner-container">
        {/* Header */}
        <div className="planner-header">
          <div className="header-content">
            <h1 className="planner-title">Meal Planner</h1>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`}
                onClick={() => setView('calendar')}
              >
                Calendar
              </button>
              <button
                className={`toggle-btn ${view === 'week' ? 'active' : ''}`}
                onClick={() => setView('week')}
              >
                Week View
              </button>
            </div>
          </div>

          <div className="progress-section">
            <span className="progress-label">Weekly Progress</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(filledSlots / totalSlots) * 100}%` }}
              ></div>
            </div>
            <span className="progress-value">{filledSlots}/{totalSlots}</span>
          </div>
        </div>

        {view === 'calendar' ? (
          /* Calendar View */
          <div className="calendar-view">
            <div className="calendar-nav">
              <button onClick={() => changeMonth(-1)} className="nav-btn">
                Previous
              </button>
              <div className="month-display">
                <h2>{MONTH_NAMES[currentMonth]} {currentYear}</h2>
                <button onClick={goToToday} className="today-btn">Today</button>
              </div>
              <button onClick={() => changeMonth(1)} className="nav-btn">
                Next
              </button>
            </div>

            <div className="month-calendar">
              <div className="calendar-weekdays">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="weekday-label">{day}</div>
                ))}
              </div>

              <div className="calendar-days">
                {monthWeeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="calendar-week">
                    {week.map((day, dayIndex) => (
                      <button
                        key={dayIndex}
                        className={`calendar-day ${!day ? 'empty' : ''} ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''} ${isInSelectedWeek(day) ? 'in-week' : ''}`}
                        onClick={() => selectDay(day)}
                        disabled={!day}
                      >
                        {day || ''}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="calendar-hint">
              Select any day to view and plan that week's meals
            </div>
          </div>
        ) : (
          /* Week View */
          <div className="week-view">
            <div className="week-nav">
              <button
                onClick={() => {
                  const current = new Date(weekStart)
                  current.setDate(current.getDate() - 7)
                  setWeekStart(current.toISOString().split('T')[0])
                  setSelectedDate(current)
                }}
                className="nav-btn"
              >
                Previous Week
              </button>
              <div className="week-display">
                <h2>{formatWeekRange()}</h2>
              </div>
              <button
                onClick={() => {
                  const current = new Date(weekStart)
                  current.setDate(current.getDate() + 7)
                  setWeekStart(current.toISOString().split('T')[0])
                  setSelectedDate(current)
                }}
                className="nav-btn"
              >
                Next Week
              </button>
            </div>

            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading meal plan...</p>
              </div>
            ) : (
              <div className="week-grid">
                {/* Header Row */}
                <div className="grid-header">
                  <div className="grid-corner"></div>
                  {DAYS.map((day) => (
                    <div key={day} className="day-header">
                      <span className="day-name">{day}</span>
                    </div>
                  ))}
                </div>

                {/* Meal Rows */}
                {MEAL_TYPES.map((mealType) => (
                  <div key={mealType} className="grid-row">
                    <div className="meal-type-label">
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MealPlanner
