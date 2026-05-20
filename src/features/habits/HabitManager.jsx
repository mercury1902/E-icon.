import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import habitIcons from './habitIcons';

const EMOJIS = ['🚶', '🏋️', '🧘', '😴', '💧', '✍️', '📖', '🍳', '🧹', '📱', '🎯', '👍', '💬', '🧑', '🙏', '⭐', '🎨', '🎵', '🌱', '☀️', '📵', '🫂', '🧠', '🥗', '💪', '🧁', '🎮', '📝', '🎧', '🌿'];

function HabitManager({ onClose }) {
  const { userHabits, createHabit, updateHabit, deleteHabit } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: '', icon: '⭐' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const categories = useMemo(() => {
    const set = new Set(userHabits.map((h) => h.category).filter(Boolean));
    return [...set].sort();
  }, [userHabits]);

  const grouped = useMemo(() => {
    const map = {};
    for (const h of userHabits) {
      const cat = h.category || 'General';
      if (!map[cat]) map[cat] = [];
      map[cat].push(h);
    }
    return map;
  }, [userHabits]);

  const sortedCategories = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  function resetForm() {
    setForm({ name: '', description: '', category: '', icon: '⭐' });
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(h) {
    setForm({ name: h.name, description: h.description || '', category: h.category, icon: h.icon || '⭐' });
    setEditingId(h.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    if (editingId) {
      await updateHabit(editingId, { name: form.name, description: form.description, category: form.category, icon: form.icon });
    } else {
      await createHabit({ name: form.name, description: form.description, category: form.category, icon: form.icon });
    }
    resetForm();
  }

  async function handleDelete(id) {
    await deleteHabit(id);
    setConfirmDelete(null);
    if (editingId === id) resetForm();
  }

  return createPortal(
    <div className="habit-manager-overlay" onClick={onClose}>
      <div className="habit-manager" onClick={(e) => e.stopPropagation()}>
        <div className="habit-manager-header">
          <span className="habit-manager-title">My Habits</span>
          <div className="habit-manager-header-actions">
            <button className="habit-manager-add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Habit
            </button>
            <button className="habit-manager-close" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {showForm && (
          <div className="habit-manager-form">
            <div className="habit-manager-form-fields">
              <div className="habit-manager-emoji-row">
                <span className="habit-manager-emoji-preview">{form.icon}</span>
                <select
                  className="habit-manager-emoji-select"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                >
                  {EMOJIS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <input
                className="habit-manager-input"
                placeholder="Habit name *"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                autoFocus
              />
              <input
                className="habit-manager-input"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <div className="habit-manager-category-row">
                <input
                  className="habit-manager-input"
                  placeholder="Category (e.g. Fitness, Mindfulness)"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  list="category-suggestions"
                />
                <datalist id="category-suggestions">
                  {categories.map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>
            </div>
            <div className="habit-manager-form-actions">
              <button className="habit-manager-cancel" onClick={resetForm}>Cancel</button>
              <button className="habit-manager-save" onClick={handleSave} disabled={!form.name.trim()}>
                {editingId ? 'Save Changes' : 'Create Habit'}
              </button>
            </div>
          </div>
        )}

        <div className="habit-manager-list">
          {userHabits.length === 0 && !showForm && (
            <p className="habit-manager-empty">No habits yet. Create your first one!</p>
          )}
          {sortedCategories.map((cat) => (
            <div key={cat} className="habit-manager-category">
              <span className="habit-manager-category-label">{cat}</span>
              {grouped[cat].map((h) => (
                <div key={h.id} className="habit-manager-item">
                  <span className="habit-manager-item-icon">{habitIcons[h.id] || h.icon || '⭐'}</span>
                  <div className="habit-manager-item-info">
                    <span className="habit-manager-item-name">{h.name}</span>
                    {h.description && <span className="habit-manager-item-desc">{h.description}</span>}
                  </div>
                  <div className="habit-manager-item-actions">
                    <button className="habit-manager-item-btn edit" onClick={() => startEdit(h)} title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    {confirmDelete === h.id ? (
                      <div className="habit-manager-confirm-delete">
                        <button className="habit-manager-item-btn confirm" onClick={() => handleDelete(h.id)} title="Confirm delete">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                        <button className="habit-manager-item-btn cancel" onClick={() => setConfirmDelete(null)} title="Cancel">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button className="habit-manager-item-btn remove" onClick={() => setConfirmDelete(h.id)} title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default HabitManager;
