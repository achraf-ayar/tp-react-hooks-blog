import React, { createContext, useContext, useCallback, useMemo, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Creer le contexte
const ThemeContext = createContext();

/**
 * Provider pour le contexte de theme
 * @param {Object} props - Proprietes du composant
 * @param {React.ReactNode} props.children - Enfants du provider
 */
export function ThemeProvider({ children }) {
  // Exercice 3 - Le theme est persiste dans le localStorage (Exercice 2)
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  // Bascule entre clair et sombre (useCallback : reference stable)
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  // Applique le theme au body pour les styles globaux (data-bs-theme de Bootstrap 5.3)
  useEffect(() => {
    document.body.setAttribute('data-bs-theme', theme);
    document.body.classList.toggle('bg-dark', theme === 'dark');
    document.body.classList.toggle('text-light', theme === 'dark');
  }, [theme]);

  // useMemo : on ne recree la valeur que si theme/toggleTheme changent
  const value = useMemo(
    () => ({ theme, toggleTheme, isDark: theme === 'dark' }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook personnalise pour utiliser le contexte de theme
 * @returns {Object} Contexte de theme
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme doit etre utilise a l\'interieur d\'un ThemeProvider');
  }
  return context;
}

export default ThemeContext;
