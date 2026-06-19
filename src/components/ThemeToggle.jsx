import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Bouton de bascule entre theme clair et sombre (Exercice 3)
 */
function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      className={`btn ${isDark ? 'btn-light' : 'btn-dark'}`}
      onClick={toggleTheme}
      aria-label="Changer de theme"
      title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill'} me-2`}></i>
      {theme === 'dark' ? 'Clair' : 'Sombre'}
    </button>
  );
}

export default ThemeToggle;
