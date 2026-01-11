import './GroceryItem.css'

function GroceryItem({ item, onToggle, onDelete }) {
  return (
    <li className={`grocery-item ${item.is_checked ? 'checked' : ''}`}>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={item.is_checked}
          onChange={() => onToggle(item.id, item.is_checked)}
        />
        <span className="item-name">{item.item_name}</span>
        {item.quantity && <span className="item-quantity">{item.quantity}</span>}
      </label>
      <button onClick={() => onDelete(item.id)} className="delete-btn">
        Delete
      </button>
    </li>
  )
}

export default GroceryItem
