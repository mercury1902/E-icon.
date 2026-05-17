const adjectives = [
  'Gentle', 'Quiet', 'Soft', 'Warm', 'Calm', 'Bright', 'Deep', 'Free',
  'Kind', 'Brave', 'True', 'Wild', 'Still', 'Fair', 'Pure', 'Bold',
  'Sage', 'Clear', 'Rising', 'Steady', 'Lunar', 'Solar', 'Silent', 'Honest'
];
const nouns = [
  'Oak', 'Wave', 'Glow', 'Sky', 'Moon', 'Star', 'River', 'Forest',
  'Heart', 'Light', 'Pine', 'Cloud', 'Breeze', 'Dawn', 'Meadow',
  'Tide', 'Haven', 'Ember', 'Willow', 'Cedar', 'Stone', 'Feather',
  'Horizon', 'Garden'
];
const avatarColors = [
  '#A78BFA', '#67E8F9', '#6EE7B7', '#F87171', '#FBBF24', '#60A5FA',
  '#E879F9', '#34D399', '#38BDF8', '#FB923C'
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generatePseudonym() {
  const adj = randomItem(adjectives);
  const noun = randomItem(nouns);
  return { name: adj + noun };
}

export function getAvatarColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function getInitials(name) {
  return name.charAt(0).toUpperCase();
}
