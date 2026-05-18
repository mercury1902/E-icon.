import { useState } from 'react';
import { useApp } from '../../context/AppContext';

function DailyPrompt() {
  const { prompts } = useApp();
  const [index] = useState(() => Math.floor(Math.random() * prompts.length));
  const prompt = prompts[index];

  return (
    <div className="daily-prompt">
      <span className="prompt-icon">💭</span>
      <div>
        <span className="prompt-label">Today&apos;s Prompt</span>
        <p className="prompt-text">{prompt}</p>
      </div>
    </div>
  );
}

export default DailyPrompt;
