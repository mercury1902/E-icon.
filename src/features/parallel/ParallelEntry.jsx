import { useParallel } from './ParallelContext';

function ParallelEntry({ story, onStartMatching }) {
  const { isMatching, matchingStoryId } = useParallel();

  if (!story.isMine) return null;

  const isCurrentlyMatching = isMatching && matchingStoryId === story.id;

  return (
    <div className="parallel-entry" role="region" aria-label="Parallel connection option">
      <button
        className="parallel-entry-btn"
        onClick={onStartMatching}
        disabled={isCurrentlyMatching}
        aria-busy={isCurrentlyMatching}
        aria-label={
          isCurrentlyMatching
            ? 'Finding a kindred spirit, please wait'
            : 'Find someone who shares your experience for a private conversation'
        }
      >
        {isCurrentlyMatching ? (
          <>
            <span className="parallel-entry-spinner" aria-hidden="true" />
            Finding a kindred spirit...
          </>
        ) : (
          <>Find Someone Who Gets It</>
        )}
      </button>
      <p className="parallel-entry-hint" id="parallel-entry-hint">
        Matched with someone who shares your experience for a private 48-hour conversation.
      </p>
    </div>
  );
}

export default ParallelEntry;
