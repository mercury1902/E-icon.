import { generatePseudonym, getAvatarColor, getInitials } from '../utils/pseudonyms';

function buildPost(content, tags, reactions, comments, time) {
  const pseudo = generatePseudonym();
  return {
    id: '',
    author: pseudo.name,
    avatarColor: getAvatarColor(pseudo.name),
    initial: getInitials(pseudo.name),
    content,
    tags,
    reactions,
    comments,
    time,
  };
}

export const samplePosts = [
  buildPost(
    'Some days just feel heavier than others. Trying to remember that "this too shall pass." The weight comes and goes like the tide, and I\'m learning to let it flow through me instead of letting it settle.',
    ['mentalhealth', 'hope'],
    { '👍': 8, '❤️': 12, '😊': 5 },
    4,
    '12 min ago'
  ),
  buildPost(
    'I finally reached out to a friend today after weeks of isolation. It wasn\'t as scary as I thought it would be. They didn\'t judge me. They just listened. Small steps count.',
    ['growth', 'hope'],
    { '👍': 15, '❤️': 24, '😊': 9, '😢': 3 },
    7,
    '42 min ago'
  ),
  buildPost(
    'Does anyone else feel like they\'re just going through the motions? Like life is on autopilot? I wake up, work, eat, sleep, repeat. Not sad, not happy — just... there.',
    ['mentalhealth', 'vent'],
    { '👍': 11, '😊': 4, '😢': 18 },
    23,
    '1 hr ago'
  ),
  buildPost(
    'Three things I\'m grateful for today: the way sunlight streams through my window at 4pm, a warm cup of chamomile tea, and knowing this community exists. What are you grateful for?',
    ['gratitude', 'selfcare'],
    { '👍': 22, '❤️': 31, '😊': 14 },
    11,
    '2 hr ago'
  ),
  buildPost(
    'I had my therapy session today and actually talked about the hard stuff. The stuff I\'ve been avoiding for months. I cried, but I also felt lighter afterward. Progress, not perfection.',
    ['therapy', 'growth'],
    { '👍': 19, '❤️': 28, '😢': 7, '🙌': 16 },
    9,
    '3 hr ago'
  ),
];
