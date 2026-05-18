import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Reactions from './Reactions';
import ContentWarning from './ContentWarning';
import MoreMenu from '../shared/MoreMenu';

function formatTime(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StoryCard({ story }) {
  const { userReactions, topics, hideStory } = useApp();
  const topic = topics.find((tpc) => tpc.id === story.topicId);

  return (
    <div className="story-card">
      <div className="story-header">
        <span className="pseudonym">{story.pseudonym}</span>
        {topic && (
          <span className="topic-tag" style={{ '--topic-color': topic.color }}>
            {topic.name}
          </span>
        )}
        <span className="story-time">{formatTime(story.timestamp)}</span>
        <MoreMenu story={story} onHide={() => hideStory(story.id)} />
      </div>
      {story.contentWarning ? (
        <ContentWarning warning={story.contentWarning}>
          <Link to={`/story/${story.id}`} className="story-content">
            <p>{story.content}</p>
          </Link>
        </ContentWarning>
      ) : (
        <Link to={`/story/${story.id}`} className="story-content">
          <p>{story.content}</p>
        </Link>
      )}
      <Reactions
        storyId={story.id}
        reactions={story.reactions}
        commentCount={story.comments.length}
        userReactions={userReactions[story.id]}
      />
    </div>
  );
}

export default StoryCard;
