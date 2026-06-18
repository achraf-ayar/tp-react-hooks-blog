import React, { useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Composant de recherche de posts
 * @param {Object} props - Proprietes du composant
 * @param {Function} props.onSearch - Fonction appelee lors de la saisie
 * @param {Function} props.onTagSelect - Fonction appelee lors de la selection d'un tag
 * @param {Array} props.availableTags - Liste des tags disponibles
 * @param {string} props.selectedTag - Tag actuellement selectionne
 */
function PostSearch({
  onSearch,
  onTagSelect,
  availableTags = [],
  selectedTag = ''
}) {
  const [searchInput, setSearchInput] = useState('');

  // Exercice 3 - Theme courant
  const { isDark } = useTheme();

  // Exercice 3 - Gestionnaire memoise
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchInput(value);
      onSearch(value);
    },
    [onSearch]
  );

  // Exercice 1 - Effacer la recherche
  const handleClear = useCallback(() => {
    setSearchInput('');
    onSearch('');
  }, [onSearch]);

  // Exercice 3 - Classes adaptees au theme
  const themeClasses = isDark ? 'bg-dark text-light border-secondary' : '';

  return (
    <div className="mb-4">
      <div className="row">
        <div className="col-md-8 mb-3 mb-md-0">
          <div className="input-group">
            <span className={`input-group-text ${themeClasses}`}>
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className={`form-control ${themeClasses}`}
              placeholder="Rechercher des articles..."
              value={searchInput}
              onChange={handleSearchChange}
              aria-label="Rechercher"
            />
            {/* Exercice 1 - Bouton pour effacer la recherche */}
            {searchInput && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleClear}
                aria-label="Effacer la recherche"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
        </div>

        {/* Exercice 4 - Selecteur de tags */}
        <div className="col-md-4">
          <select
            className={`form-select ${themeClasses}`}
            value={selectedTag}
            onChange={(e) => onTagSelect && onTagSelect(e.target.value)}
            aria-label="Filtrer par tag"
          >
            <option value="">Tous les tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Exercice 3 - React.memo pour eviter les rendus inutiles
export default React.memo(PostSearch);
