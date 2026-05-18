// Seed data utility — inserts anonymous sample posts into Supabase.
// Run via: node src/utils/seedData.js (requires Supabase credentials)

import { supabase, TABLES } from '../lib/supabaseClient';
import { sha256 } from './crypto';

const sampleContents = [
  {
    content: 'Some days just feel heavier than others. Trying to remember that "this too shall pass." The weight comes and goes like the tide, and I\'m learning to let it flow through me instead of letting it settle.',
    tags: ['mentalhealth', 'hope'],
  },
  {
    content: 'I finally reached out to a friend today after weeks of isolation. It wasn\'t as scary as I thought it would be. They didn\'t judge me. They just listened. Small steps count.',
    tags: ['growth', 'hope'],
  },
  {
    content: 'Does anyone else feel like they\'re just going through the motions? Like life is on autopilot? I wake up, work, eat, sleep, repeat. Not sad, not happy — just... there.',
    tags: ['mentalhealth', 'vent'],
  },
  {
    content: 'Three things I\'m grateful for today: the way sunlight streams through my window at 4pm, a warm cup of chamomile tea, and knowing this community exists.',
    tags: ['gratitude', 'selfcare'],
  },
  {
    content: 'I had my therapy session today and actually talked about the hard stuff. The stuff I\'ve been avoiding for months. I cried, but I also felt lighter afterward. Progress, not perfection.',
    tags: ['mentalhealth', 'growth'],
  },
];

const adjectives = [
  'Gentle','Quiet','Soft','Warm','Calm','Bright','Deep','Free',
  'Kind','Brave','True','Wild','Still','Fair','Pure','Bold',
];
const nouns = [
  'Oak','Wave','Glow','Sky','Moon','Star','River','Forest',
  'Heart','Light','Pine','Cloud','Breeze','Dawn',
];
const colors = [
  '#A78BFA','#67E8F9','#6EE7B7','#F87171','#FBBF24',
  '#60A5FA','#E879F9','#34D399','#38BDF8','#FB923C',
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function createSeedSession() {
  const token = generateToken();
  const tokenHash = await sha256(token);
  const pseudonym = randomItem(adjectives) + randomItem(nouns);

  const { data, error } = await supabase
    .from(TABLES.ANONYMOUS_SESSIONS)
    .insert({
      token_hash: tokenHash,
      pseudonym,
      avatar_color: randomItem(colors),
    })
    .select('id')
    .single();

  if (error) {
    console.error('Failed to create seed session:', error);
    return null;
  }

  return data.id;
}

async function seedData() {
  console.log('Seeding Murmur database...\n');

  const sessionId = await createSeedSession();
  if (!sessionId) {
    console.error('Aborting seed — could not create session.');
    return;
  }

  console.log(`Created seed session: ${sessionId}`);

  for (let i = 0; i < sampleContents.length; i++) {
    const sample = sampleContents[i];
    const postPseudo = randomItem(adjectives) + randomItem(nouns);
    const postColor = randomItem(colors);
    const hoursAgo = (sampleContents.length - i) * 2;

    const { data: post, error } = await supabase
      .from(TABLES.POSTS)
      .insert({
        session_id: sessionId,
        post_pseudonym: postPseudo,
        avatar_color: postColor,
        content: sample.content,
        tags: sample.tags,
        created_at: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error(`Failed to seed post ${i + 1}:`, error);
    } else {
      console.log(`  Post ${i + 1}/${sampleContents.length} created: ${post.id}`);

      // Add some reactions
      const emojis = ['\u{1F44D}', '\u{2764}\u{FE0F}', '\u{1F60A}', '\u{1F622}'];
      const numReactions = 1 + Math.floor(Math.random() * 3);
      for (let r = 0; r < numReactions; r++) {
        await supabase.from(TABLES.REACTIONS).insert({
          post_id: post.id,
          session_id: sessionId,
          emoji: emojis[r],
        });
      }
    }
  }

  // Seed mood check-ins
  const emotions = ['exhausted', 'anxious', 'lonely', 'numb', 'hopeful', 'overwhelmed'];
  for (let d = 0; d < 7; d++) {
    await supabase.from(TABLES.MOOD_CHECKINS).insert({
      session_id: sessionId,
      emotion: randomItem(emotions),
      created_at: new Date(Date.now() - d * 86400000).toISOString(),
    });
  }

  console.log(`\nSeeding complete. Session ID: ${sessionId}`);
  console.log('To test, run the app and check the feed.');
}

seedData().catch(console.error);
