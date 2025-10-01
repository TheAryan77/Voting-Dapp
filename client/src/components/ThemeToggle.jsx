import React, { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ui-theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const body = document.body;
    if (theme === 'light') body.classList.add('theme-light'); else body.classList.remove('theme-light');
    localStorage.setItem('ui-theme', theme);
  }, [theme]);

  return (
    <div className="theme-toggle" role="group" aria-label="Theme toggle">
      <button
        type="button"
        className={theme === 'dark' ? 'active' : ''}
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
      >Dark</button>
      <button
        type="button"
        className={theme === 'light' ? 'active' : ''}
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
      >Light</button>
    </div>
  );
}
