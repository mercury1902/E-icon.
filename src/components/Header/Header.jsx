import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

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

        <Link to="/" className="logo" aria-label="Murmur home">
          <span className="logo-icon" aria-hidden="true">M</span>
          <span className="logo-text">Murmur</span>
        </Link>

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
          <span className="search-icon" aria-hidden="true">{'\u{1F50D}'}</span>
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
            <span aria-hidden="true">{'\u{1F4AC}'}</span>
          </button>

          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="icon-btn admin-icon-btn" title="Admin Dashboard">
                  <span aria-hidden="true">{'\u{1F6E1}\u{FE0F}'}</span>
                </Link>
              )}
              <button
                className="icon-btn"
                onClick={signOut}
                aria-label="Sign out"
                title="Sign out"
              >
                <span aria-hidden="true">{'\u{1F6AA}'}</span>
              </button>
              <div
                className="avatar-btn"
                aria-label={`Signed in as ${profile?.username || user.email}`}
                title={profile?.username || 'User'}
              >
                {(profile?.username || 'U').charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="header-auth-btn">Sign In</Link>
              <Link to="/signup" className="header-auth-btn header-auth-btn-primary">Join</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
