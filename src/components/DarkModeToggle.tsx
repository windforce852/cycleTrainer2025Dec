import React, { useEffect, useState } from 'react'

export const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or system preference
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) {
      return stored === 'true'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Apply dark mode class on mount and whenever isDark changes
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-6 right-6 z-50 w-14 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-2xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 hover:bg-gray-900 dark:hover:bg-gray-100"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

