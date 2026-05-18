const topics = [
  { id: 1, name: 'Confession', color: '#ef4444' },
  { id: 2, name: 'Vent', color: '#f97316' },
  { id: 3, name: 'Advice', color: '#3b82f6' },
  { id: 4, name: 'Wholesome', color: '#22c55e' },
  { id: 5, name: 'Story', color: '#8b5cf6' },
  { id: 6, name: 'Question', color: '#ec4899' },
];

const animalAvatars = ['🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐸', '🐵', '🦉', '🐺', '🦄', '🐧'];

const stories = [
  {
    id: 1,
    pseudonym: 'Wandering Soul',
    content: "I told my best friend I love them today. They didn't feel the same way. But you know what? I'm proud of myself for being honest. It hurts, but I'd rather know than wonder forever.",
    topicId: 1,
    timestamp: '2026-05-14T08:30:00Z',
    contentWarning: null,
    reactions: { heart: 47, relate: 32, fire: 5 },
    reports: 0,
    comments: [
      { id: 1, parentId: null, avatar: '🦊', content: "That takes so much courage. Proud of you, stranger.", timestamp: '2026-05-14T09:00:00Z', reports: 0 },
      { id: 2, parentId: null, avatar: '🐻', content: 'Been there. It gets better with time ❤️', timestamp: '2026-05-14T09:30:00Z', reports: 0 },
    ],
    isMine: true,
  },
  {
    id: 2,
    pseudonym: 'Night Owl',
    content: '3 AM and I just fixed a bug that has been haunting me for 6 hours. The fix? One missing semicolon. I need to go touch some grass.',
    topicId: 2,
    timestamp: '2026-05-14T03:15:00Z',
    contentWarning: null,
    reactions: { heart: 89, relate: 124, fire: 12 },
    reports: 0,
    comments: [
      { id: 3, parentId: null, avatar: '🐼', content: 'The semicolon strikes again 😂', timestamp: '2026-05-14T04:00:00Z', reports: 0 },
    ],
    isMine: false,
  },
  {
    id: 3,
    pseudonym: 'Hopeful Heart',
    content: 'Just adopted a senior dog from the shelter. He slept on my lap for two hours and I cried. He deserved a home and I needed a friend. We found each other.',
    topicId: 4,
    timestamp: '2026-05-13T18:45:00Z',
    contentWarning: null,
    reactions: { heart: 256, relate: 45, fire: 78 },
    reports: 0,
    comments: [
      { id: 4, parentId: null, avatar: '🦁', content: 'This is the most beautiful thing I have read all week 🥹', timestamp: '2026-05-13T19:00:00Z', reports: 0 },
      { id: 5, parentId: null, avatar: '🐯', content: 'Senior dogs are the best. Thank you for adopting!', timestamp: '2026-05-13T19:30:00Z', reports: 0 },
      { id: 6, parentId: null, avatar: '🐸', content: 'Who is cutting onions in here?', timestamp: '2026-05-13T20:00:00Z', reports: 0 },
    ],
    isMine: true,
  },
  {
    id: 4,
    pseudonym: 'Curious Mind',
    content: 'If you could instantly master one skill you do not currently have, what would it be? I would pick playing the piano.',
    topicId: 6,
    timestamp: '2026-05-13T14:00:00Z',
    contentWarning: null,
    reactions: { heart: 34, relate: 12, fire: 3 },
    reports: 0,
    comments: [
      { id: 7, parentId: null, avatar: '🦉', content: 'Languages. I want to travel and actually talk to people.', timestamp: '2026-05-13T14:30:00Z', reports: 0 },
      { id: 8, parentId: null, avatar: '🐺', content: 'Cooking. I survive on instant noodles.', timestamp: '2026-05-13T15:00:00Z', reports: 0 },
      { id: 9, parentId: null, avatar: '🦄', content: 'Photography. Capture moments properly.', timestamp: '2026-05-13T15:30:00Z', reports: 0 },
    ],
    isMine: false,
  },
  {
    id: 5,
    pseudonym: 'Glass Heart',
    content: "I pretend I'm okay but I haven't actually been okay in months. I don't know how to ask for help without feeling like a burden.",
    topicId: 1,
    timestamp: '2026-05-12T22:10:00Z',
    contentWarning: 'mental health',
    reactions: { heart: 312, relate: 287, fire: 15 },
    reports: 2,
    comments: [
      { id: 10, parentId: null, avatar: '🐧', content: 'You are not a burden. Please reach out to someone. The world is better with you in it.', timestamp: '2026-05-12T22:30:00Z', reports: 0 },
      { id: 11, parentId: 10, avatar: '🐻', content: 'Therapy changed my life. It is not weakness, it is strength to ask.', timestamp: '2026-05-12T23:00:00Z', reports: 0 },
      { id: 12, parentId: null, avatar: '🐨', content: 'Sending you so much love. You matter.', timestamp: '2026-05-13T00:00:00Z', reports: 0 },
    ],
    isMine: false,
  },
  {
    id: 6,
    pseudonym: 'Daydreamer',
    content: 'Sometimes I make up elaborate scenarios in my head and forget they are not real. Anyone else live in their own little world?',
    topicId: 5,
    timestamp: '2026-05-12T16:20:00Z',
    contentWarning: null,
    reactions: { heart: 67, relate: 156, fire: 8 },
    reports: 0,
    comments: [
      { id: 13, parentId: null, avatar: '🐵', content: 'Maladaptive daydreaming club represent 👋', timestamp: '2026-05-12T17:00:00Z', reports: 0 },
    ],
    isMine: false,
  },
];

const prompts = [
  'What is something you have never told anyone?',
  'Describe a moment that changed your perspective on life.',
  'What is your biggest fear, and why?',
  'Write about a stranger who left an impression on you.',
  'If you could send a message to your younger self, what would it say?',
  'What does your ideal day look like?',
];

const badges = [
  { id: 1, name: 'First Story', icon: '🌟', description: 'Posted your very first anonymous story' },
  { id: 2, name: 'Honest Voice', icon: '🎙️', description: 'Shared 5 stories' },
  { id: 3, name: 'Heart Giver', icon: '❤️', description: 'Received 100 hearts across your stories' },
  { id: 4, name: 'Community Pillar', icon: '🤝', description: 'Your stories helped 50+ people feel seen' },
  { id: 5, name: 'Night Writer', icon: '🌙', description: 'Posted a story after midnight' },
  { id: 6, name: 'Bridge Builder', icon: '🌉', description: 'Completed your first parallel connection' },
  { id: 7, name: 'Deep Listener', icon: '🫂', description: 'Connected with 5 kindred spirits' },
];

const user = {
  id: 1,
  name: 'Alex Rivera',
  username: 'alexrivera',
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
  coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop',
  bio: 'Full-stack developer & open source enthusiast. Building things that matter.',
  location: 'San Francisco, CA',
  website: 'https://alexrivera.dev',
  joinedDate: 'March 2021',
  email: 'alex@example.com',
  storyCount: 2,
  totalHearts: 303,
  totalRelates: 77,
  peopleHelped: 45,
  badges: [1, 3, 5],
};

const habitCatalog = [
  { id: 'walk', name: 'Go for a walk', category: 'wellness' },
  { id: 'exercise', name: 'Exercise for 20+ min', category: 'wellness' },
  { id: 'meditate', name: 'Meditate for 5+ min', category: 'wellness' },
  { id: 'sleep', name: 'Sleep 7+ hours', category: 'wellness' },
  { id: 'water', name: 'Drink 8 glasses of water', category: 'wellness' },
  { id: 'journal', name: 'Write in a journal', category: 'self-care' },
  { id: 'read', name: 'Read for 15+ minutes', category: 'self-care' },
  { id: 'cook', name: 'Cook a meal from scratch', category: 'self-care' },
  { id: 'tidy', name: 'Tidy up your space', category: 'self-care' },
  { id: 'screentime', name: 'Go screen-free for 30 min', category: 'self-care' },
  { id: 'trynew', name: 'Try something new', category: 'bravery' },
  { id: 'sayyes', name: 'Say yes to an invitation', category: 'bravery' },
  { id: 'speakup', name: 'Speak up about something', category: 'bravery' },
  { id: 'alone', name: 'Go somewhere alone', category: 'bravery' },
  { id: 'askhelp', name: 'Ask for help', category: 'bravery' },
];

const affirmations = [
  'You are enough, exactly as you are.',
  'This too shall pass — feel it, then let it go.',
  'Your feelings are valid and deserve space.',
  'You don\'t have to be perfect to be worthy.',
  'Healing is not linear, and that is okay.',
  'One small step today is still progress.',
  'You\'ve survived every hard day before this one.',
  'Be kind to yourself — you are doing your best.',
  'It\'s okay to rest. You are not a machine.',
  'You deserve the love you so freely give to others.',
  'Growth happens outside your comfort zone.',
  'Your voice matters — use it when you\'re ready.',
];

export { user, topics, stories, prompts, badges, animalAvatars, habitCatalog, affirmations };
