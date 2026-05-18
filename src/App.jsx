import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './features/shared/Navbar';
import CreateStory from './features/stories/CreateStory';
import FeedPage from './features/feed/FeedPage';
import StoryPage from './features/stories/StoryPage';
import ProfilePage from './features/profile/ProfilePage';
import { ParallelProvider } from './features/parallel/ParallelContext';
import ParallelMatchingPrefs from './features/parallel/ParallelMatchingPrefs';
import ParallelBoard from './features/parallel/ParallelBoard';
import ParallelChat from './features/parallel/ParallelChat';
import './features/shared/nav.css';
import './features/feed/feed.css';
import './features/stories/story.css';
import './features/stories/create.css';
import './features/profile/profile.css';
import './features/habits/habits.css';
import './features/wellbeing/wellbeing.css';
import './features/parallel/parallel.css';

function App() {
  const [showCreate, setShowCreate] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [chatThreadId, setChatThreadId] = useState(null);

  return (
    <ParallelProvider>
      <Navbar
        onCreateClick={() => setShowCreate(true)}
        onParallelClick={() => setShowPrefs(true)}
        onBoardClick={() => setShowBoard(true)}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/story/:id" element={<StoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      {showCreate && <CreateStory onClose={() => setShowCreate(false)} />}

      {showPrefs && (
        <ParallelMatchingPrefs
          onClose={() => setShowPrefs(false)}
        />
      )}

      {showBoard && (
        <ParallelBoard onClose={() => setShowBoard(false)} />
      )}

      {chatThreadId && (
        <ParallelChat
          threadId={chatThreadId}
          onClose={() => setChatThreadId(null)}
        />
      )}
    </ParallelProvider>
  );
}

export default App;
