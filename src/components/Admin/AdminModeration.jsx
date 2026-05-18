import React, { useState, useEffect, useCallback } from 'react';
import * as adminService from '../../services/adminService';

const PAGE_SIZE = 15;

export default function AdminModeration({ type = 'posts' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(0);
  const [confirm, setConfirm] = useState(null);
  const [filterFlagged, setFilterFlagged] = useState(false);

  const isComments = type === 'comments';

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = isComments ? await adminService.getComments() : await adminService.getPosts();
      setItems(data || []);
    } catch (e) {
      console.error('Failed to load:', e);
    } finally {
      setLoading(false);
    }
  }, [isComments]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filtered = items
    .filter((item) => {
      if (filterFlagged && !item.is_flagged) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      const author = isComments ? (item.comment_pseudonym || '') : (item.post_pseudonym || '');
      const content = (item.content || '').toLowerCase();
      return author.toLowerCase().includes(q) || content.includes(q);
    })
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
    setPage(0);
  };

  const handleAction = async (action, item) => {
    try {
      if (isComments) {
        if (action === 'hide') await adminService.hideComment(item.id);
        else if (action === 'show') await adminService.showComment?.(item.id);
        else if (action === 'delete') await adminService.deleteComment(item.id);
      } else {
        if (action === 'hide') await adminService.hidePost(item.id);
        else if (action === 'show') await adminService.showPost(item.id);
        else if (action === 'delete') await adminService.deletePost(item.id);
      }
      setConfirm(null);
      await fetchItems();
    } catch (e) {
      alert('Action failed: ' + e.message);
    }
  };

  const SortIcon = ({ column }) => {
    if (sortKey !== column) return <span className="sort-icon sort-inactive">{'\u{2195}'}</span>;
    return <span className="sort-icon">{sortDir === 'asc' ? '\u{2191}' : '\u{2193}'}</span>;
  };

  if (loading) {
    return <div className="admin-section-loading"><div className="admin-spinner" /></div>;
  }

  return (
    <div className="admin-section">
      <div className="admin-toolbar">
        <div className="admin-search">
          <span className="admin-search-icon" aria-hidden="true">{'\u{1F50D}'}</span>
          <input
            type="text"
            placeholder={`Search ${isComments ? 'comments' : 'posts'}...`}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="admin-search-input"
          />
        </div>
        <label className="admin-filter-flagged">
          <input type="checkbox" checked={filterFlagged} onChange={(e) => { setFilterFlagged(e.target.checked); setPage(0); }} />
          Flagged only
        </label>
        <button className="admin-btn admin-btn-outline" onClick={() => adminService.exportToCsv(filtered, `${isComments ? 'comments' : 'posts'}.csv`)}>
          {'\u{1F4E5}'} Export CSV
        </button>
        <span className="admin-count">{filtered.length} {isComments ? 'comments' : 'posts'}</span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort(isComments ? 'comment_pseudonym' : 'post_pseudonym')}>
                Author <SortIcon column={isComments ? 'comment_pseudonym' : 'post_pseudonym'} />
              </th>
              <th>Content</th>
              {!isComments && <th onClick={() => toggleSort('emotion_tag')}>Emotion <SortIcon column="emotion_tag" /></th>}
              {!isComments && <th>Tags</th>}
              <th>Flags</th>
              <th>Status</th>
              <th onClick={() => toggleSort('created_at')}>Date <SortIcon column="created_at" /></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={isComments ? 6 : 8} className="admin-empty">No {isComments ? 'comments' : 'posts'} found</td></tr>
            ) : (
              paged.map((item) => {
                const author = isComments ? item.comment_pseudonym : item.post_pseudonym;
                const isHidden = item.is_hidden;
                const isDeleted = !!item.deleted_at;
                return (
                  <tr key={item.id} className={isHidden ? 'row-hidden' : isDeleted ? 'row-deleted' : ''}>
                    <td className="cell-primary">{author || 'Anonymous'}</td>
                    <td className="cell-preview" title={item.content}>
                      {item.content ? item.content.substring(0, 120) + (item.content.length > 120 ? '...' : '') : ''}
                    </td>
                    {!isComments && (
                      <>
                        <td>{item.emotion_tag ? <span className="emotion-tag">{item.emotion_tag}</span> : '\u2014'}</td>
                        <td className="cell-tags">
                          {item.tags && item.tags.length > 0
                            ? item.tags.map((t) => <span key={t} className="mini-tag">#{t}</span>)
                            : '\u2014'}
                        </td>
                      </>
                    )}
                    <td>
                      {item.is_flagged ? (
                        <span className="status-badge status-flagged" title={item.flag_reason}>
                          {item.report_count || 1} flag{(item.report_count || 1) > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="admin-na">0</span>
                      )}
                    </td>
                    <td>
                      {isDeleted ? (
                        <span className="status-badge status-deleted">Deleted</span>
                      ) : isHidden ? (
                        <span className="status-badge status-suspended">Hidden</span>
                      ) : (
                        <span className="status-badge status-active">Visible</span>
                      )}
                    </td>
                    <td className="cell-date">{item.created_at ? new Date(item.created_at).toLocaleDateString() : '\u2014'}</td>
                    <td className="cell-actions">
                      {!isDeleted && (
                        <>
                          {isHidden ? (
                            <button className="admin-btn-sm admin-btn-restore" onClick={() => handleAction('show', item)}>Show</button>
                          ) : (
                            <button className="admin-btn-sm admin-btn-warn" onClick={() => handleAction('hide', item)}>Hide</button>
                          )}
                          <button className="admin-btn-sm admin-btn-danger" onClick={() => setConfirm({ action: 'delete', item })}>Delete</button>
                        </>
                      )}
                      {isDeleted && <span className="admin-na">\u2014</span>}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {confirm && (
        <div className="admin-modal-overlay" onClick={() => setConfirm(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to <strong>{confirm.action}</strong> this {isComments ? 'comment' : 'post'}?
              {confirm.action === 'delete' && <span className="modal-warning"> This action cannot be easily undone.</span>}
            </p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-outline" onClick={() => setConfirm(null)}>Cancel</button>
              <button
                className={`admin-btn ${confirm.action === 'delete' ? 'admin-btn-danger' : 'admin-btn-warn'}`}
                onClick={() => handleAction(confirm.action, confirm.item)}
              >
                Confirm {confirm.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
