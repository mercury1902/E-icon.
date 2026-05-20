import { useApp } from '../../context/AppContext';
import MoodCheckin from '../mood/MoodCheckin';
import WeeklyHabitTracker from '../habits/WeeklyHabitTracker';
import DailyAffirmation from '../wellbeing/DailyAffirmation';
import BreathingExercise from '../wellbeing/BreathingExercise';
import AutoTrackerChart from '../habits/AutoTrackerChart';
import DailyPrompt from './DailyPrompt';
import TopicFilter from './TopicFilter';
import StoryCard from './StoryCard';

function FeedPage() {
  const { stories, selectedTopic, setSelectedTopic, hiddenStories } = useApp();

  const visible = stories.filter((s) => !hiddenStories.has(s.id));
  const filtered = selectedTopic
    ? visible.filter((s) => s.topicId === selectedTopic)
    : visible;

  return (
    <div className="feed-page">
      <aside className="feed-sidebar-left">
        <MoodCheckin />
        <WeeklyHabitTracker />
      </aside>
      <div className="feed-center">
        <DailyPrompt />
        <TopicFilter selected={selectedTopic} onSelect={setSelectedTopic} />
        <div className="feed-list">
          {filtered.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
          {filtered.length === 0 && (
            <p className="empty-feed">No stories in this topic yet. Be the first to share!</p>
          )}
        </div>
      </div>
      <aside className="feed-sidebar-right">
        <DailyAffirmation />
        <BreathingExercise />
        <AutoTrackerChart />
      </aside>
    </div>
  );
}

export default FeedPage;
