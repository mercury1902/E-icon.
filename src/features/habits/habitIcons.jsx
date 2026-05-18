const a = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };

const habitIcons = {
  walk: (
    <svg {...a}>
      <path d="M13 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0z" />
      <path d="M8 21l3-7 3 4 3-4" />
      <path d="M10 12l-2 4" />
      <path d="M16 21l-2-4" />
    </svg>
  ),
  exercise: (
    <svg {...a}>
      <circle cx="12" cy="5" r="1" />
      <path d="M9 21l1-7-3-3 2-4" />
      <path d="M15 21l-1-7 3-3-2-4" />
      <path d="M12 14l-1-4" />
      <path d="M6 3l-1 2 2 1" />
      <path d="M18 3l1 2-2 1" />
    </svg>
  ),
  meditate: (
    <svg {...a}>
      <circle cx="12" cy="5" r="1" />
      <path d="M9 21l1-6 2-2 2 2 1 6" />
      <path d="M12 13V8" />
      <path d="M6 9l3 1" />
      <path d="M18 9l-3 1" />
    </svg>
  ),
  sleep: (
    <svg {...a}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  water: (
    <svg {...a}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  journal: (
    <svg {...a}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
  read: (
    <svg {...a}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M12 6v7" />
      <path d="M9 9l3-3 3 3" />
    </svg>
  ),
  cook: (
    <svg {...a}>
      <path d="M6 12h12" />
      <path d="M6 20v-8a6 6 0 0 1 12 0v8" />
      <path d="M8 18h8" />
    </svg>
  ),
  tidy: (
    <svg {...a}>
      <path d="M3 21h18" />
      <path d="M7 21v-6" />
      <path d="M17 21v-6" />
      <path d="M9 3h6l2 6H7l2-6z" />
    </svg>
  ),
  screentime: (
    <svg {...a}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  ),
  trynew: (
    <svg {...a}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  sayyes: (
    <svg {...a}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  speakup: (
    <svg {...a}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  alone: (
    <svg {...a}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M17 11l2 2 4-4" />
    </svg>
  ),
  askhelp: (
    <svg {...a}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

export default habitIcons;
