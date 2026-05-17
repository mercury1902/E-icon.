import React, { useState, useRef, useEffect } from 'react';
import './Header.css';

const tags = [
  { id: 'all', label: 'All' },
  { id: 'mentalhealth', label: '#mentalhealth' },
  { id: 'hope', label: '#hope' },
  { id: 'gratitude', label: '#gratitude' },
  { id: 'selfcare', label: '#selfcare' },
  { id: 'growth', label: '#growth' },
  { id: 'vent', label: '#vent' },
];

export default function Header({
  searchQuery,
  onSearchChange,
  tagFilter,
  onTagFilterChange,
  onToggleLeft,
  onToggleRight,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`site-header${scrolled ? ' scrolled' : ''}`}
      role="banner"
    >
      <div className="header-inner">
        <button
          className="hamburger-btn"
          onClick={onToggleLeft}
          aria-label="Toggle navigation menu"
          title="Menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <a href="/" className="logo" aria-label="Murmur home">
          <span className="logo-icon" aria-hidden="true">M</span>
          <span className="logo-text">Murmur</span>
        </a>

        <div
          className={`search-wrapper${searchFocused ? ' focused' : ''}`}
          role="search"
          ref={searchRef}
        >
          <label htmlFor="search-input" className="sr-only">
            Search murmurs
          </label>
          <input
            id="search-input"
            type="search"
            placeholder="Search murmurs..."
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            aria-controls="search-tags-panel"
          />
          <span className="search-icon" aria-hidden="true">&#x1F50D;</span>
          <div
            className="search-tags"
            id="search-tags-panel"
            role="listbox"
            aria-label="Filter by tag"
          >
            {tags.map((t) => (
              <button
                key={t.id}
                className={`tag-filter${tagFilter === t.id ? ' active' : ''}`}
                role="option"
                aria-selected={tagFilter === t.id}
                onClick={() => onTagFilterChange(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="header-actions">
          <button
            className="icon-btn sidebar-toggle-btn"
            onClick={onToggleRight}
            aria-label="Toggle community sidebar"
            title="Community sidebar"
          >
            <span aria-hidden="true">&#x1F4AC;</span>
          </button>
          <button
            className="icon-btn"
            aria-label="Notifications"
            title="Notifications"
          >
            <span aria-hidden="true">&#x1F514;</span>
            <span className="badge" aria-label="Unread notifications" />
          </button>
          <button
            className="avatar-btn"
            aria-label="Your anonymous profile"
            title="Anonymous Profile"
          >
            M
          </button>
        </div>
      </div>
    </header>
  );
}
