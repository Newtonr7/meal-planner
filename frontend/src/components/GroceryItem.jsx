import './GroceryItem.css'

function GroceryItem({ item, onToggle, onDelete }) {
  return (
    <li className={`grocery-item ${item.is_checked ? 'checked' : ''}`}>
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          checked={item.is_checked}
          onChange={() => onToggle(item.id, item.is_checked)}
        />
      </div>
      <label className="item-text" onClick={() => onToggle(item.id, item.is_checked)}>
        <span className="item-name">{item.item_name}</span>
        {item.quantity && <span className="item-quantity">{item.quantity}</span>}
      </label>
      <button onClick={() => onDelete(item.id)} className="delete-btn">
        &times;
      </button>
    </li>
  )
}

export default GroceryItem
