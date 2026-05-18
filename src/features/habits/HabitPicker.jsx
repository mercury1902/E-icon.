import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import habitIcons from './habitIcons';

const categories = [
  { key: 'wellness', label: 'Wellness' },
  { key: 'self-care', label: 'Self-Care' },
  { key: 'bravery', label: 'Bravery' },
];

function HabitPicker({ onClose }) {
  const { habitCatalog, activeHabits, addHabit, removeHabit } = useApp();
  const [tab, setTab] = useState('wellness');

  const filtered = habitCatalog.filter((h) => h.category === tab);

  return (
    <div className="habit-picker-overlay" onClick={onClose}>
      <div className="habit-picker" onClick={(e) => e.stopPropagation()}>
        <div className="habit-picker-header">
          <span className="habit-picker-title">Add Habits</span>
          <button className="habit-picker-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="habit-picker-tabs">
          {categories.map((c) => (
            <button
              key={c.key}
              className={`habit-picker-tab ${tab === c.key ? 'active' : ''}`}
              onClick={() => setTab(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="habit-picker-list">
          {filtered.map((h) => {
            const isActive = activeHabits.includes(h.id);
            return (
              <div key={h.id} className={`habit-picker-item ${isActive ? 'added' : ''}`}>
                <span className="habit-picker-item-icon">{habitIcons[h.id]}</span>
                <span className="habit-picker-item-name">{h.name}</span>
                <button
                  className={`habit-picker-item-btn ${isActive ? 'remove' : 'add'}`}
                  onClick={() => isActive ? removeHabit(h.id) : addHabit(h.id)}
                >
                  {isActive ? 'Added' : 'Add'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HabitPicker;
