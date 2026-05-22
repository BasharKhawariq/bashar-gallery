'use client';

import { FC, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeToggle: FC = () => {
  const [mounted, setMounted] = useState(false);

  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  return (
    <button
      aria-label="Toggle Theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
