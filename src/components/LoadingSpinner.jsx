import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Composant d'indicateur de chargement
 */
function LoadingSpinner() {
  // Exercice 3 - Adapte la couleur du spinner au theme
  const { isDark } = useTheme();

  return (
    <div className="d-flex justify-content-center my-4">
      <div
        className={`spinner-border ${isDark ? 'text-light' : 'text-primary'}`}
        role="status"
      >
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
