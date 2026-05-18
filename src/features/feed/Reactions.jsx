import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

function HeartIcon({ reacted }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={reacted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function RelateIcon({ reacted }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={reacted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function FireIcon({ reacted }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={reacted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 1 1 2 2.5 2 4.5a6 6 0 1 1-12 0c0-1.5.5-3 1.5-4Z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function Reactions({ storyId, reactions, commentCount, userReactions }) {
  const { reactToStory } = useApp();

  const iconMap = {
    heart: HeartIcon,
    relate: RelateIcon,
    fire: FireIcon,
  };

  return (
    <div className="reactions">
      {Object.entries(reactions).map(([key, count]) => {
        const reacted = userReactions?.[key] ?? false;
        const Icon = iconMap[key];
        return (
          <button
            key={key}
            className={`reaction-btn ${reacted ? 'reacted' : ''}`}
            onClick={() => reactToStory(storyId, key)}
          >
            {Icon && <Icon reacted={reacted} />} {count}
          </button>
        );
      })}
      <Link to={`/story/${storyId}`} className="reaction-btn">
        <CommentIcon /> {commentCount}
      </Link>
    </div>
  );
}

export default Reactions;
