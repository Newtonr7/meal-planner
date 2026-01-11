import { useState, useEffect } from 'react'
import GroceryItem from '../components/GroceryItem'
import './GroceryList.css'

const API_URL = 'http://localhost:3000/api'

function getWeekStart(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

function GroceryList() {
  const [weekStart, setWeekStart] = useState(getWeekStart())
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState({ name: '', quantity: '' })

  useEffect(() => {
    fetchGroceryList()
  }, [weekStart])

  const fetchGroceryList = async () => {
    try {
      const response = await fetch(`${API_URL}/grocery-list?week_start=${weekStart}`)
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Error fetching grocery list:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateList = async () => {
    try {
      await fetch(`${API_URL}/grocery-list/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ week_start: weekStart })
      })
      fetchGroceryList()
    } catch (error) {
      console.error('Error generating list:', error)
    }
  }

  const addItem = async (e) => {
    e.preventDefault()
    if (!newItem.name.trim()) return

    try {
      await fetch(`${API_URL}/grocery-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: newItem.name,
          quantity: newItem.quantity,
          week_start_date: weekStart
        })
      })
      setNewItem({ name: '', quantity: '' })
      fetchGroceryList()
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const toggleItem = async (id, currentState) => {
    try {
      await fetch(`${API_URL}/grocery-list/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_checked: !currentState })
      })
      fetchGroceryList()
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const deleteItem = async (id) => {
    try {
      await fetch(`${API_URL}/grocery-list/${id}`, { method: 'DELETE' })
      fetchGroceryList()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const changeWeek = (direction) => {
    const current = new Date(weekStart)
    current.setDate(current.getDate() + (direction * 7))
    setWeekStart(current.toISOString().split('T')[0])
  }

  return (
    <div className="grocery-list-page">
      <div className="grocery-header">
        <h1>Grocery List</h1>
        <div className="week-navigation">
          <button onClick={() => changeWeek(-1)}>Previous Week</button>
          <span className="current-week">Week of {weekStart}</span>
          <button onClick={() => changeWeek(1)}>Next Week</button>
        </div>
      </div>

      <div className="grocery-actions">
        <button onClick={generateList} className="generate-btn">
          Generate from Meal Plan
        </button>
      </div>

      <form onSubmit={addItem} className="add-item-form">
        <input
          type="text"
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <button type="submit">Add Item</button>
      </form>

      {loading ? (
        <div className="loading">Loading grocery list...</div>
      ) : (
        <ul className="grocery-items">
          {items.length === 0 ? (
            <p className="empty-list">No items yet. Generate from meal plan or add items manually.</p>
          ) : (
            items.map((item) => (
              <GroceryItem
                key={item.id}
                item={item}
                onToggle={toggleItem}
                onDelete={deleteItem}
              />
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export default GroceryList
