import { useState } from 'react';
import { useApp } from '../../context/AppContext';

function CreateStory({ onClose }) {
  const { addStory, topics } = useApp();
  const [content, setContent] = useState('');
  const [topicId, setTopicId] = useState(topics[0].id);
  const [pseudonym, setPseudonym] = useState('');
  const [ephemeral, setEphemeral] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    addStory({
      id: Date.now(),
      pseudonym: pseudonym.trim() || 'Anonymous',
      content: content.trim(),
      topicId,
      timestamp: new Date().toISOString(),
      reactions: { heart: 0, relate: 0, fire: 0 },
      comments: [],
      isMine: true,
      ephemeral,
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share Your Story</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Story</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows="5"
              maxLength="1000"
              required
            />
            <span className="char-count">{content.length}/1000</span>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Topic</label>
              <select value={topicId} onChange={(e) => setTopicId(Number(e.target.value))}>
                {topics.map((tpc) => (
                  <option key={tpc.id} value={tpc.id}>{tpc.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Pseudonym (optional)</label>
              <input
                type="text"
                value={pseudonym}
                onChange={(e) => setPseudonym(e.target.value)}
                placeholder="Anonymous"
                maxLength="30"
              />
            </div>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={ephemeral}
                onChange={(e) => setEphemeral(e.target.checked)}
              />
              Vanishing story — disappears in 24 hours
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={!content.trim()}>
              Post Anonymously
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateStory;
