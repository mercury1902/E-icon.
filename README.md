# Whisper

An anonymous social platform focused on user well-being. Share stories, track habits, log moods, and connect with kindred spirits — all while staying anonymous.

Built with **React 19** + **Vite**.

---

## Features

### Core
- **Anonymous Story Posting** — Share thoughts with a pseudonym
- **Topic Feed** — Filter stories by topic (Confession, Vent, Advice, etc.)
- **Reactions** — Heart, Relate, Fire
- **Threaded Comments** — Reply to comments with nested discussions
- **Content Warnings** — Blur sensitive content behind a warning
- **Ephemeral Stories** — Stories that vanish after 24 hours
- **Save / Hide Stories** — Personal feed curation

### Well-being
- **Daily Mood Check-in** — Log your mood each day + calendar view
- **Habit Tracker** — Daily and weekly habit tracking with streaks
- **Daily Affirmations** — Randomized affirmations
- **Breathing Exercise** — Guided breathing tool
- **Writing Prompts** — Daily prompts to inspire sharing

### Social
- **Profile** — Stats, badges, edit profile
- **Badges** — Earnable achievements
- **Dark / Light Theme** — Persistent preference

---

## Parallel Chat 🧑‍🤝‍🧑

A feature that matches anonymous users for private, time-limited conversations based on shared preferences. Users select what they want to share (advice / story), what they want to hear (advice / story), and a gender preference, then the system searches for a match.

### Current Status

The UI is fully built **except the database integration**. The matching flow currently:

1. User opens **Navbar → Parallel Chat** → picks preferences
2. User clicks **Find Someone**
3. UI shows a 5-second search animation
4. UI displays **"No one available right now"**

This is intentional — it awaits a real backend.

### Architecture

```
src/features/parallel/
├── ParallelContext.jsx       # State management + matching logic
├── ParallelMatchingPrefs.jsx # Preference selection form (modal)
├── FindMatchModal.jsx        # Search animation + failure state
├── ParallelChat.jsx          # Private chat UI (ready for real data)
├── ParallelHistory.jsx       # Active / expired conversation list
├── ParallelEntry.jsx         # Story-page entry button (secondary)
└── parallel.css              # All styles

src/data/
└── parallelMockData.js       # Placeholder partner definitions
```

### Hooking up the Real Backend

The code is designed so you only need to touch **one file** to make matching work:

#### `src/features/parallel/ParallelContext.jsx`

**`startMatching` function** (around line 22):

```jsx
// Current (placeholder):
const startMatching = useCallback(async () => {
  setIsMatching(true);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  setIsMatching(false);
  return { success: false };
}, []);
```

**Replace with your API call:**

```jsx
const startMatching = useCallback(async (prefs) => {
  setIsMatching(true);
  try {
    const res = await fetch('/api/parallel/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
    });
    const data = await res.json();
    setIsMatching(false);

    if (data.threadId) {
      // Add the new thread from the server to local state
      setThreads((prev) => [data.thread, ...prev]);
      return { success: true, threadId: data.threadId };
    }
    return { success: false };
  } catch {
    setIsMatching(false);
    return { success: false };
  }
}, []);
```

The `prefs` object passed to `startMatching` has this shape:

```ts
{
  shareType: 'advice' | 'story',
  hearType: 'advice' | 'story',
  genderPref: 'any' | 'male' | 'female' | 'nonbinary',
}
```

**When a match is found**, the UI automatically:
- Closes the search modal
- Opens `ParallelChat` with the thread
- Shows the conversation in `ParallelHistory`

#### Thread Data Model (expected from backend)

```ts
{
  id: number,
  prefs: { shareType, hearType, genderPref },
  partnerName: string,
  partnerAvatar: string,     // animal emoji
  createdAt: string,         // ISO
  expiresAt: string,         // ISO (48h from creation)
  status: 'active' | 'expired',
  messages: [
    {
      id: number,
      fromPartner: boolean,
      content: string,
      timestamp: string,     // ISO
      read: boolean,
    }
  ],
}
```

#### `ParallelChat.jsx`

The chat interface is fully functional. When a thread has messages, they display as bubbles. The 48-hour timer counts down. Users can close the conversation, which sets `status: 'expired'`. The "End Conversation" flow and "Memories" view are all wired up.

#### Messaging

The `addMessage(threadId, content)` function in `ParallelContext` currently only saves the user's message locally. When you add a backend, update it to:

1. POST the message to your API
2. Listen for real-time responses (WebSocket or polling)
3. Update the thread with the partner's reply

---

### Storage

Currently uses **`localStorage`** for persistence under the key `parallelThreads`. When you connect a backend, replace `localStorage` calls with API requests. The localStorage logic lives in `ParallelContext`:

```jsx
// Reads persisted threads
const [threads, setThreads] = useState(() => {
  try {
    const saved = localStorage.getItem('parallelThreads');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

// Writes on every change
useEffect(() => {
  localStorage.setItem('parallelThreads', JSON.stringify(threads));
}, [threads]);
```

Replace with server-side state management when ready.

---

## Getting Started

```bash
npm install
npm run dev      # Development server (Vite HMR)
npm run build    # Production build
npm run lint     # ESLint
```
