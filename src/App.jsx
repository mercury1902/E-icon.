import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import EmotionCheckIn from './components/EmotionCheckIn/EmotionCheckIn';
import PostComposer from './components/PostComposer/PostComposer';
import Feed from './components/Feed/Feed';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import RightSidebar from './components/RightSidebar/RightSidebar';
import Toast from './components/Toast/Toast';
import { samplePosts } from './data/samplePosts';
import { navItems } from './data/sidebarData';
import './App.css';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [activeNav, setActiveNav] = useState('home');
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(samplePosts);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const addPost = (postData) => {
    setPosts((prev) => [{ id: `post-${Date.now()}`, ...postData }, ...prev]);
    showToast('Your anonymous post is live. Stay safe. \u{1F49C}');
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleEmotion = (emotion) => {
    if (emotion) {
      setEmotionHistory((prev) =>
        [...prev, { emotion, timestamp: Date.now() }].slice(-14)
      );
    }
  };

  const filteredPosts = posts.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.content.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t) => t.includes(q)));
    const matchesTag =
      tagFilter === 'all' || (p.tags && p.tags.includes(tagFilter));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="app-wrapper">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tagFilter={tagFilter}
        onTagFilterChange={setTagFilter}
        onToggleLeft={() => setLeftOpen((v) => !v)}
        onToggleRight={() => setRightOpen((v) => !v)}
      />

      <div className="app-body">
        <div className="left-sidebar-col">
          <div className={`left-sidebar-inner${leftOpen ? ' open' : ''}`}>
            <LeftSidebar
              activeNav={activeNav}
              onNavChange={setActiveNav}
              emotionHistory={emotionHistory}
              showToast={showToast}
            />
          </div>
          {leftOpen && (
            <div
              className="drawer-overlay"
              onClick={() => setLeftOpen(false)}
              aria-hidden="true"
            />
          )}
        </div>

        <main className="main-content" id="main-content">
          <div className="privacy-banner animate-in" role="status">
            <span className="shield-icon" aria-hidden="true">
              {'\u{1F6E1}\u{FE0F}'}
            </span>
            <p>
              <strong>Your identity is protected.</strong> No personal data is
              stored. Each post generates a temporary anonymous name.{' '}
              <span className="privacy-sub">
                Not even we know who you are.
              </span>
            </p>
          </div>
          <EmotionCheckIn showToast={showToast} onEmotionChange={handleEmotion} />
          <PostComposer onPost={addPost} />
          <Feed posts={filteredPosts} loading={loading} />
        </main>

        <div className="right-sidebar-col">
          <div className={`right-sidebar-inner${rightOpen ? ' open' : ''}`}>
            <RightSidebar showToast={showToast} />
          </div>
          {rightOpen && (
            <div
              className="drawer-overlay"
              onClick={() => setRightOpen(false)}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`bottom-nav-item${activeNav === item.id ? ' active' : ''}`}
            onClick={() => setActiveNav(item.id)}
            aria-current={activeNav === item.id ? 'page' : undefined}
          >
            <span className="bottom-nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        className="fab"
        onClick={() => setRightOpen((v) => !v)}
        aria-label="Open community sidebar"
        title="Community"
      >
        {'\u{1F4AC}'}
      </button>

      <Toast message={toast} />
    </div>
  );
}
