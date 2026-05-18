import { useState } from 'react';
import { useApp } from '../../context/AppContext';

function EditStory({ story, onClose }) {
  const { editStory, topics } = useApp();
  const [content, setContent] = useState(story.content);
  const [pseudonym, setPseudonym] = useState(story.pseudonym);
  const [topicId, setTopicId] = useState(story.topicId);

  function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    editStory(story.id, {
      pseudonym: pseudonym.trim() || story.pseudonym,
      content: content.trim(),
      topicId,
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Story</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Story</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
              <label>Pseudonym</label>
              <input
                type="text"
                value={pseudonym}
                onChange={(e) => setPseudonym(e.target.value)}
                maxLength="30"
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={!content.trim()}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStory;
