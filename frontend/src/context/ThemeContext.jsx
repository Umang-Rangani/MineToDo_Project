import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const themes = {
  biscuit: {
    name: 'Biscuit',
    emoji: '🍪',
    colors: {
      bg: '#F7F0E7',
      surface: '#FFF9F2',
      card: '#FFF9F2',
      soft: '#F7EBDD',
      primary: '#B8794A',
      primaryDark: '#7E563B',
      secondary: '#A66F48',
      text: '#3B2A20',
      muted: '#806F62',
      border: '#E4D5C5',
      borderSoft: '#E8D8C8',
      danger: '#B24F43',
      dangerBg: '#FFF1EE',
    },
  },

  sage: {
    name: 'Sage',
    emoji: '🌿',
    colors: {
      bg: '#EEF3EA',
      surface: '#FAFCF8',
      card: '#FFFFFF',
      soft: '#E2EBDD',
      primary: '#6F8B68',
      primaryDark: '#4F6850',
      secondary: '#7E9A75',
      text: '#26352A',
      muted: '#68766B',
      border: '#D5DFD1',
      borderSoft: '#E2E9DE',
      danger: '#B24F43',
      dangerBg: '#FFF1EE',
    },
  },

  ocean: {
    name: 'Ocean',
    emoji: '🌊',
    colors: {
      bg: '#EEF5F8',
      surface: '#FAFCFD',
      card: '#FFFFFF',
      soft: '#E1EEF3',
      primary: '#4D8398',
      primaryDark: '#315F72',
      secondary: '#6298AA',
      text: '#24343B',
      muted: '#687A82',
      border: '#D3E1E6',
      borderSoft: '#E1EBEF',
      danger: '#B24F43',
      dangerBg: '#FFF1EE',
    },
  },

  lavender: {
    name: 'Lavender',
    emoji: '💜',
    colors: {
      bg: '#F3F0F8',
      surface: '#FCFAFE',
      card: '#FFFFFF',
      soft: '#EAE3F2',
      primary: '#8065A3',
      primaryDark: '#60477F',
      secondary: '#947BB4',
      text: '#332B3D',
      muted: '#756D7D',
      border: '#DED6E7',
      borderSoft: '#E9E3EF',
      danger: '#B24F43',
      dangerBg: '#FFF1EE',
    },
  },

  rose: {
    name: 'Rose',
    emoji: '🌸',
    colors: {
      bg: '#F8F0F1',
      surface: '#FFF9F9',
      card: '#FFFFFF',
      soft: '#F4E1E4',
      primary: '#B56F7A',
      primaryDark: '#8C4F5A',
      secondary: '#C0838D',
      text: '#3D2B2F',
      muted: '#806C70',
      border: '#E8D4D8',
      borderSoft: '#F0E0E3',
      danger: '#B24F43',
      dangerBg: '#FFF1EE',
    },
  },
}

const THEME_STORAGE_KEY = 'minespace_theme'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

    if (savedTheme && themes[savedTheme]) {
      return savedTheme
    }

    return 'biscuit'
  })

  useEffect(() => {
    const selectedTheme = themes[theme]

    if (!selectedTheme) {
      return
    }

    const root = document.documentElement

    Object.entries(selectedTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    root.setAttribute('data-theme', theme)

    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const changeTheme = (themeName) => {
    if (!themes[themeName]) {
      return
    }

    setTheme(themeName)
  }

  const value = {
    theme,
    themes,
    changeTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return context
}

export default ThemeContext
