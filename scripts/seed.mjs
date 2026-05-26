import pg from 'pg';
import { stories as mockStories } from '../src/data/mockData.js';

const dbPassword = process.env.SUPABASE_DB_PASSWORD || 'ca4TZOB1rJBrJX5O';

const TOPICS_MAP = {
  1: 'Confession',
  2: 'Vent',
  3: 'Advice',
  4: 'Wholesome',
  5: 'Story',
  6: 'Question'
};

async function main() {
  const db = new pg.Client({
    host: 'db.cnzfmrivwohjzeoephug.supabase.co',
    port: 5432,
    user: 'postgres',
    password: dbPassword,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });
  await db.connect();
  console.log('Connected to database for seeding.');

  // Clean up any previous seeding attempts
  console.log('Cleaning up previous seed data...');
  await db.query(`
    DELETE FROM public.posts 
    WHERE session_id IN (SELECT id FROM public.anonymous_sessions WHERE token_hash LIKE 'seed_%')
  `);
  await db.query(`
    DELETE FROM public.anonymous_sessions 
    WHERE token_hash LIKE 'seed_%'
  `);
  console.log('Cleanup completed.');

  console.log('Seeding initial data from mockData.js...');

  // Create a main dummy anonymous session for posts and comments
  const { rows: sessionRows } = await db.query(`
    INSERT INTO public.anonymous_sessions (token_hash, pseudonym, avatar_color)
    VALUES ($1, $2, $3)
    RETURNING id
  `, ['seed_main_session', 'System Seed', '#8B5CF6']);
  const mainSessionId = sessionRows[0].id;

  const commentIdMap = new Map();

  for (const story of mockStories) {
    const topicTag = TOPICS_MAP[story.topicId] || 'General';
    const tags = [topicTag.toLowerCase()];
    if (story.contentWarning) {
      tags.push(story.contentWarning.toLowerCase());
    }

    // Insert Post
    const { rows: postRows } = await db.query(`
      INSERT INTO public.posts (session_id, post_pseudonym, avatar_color, content, tags, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [
      mainSessionId,
      story.pseudonym || 'Anonymous',
      '#A78BFA',
      story.content,
      tags,
      story.timestamp || new Date().toISOString()
    ]);
    const postId = postRows[0].id;
    console.log(`Inserted post with UUID: ${postId}`);

    // Insert Reactions
    if (story.reactions) {
      const sessionsToInsert = [];
      for (const [emojiName, count] of Object.entries(story.reactions)) {
        const emoji = emojiName === 'heart' ? '❤️' : emojiName === 'relate' ? '😊' : '🔥';
        for (let i = 0; i < count; i++) {
          sessionsToInsert.push({
            token_hash: `seed_react_${postId}_${emojiName}_${i}`,
            pseudonym: `User ${i}`,
            avatar_color: '#10B981',
            emoji: emoji
          });
        }
      }

      if (sessionsToInsert.length > 0) {
        const batchSize = 100;
        for (let batchStart = 0; batchStart < sessionsToInsert.length; batchStart += batchSize) {
          const batch = sessionsToInsert.slice(batchStart, batchStart + batchSize);
          
          let sessionQuery = `INSERT INTO public.anonymous_sessions (token_hash, pseudonym, avatar_color) VALUES `;
          const sessionParams = [];
          for (let i = 0; i < batch.length; i++) {
            const pIndex = i * 3;
            sessionQuery += `($${pIndex + 1}, $${pIndex + 2}, $${pIndex + 3})${i === batch.length - 1 ? '' : ', '}`;
            sessionParams.push(batch[i].token_hash, batch[i].pseudonym, batch[i].avatar_color);
          }
          sessionQuery += ` RETURNING id, token_hash`;
          
          const { rows: sessionRows } = await db.query(sessionQuery, sessionParams);
          const tokenToIdMap = new Map(sessionRows.map(r => [r.token_hash, r.id]));
          
          let reactionQuery = `INSERT INTO public.reactions (post_id, session_id, emoji) VALUES `;
          const reactionParams = [];
          for (let i = 0; i < batch.length; i++) {
            const sessionId = tokenToIdMap.get(batch[i].token_hash);
            const pIndex = i * 3;
            reactionQuery += `($${pIndex + 1}, $${pIndex + 2}, $${pIndex + 3})${i === batch.length - 1 ? '' : ', '}`;
            reactionParams.push(postId, sessionId, batch[i].emoji);
          }
          await db.query(reactionQuery, reactionParams);
        }
      }
    }

    // Insert Top-Level Comments
    const topLevelComments = story.comments.filter(c => c.parentId === null);
    const replyComments = story.comments.filter(c => c.parentId !== null);

    for (const c of topLevelComments) {
      // Create a unique session for comments too
      const { rows: commentSessionRows } = await db.query(`
        INSERT INTO public.anonymous_sessions (token_hash, pseudonym, avatar_color)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [`seed_comment_${c.id}`, 'Commenter', '#3B82F6']);
      const commentSessionId = commentSessionRows[0].id;

      const { rows: commentRows } = await db.query(`
        INSERT INTO public.comments (post_id, session_id, comment_pseudonym, avatar_color, content, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [
        postId,
        commentSessionId,
        `Anonymous ${c.avatar || '🦊'}`,
        '#A78BFA',
        c.content,
        c.timestamp || new Date().toISOString()
      ]);
      const commentId = commentRows[0].id;
      commentIdMap.set(c.id, commentId);
    }

    // Insert Replies
    for (const r of replyComments) {
      const dbParentId = commentIdMap.get(r.parentId);
      if (dbParentId) {
        // Create unique session for replies
        const { rows: replySessionRows } = await db.query(`
          INSERT INTO public.anonymous_sessions (token_hash, pseudonym, avatar_color)
          VALUES ($1, $2, $3)
          RETURNING id
        `, [`seed_reply_${r.id}`, 'Replier', '#EF4444']);
        const replySessionId = replySessionRows[0].id;

        const { rows: replyRows } = await db.query(`
          INSERT INTO public.comments (post_id, session_id, comment_pseudonym, avatar_color, content, parent_id, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `, [
          postId,
          replySessionId,
          `Anonymous ${r.avatar || '🦊'}`,
          '#A78BFA',
          r.content,
          dbParentId,
          r.timestamp || new Date().toISOString()
        ]);
        commentIdMap.set(r.id, replyRows[0].id);
      }
    }
  }

  console.log('Seeding completed successfully.');
  await db.end();
}

main().catch(console.error);
