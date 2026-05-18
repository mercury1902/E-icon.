import { supabase, TABLES } from '../lib/supabaseClient';

export async function fetchPosts({ searchQuery, tagFilter } = {}) {
  let query = supabase
    .from(TABLES.POSTS)
    .select('id, post_pseudonym, avatar_color, content, tags, emotion_tag, created_at')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .limit(50);

  if (tagFilter && tagFilter !== 'all') {
    query = query.contains('tags', [tagFilter]);
  }

  const { data, error } = await query;

  if (error) {
    console.error('fetchPosts error:', error);
    return [];
  }

  const reactionPromises = data.map(async (post) => {
    const { data: reactions } = await supabase
      .from('reaction_counts')
      .select('emoji, count')
      .eq('post_id', post.id);

    const reactionMap = {};
    if (reactions) {
      reactions.forEach((r) => {
        reactionMap[r.emoji] = r.count;
      });
    }

    return {
      id: post.id,
      author: post.post_pseudonym,
      avatarColor: post.avatar_color,
      initial: post.post_pseudonym?.charAt(0)?.toUpperCase() || '?',
      content: post.content,
      tags: post.tags || [],
      emotionTag: post.emotion_tag,
      reactions: reactionMap,
      comments: 0,
      time: formatRelativeTime(post.created_at),
    };
  });

  return Promise.all(reactionPromises);
}

export async function createPost({ sessionId, content, tags, emotionTag }) {
  const pseudo = generatePerPostPseudonym();

  const { data, error } = await supabase
    .from(TABLES.POSTS)
    .insert({
      session_id: sessionId,
      post_pseudonym: pseudo.name,
      avatar_color: pseudo.color,
      content,
      tags: tags.length > 0 ? tags : ['mentalhealth'],
      emotion_tag: emotionTag || null,
    })
    .select('id, post_pseudonym, avatar_color, content, tags, created_at')
    .single();

  if (error) {
    console.error('createPost error:', error);
    return null;
  }

  const { data: sessionData } = await supabase
    .from(TABLES.ANONYMOUS_SESSIONS)
    .select('post_count')
    .eq('id', sessionId)
    .single();

  if (sessionData) {
    await supabase
      .from(TABLES.ANONYMOUS_SESSIONS)
      .update({ post_count: (sessionData.post_count || 0) + 1 })
      .eq('id', sessionId);
  }

  return {
    id: data.id,
    author: data.post_pseudonym,
    avatarColor: data.avatar_color,
    initial: data.post_pseudonym?.charAt(0)?.toUpperCase() || '?',
    content: data.content,
    tags: data.tags || [],
    reactions: {},
    comments: 0,
    time: 'just now',
  };
}

export async function getPostById(postId) {
  const { data, error } = await supabase
    .from(TABLES.POSTS)
    .select('*')
    .eq('id', postId)
    .single();

  if (error) return null;
  return data;
}

function generatePerPostPseudonym() {
  const adjectives = [
    'Gentle','Quiet','Soft','Warm','Calm','Bright','Deep','Free',
    'Kind','Brave','True','Wild','Still','Fair','Pure','Bold',
    'Sage','Clear','Rising','Steady','Lunar','Solar','Silent','Honest',
  ];
  const nouns = [
    'Oak','Wave','Glow','Sky','Moon','Star','River','Forest',
    'Heart','Light','Pine','Cloud','Breeze','Dawn','Meadow',
    'Tide','Haven','Ember','Willow','Cedar','Stone','Feather',
    'Horizon','Garden',
  ];
  const colors = [
    '#A78BFA','#67E8F9','#6EE7B7','#F87171','#FBBF24',
    '#60A5FA','#E879F9','#34D399','#38BDF8','#FB923C',
  ];

  return {
    name:
      adjectives[Math.floor(Math.random() * adjectives.length)] +
      nouns[Math.floor(Math.random() * nouns.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
  };
}

function formatRelativeTime(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day ago`;

  return date.toLocaleDateString();
}
