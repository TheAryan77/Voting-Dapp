import React, { useEffect, useState } from 'react';

const THEMES = [
  { key: 'dark', label: 'Dark' },
  { key: 'light', label: 'Light' },
  { key: 'vibrant', label: 'Vibrant' },
  { key: 'sunset', label: 'Sunset' },
  { key: 'violet', label: 'Violet' },
  { key: 'ocean', label: 'Ocean' },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ui-theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const body = document.body;
    // Remove all theme-* classes first
    body.classList.remove(
      'theme-light','theme-vibrant','theme-sunset','theme-violet','theme-ocean'
    );
    if (theme !== 'dark') {
      body.classList.add(`theme-${theme}`);
    }
    localStorage.setItem('ui-theme', theme);
  }, [theme]);

  return (
    <div className="theme-toggle" role="group" aria-label="Theme toggle" style={{flexWrap:'wrap'}}>
      {THEMES.map(t => (
        <button
          key={t.key}
            type="button"
            className={theme === t.key ? 'active' : ''}
            onClick={() => setTheme(t.key)}
            aria-pressed={theme === t.key}
            title={`Switch to ${t.label} theme`}
        >{t.label}</button>
      ))}
    </div>
  );
}
