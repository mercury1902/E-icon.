import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ParallelProvider } from './features/parallel/ParallelContext';
import { FacebookEmoji } from './utils/emojiHelper';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Navbar from './features/shared/Navbar';
import FeedPage from './features/feed/FeedPage';
import StoryPage from './features/stories/StoryPage';
import ProfilePage from './features/profile/ProfilePage';
import CreateStory from './features/stories/CreateStory';
import ParallelMatchingPrefs from './features/parallel/ParallelMatchingPrefs';
import ParallelBoard from './features/parallel/ParallelBoard';
import EmotionCheckIn from './components/EmotionCheckIn/EmotionCheckIn';
import PostComposer from './components/PostComposer/PostComposer';
import Feed from './components/Feed/Feed';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import RightSidebar from './components/RightSidebar/RightSidebar';
import Toast from './components/Toast/Toast';
import AdminDashboard from './components/Admin/AdminDashboard';
import { navItems } from './data/sidebarData';
import { getPosts, createPost } from './services/posts';
import { saveMoodCheckin } from './services/mood';
import { isSupabaseConfigured } from './lib/supabaseClient';
import MissingConfig from './components/MissingConfig/MissingConfig';
import './App.css';

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

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = async (postData) => {
    try {
      const saved = await createPost({
        content: postData.content,
        tags: postData.tags,
        postPseudonym: postData.author,
        avatarColor: postData.avatarColor,
        emotionTag: postData.emotionTag,
      });
      setPosts((prev) => [saved, ...prev]);
      showToast('Your anonymous post is live. Stay safe. 💜');
    } catch {
      showToast('Failed to post. Please try again.');
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleEmotion = async (emotion) => {
    if (emotion) {
      setEmotionHistory((prev) =>
        [...prev, { emotion, timestamp: Date.now() }].slice(-14)
      );
      try {
        await saveMoodCheckin(emotion);
      } catch {
        // silent fail
      }
    }
  };

  const filteredPosts = posts.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const content = p.content || '';
    const tags = p.tags || [];
    const matchesSearch =
      !q ||
      content.toLowerCase().includes(q) ||
      tags.some((t) => t.toLowerCase().includes(q));
    const matchesTag =
      tagFilter === 'all' || tags.includes(tagFilter);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="app-wrapper">
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
              <FacebookEmoji emoji="🛡️" size={20} inline={true} />
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
          <Link
            key={item.id}
            to={item.path}
            className={`bottom-nav-item${activeNav === item.id ? ' active' : ''}`}
            onClick={() => setActiveNav(item.id)}
            aria-current={activeNav === item.id ? 'page' : undefined}
          >
            <span className="bottom-nav-icon" aria-hidden="true">
              <FacebookEmoji emoji={item.icon} size={18} inline={true} />
            </span>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        className="fab"
        onClick={() => setRightOpen((v) => !v)}
        aria-label="Open community sidebar"
        title="Community"
      >
        <FacebookEmoji emoji="💬" size={24} inline={true} />
      </button>

      <Toast message={toast} />
    </div>
  );
}

function FeatureRoutes() {
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [showParallelPrefs, setShowParallelPrefs] = useState(false);
  const [showParallelBoard, setShowParallelBoard] = useState(false);

  return (
    <AppProvider>
      <ParallelProvider>
        <Navbar
          onParallelClick={() => setShowParallelPrefs(true)}
          onBoardClick={() => setShowParallelBoard(true)}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stories" element={<FeedPage />} />
          <Route path="/story/:id" element={<StoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>

        {showCreateStory && <CreateStory onClose={() => setShowCreateStory(false)} />}
        {showParallelPrefs && (
          <ParallelMatchingPrefs onClose={() => setShowParallelPrefs(false)} />
        )}
        {showParallelBoard && <ParallelBoard onClose={() => setShowParallelBoard(false)} />}
      </ParallelProvider>
    </AppProvider>
  );
}

export default function App() {
  const isBypassed = localStorage.getItem('bypass_supabase_check') === 'true';

  if (!isSupabaseConfigured && !isBypassed) {
    return <MissingConfig />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/*" element={<FeatureRoutes />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
