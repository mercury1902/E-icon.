import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useParallel } from '../parallel/ParallelContext';
import ProfileHeader from './ProfileHeader';
import StoryCard from '../feed/StoryCard';
import HabitProgress from '../habits/HabitProgress';
import AutoTrackerChart from '../habits/AutoTrackerChart';
import MoodCalendar from '../mood/MoodCalendar';
import ParallelHistory from '../parallel/ParallelHistory';

function ProfilePage() {
  const { user, setUser, getUserStories, getSavedStoriesList, badgeDefs } = useApp();
  const { getConnectionCount } = useParallel();
  const [tab, setTab] = useState('my');
  const myStories = getUserStories();
  const savedStories = getSavedStoriesList();

  return (
    <div className="profile-page">
      <ProfileHeader user={user} onSave={setUser} />
      <div className="profile-body">
        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-value">{user.storyCount}</span>
            <span className="stat-label">Stories</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user.totalHearts}</span>
            <span className="stat-label">Hearts</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user.totalRelates}</span>
            <span className="stat-label">Relates</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user.peopleHelped}</span>
            <span className="stat-label">Helped</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{getConnectionCount()}</span>
            <span className="stat-label">Connections</span>
          </div>
        </div>

        <div className="profile-badges">
          <h2>Badges <span className="count">{user.badges.length} / {badgeDefs.length}</span></h2>
          <div className="badges-grid">
            {badgeDefs
              .filter((badge) => user.badges.includes(badge.id))
              .map((badge) => (
                <div key={badge.id} className="badge-card earned">
                  <span className="badge-icon">{badge.icon}</span>
                  <span className="badge-name">{badge.name}</span>
                  <span className="badge-desc">{badge.description}</span>
                </div>
              ))}
          </div>
          {badgeDefs.length - user.badges.length > 0 && (
            <p className="badges-hidden-hint">
              {badgeDefs.length - user.badges.length} hidden {badgeDefs.length - user.badges.length === 1 ? 'achievement' : 'achievements'} yet to discover
            </p>
          )}
        </div>

        <div className="profile-tabs">
          <button
            className={`profile-tab ${tab === 'my' ? 'active' : ''}`}
            onClick={() => setTab('my')}
          >
            My Stories ({myStories.length})
          </button>
          <button
            className={`profile-tab ${tab === 'saved' ? 'active' : ''}`}
            onClick={() => setTab('saved')}
          >
            Saved ({savedStories.length})
          </button>
          <button
            className={`profile-tab ${tab === 'mood' ? 'active' : ''}`}
            onClick={() => setTab('mood')}
          >
            Mood
          </button>
          <button
            className={`profile-tab ${tab === 'habits' ? 'active' : ''}`}
            onClick={() => setTab('habits')}
          >
            Habits
          </button>
          <button
            className={`profile-tab ${tab === 'parallel' ? 'active' : ''}`}
            onClick={() => setTab('parallel')}
          >
            Parallel
          </button>
        </div>

        {tab === 'my' && (
          <div className="profile-stories">
            {myStories.length === 0 ? (
              <p className="empty-state">You haven&apos;t shared any stories yet.</p>
            ) : (
              <div className="feed-list">
                {myStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'saved' && (
          <div className="profile-stories">
            {savedStories.length === 0 ? (
              <p className="empty-state">No saved stories yet.</p>
            ) : (
              <div className="feed-list">
                {savedStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'mood' && (
          <div className="profile-mood">
            <MoodCalendar />
          </div>
        )}

        {tab === 'habits' && (
          <div className="profile-habits">
            <HabitProgress />
            <AutoTrackerChart />
          </div>
        )}

        {tab === 'parallel' && (
          <div className="profile-parallel">
            <ParallelHistory onBack={() => setTab('my')} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
