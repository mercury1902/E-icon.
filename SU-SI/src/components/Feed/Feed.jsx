import React from 'react';
import PostCard from '../PostCard/PostCard';
import './Feed.css';

export default function Feed({ posts, loading }) {
  return (
    <section className="feed animate-in animate-in-delay-2" aria-labelledby="feed-heading">
      <div className="section-header feed-header">
        <span className="shield" aria-hidden="true">{'\u{1F4F0}'}</span>
        <h2 id="feed-heading">Latest Murmurs</h2>
        <span className="feed-sub">Showing voices from the community</span>
      </div>

      <div role="feed" aria-label="Anonymous posts feed">
        {loading ? (
          <LoadingSkeleton />
        ) : posts.length === 0 ? (
          <EmptyFeed />
        ) : (
          posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))
        )}
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <>
      {[1, 2].map((n) => (
        <div key={n} className="post-card-skeleton" aria-hidden="true">
          <div className="skeleton-row">
            <div className="skeleton avatar-skeleton" />
            <div className="skeleton-text-group">
              <div className="skeleton text-line-short" />
              <div className="skeleton text-line-xs" />
            </div>
          </div>
          <div className="skeleton content-skeleton" />
          <div className="skeleton tag-skeleton" />
        </div>
      ))}
    </>
  );
}

function EmptyFeed() {
  return (
    <div className="empty-feed">
      <div className="empty-icon" aria-hidden="true">{'\u{1F4F0}'}</div>
      <p>No murmurs found. Be the first to share.</p>
    </div>
  );
}
