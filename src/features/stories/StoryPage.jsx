import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Reactions from '../feed/Reactions';
import CommentSection from './CommentSection';
import ContentWarning from '../feed/ContentWarning';
import MoreMenu from '../shared/MoreMenu';
import ParallelEntry from '../parallel/ParallelEntry';
import FindMatchModal from '../parallel/FindMatchModal';
import ParallelChat from '../parallel/ParallelChat';

function formatDate(ts) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

function StoryPage() {
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [chatThreadId, setChatThreadId] = useState(null);
  const { id } = useParams();
  const { stories, userReactions, topics } = useApp();
  const story = stories.find((s) => s.id === Number(id));

  if (!story) {
    return (
      <div className="not-found">
        <h2>Story not found</h2>
        <Link to="/">← Back to Feed</Link>
      </div>
    );
  }

  const topic = topics.find((tp) => tp.id === story.topicId);

  return (
    <div className="story-page">
      <Link to="/" className="back-link">← Back to Feed</Link>
      <div className="story-detail">
        <div className="story-detail-header">
          <span className="pseudonym">{story.pseudonym}</span>
          {topic && (
            <span className="topic-tag" style={{ '--topic-color': topic.color }}>
              {topic.name}
            </span>
          )}
          {story.isMine && story.reports > 0 && (
            <span className="report-badge">{story.reports} report{story.reports !== 1 ? 's' : ''}</span>
          )}
          <MoreMenu story={story} onHide={() => {}} />
        </div>
        {story.contentWarning ? (
          <ContentWarning warning={story.contentWarning}>
            <p className="story-detail-content">{story.content}</p>
          </ContentWarning>
        ) : (
          <p className="story-detail-content">{story.content}</p>
        )}
        <span className="story-detail-date">{formatDate(story.timestamp)}</span>
        <Reactions
          storyId={story.id}
          reactions={story.reactions}
          commentCount={story.comments.length}
          userReactions={userReactions[story.id]}
        />
        <ParallelEntry
          story={story}
          onStartMatching={() => setShowMatchModal(true)}
        />
      </div>
      <CommentSection storyId={story.id} comments={story.comments} />

      {showMatchModal && (
        <FindMatchModal
          prefs={{ shareType: 'story', hearType: 'story', genderPref: 'any' }}
          onClose={() => setShowMatchModal(false)}
        />
      )}

      {chatThreadId && (
        <ParallelChat
          threadId={chatThreadId}
          onClose={() => setChatThreadId(null)}
        />
      )}
    </div>
  );
}

export default StoryPage;
