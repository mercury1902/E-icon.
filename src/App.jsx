import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import { AppProvider } from './context/AppContext';
import { ParallelProvider } from './features/parallel/ParallelContext';
import AdminDashboard from './components/Admin/AdminDashboard';
import AuthPage from './components/Auth/AuthPage';
import Header from './components/Header/Header';
import EmotionCheckIn from './components/EmotionCheckIn/EmotionCheckIn';
import PostComposer from './components/PostComposer/PostComposer';
import Feed from './components/Feed/Feed';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import RightSidebar from './components/RightSidebar/RightSidebar';
import Toast from './components/Toast/Toast';
import Navbar from './features/shared/Navbar';
import FeedPage from './features/feed/FeedPage';
import StoryPage from './features/stories/StoryPage';
import ProfilePage from './features/profile/ProfilePage';
import MoodCheckin from './features/mood/MoodCheckin';
import MoodCalendar from './features/mood/MoodCalendar';
import WeeklyHabitTracker from './features/habits/WeeklyHabitTracker';
import BreathingExercise from './features/wellbeing/BreathingExercise';
import DailyAffirmation from './features/wellbeing/DailyAffirmation';
import CreateStory from './features/stories/CreateStory';
import ParallelMatchingPrefs from './features/parallel/ParallelMatchingPrefs';
import ParallelBoard from './features/parallel/ParallelBoard';
import ParallelChat from './features/parallel/ParallelChat';
import { samplePosts } from './data/samplePosts';
import { navItems } from './data/sidebarData';
import './App.css';
import './features/shared/nav.css';
import './features/feed/feed.css';
import './features/stories/story.css';
import './features/stories/create.css';
import './features/profile/profile.css';
import './features/habits/habits.css';
import './features/wellbeing/wellbeing.css';
import './features/parallel/parallel.css';

function HomePage() {
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
    <>
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
    </>
  );
}

export default function App() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [chatThreadId, setChatThreadId] = useState(null);

  if (authLoading) {
    return (
      <div className="app-wrapper">
        <div className="auth-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B1121' }}>
          <div className="auth-loading">
            <div className="auth-logo">
              <span className="auth-logo-icon" aria-hidden="true">M</span>
              <span className="auth-logo-text">Murmur</span>
            </div>
            <div className="auth-spinner" aria-label="Loading..." />
          </div>
        </div>
      </div>
    );
  }

  if (window.location.pathname === '/admin') {
    return <AdminDashboard />;
  }

  if (!user && window.location.pathname === '/auth') {
    return <AuthPage />;
  }

  return (
    <AppProvider>
      <ParallelProvider>
        <Navbar
          onCreateClick={() => setShowCreate(true)}
          onParallelClick={() => setShowPrefs(true)}
          onBoardClick={() => setShowBoard(true)}
        />
        <main className="main-content" id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stories" element={<FeedPage />} />
            <Route path="/story/:id" element={<StoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/mood" element={<MoodCheckin />} />
            <Route path="/mood/calendar" element={<MoodCalendar />} />
            <Route path="/habits" element={<WeeklyHabitTracker />} />
            <Route path="/wellbeing/breathing" element={<BreathingExercise />} />
            <Route path="/wellbeing/affirmations" element={<DailyAffirmation />} />
          </Routes>
        </main>

        {showCreate && <CreateStory onClose={() => setShowCreate(false)} />}
        {showPrefs && (
          <ParallelMatchingPrefs onClose={() => setShowPrefs(false)} onMatched={setChatThreadId} />
        )}
        {showBoard && (
          <ParallelBoard onClose={() => setShowBoard(false)} onChat={setChatThreadId} />
        )}
        {chatThreadId && (
          <ParallelChat threadId={chatThreadId} onClose={() => setChatThreadId(null)} />
        )}
      </ParallelProvider>
    </AppProvider>
  );
}
