import React, { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Composant d'affichage detaille d'un post
 * @param {Object} props - Proprietes du composant
 * @param {Object} props.post - Le post a afficher
 * @param {Function} props.onClose - Fonction pour fermer les details
 * @param {Function} props.onTagClick - Fonction appelee lors du clic sur un tag
 */
function PostDetails({ post, onClose, onTagClick }) {
  // Exercice 3 - Theme courant
  const { isDark } = useTheme();

  // Exercice 3 - Classes CSS memoisees selon le theme
  const themeClasses = useMemo(
    () => ({
      card: isDark ? 'card mb-4 bg-dark text-light border-secondary' : 'card mb-4',
      badge: isDark ? 'badge bg-light text-dark' : 'badge bg-secondary',
      button: isDark ? 'btn btn-sm btn-outline-light' : 'btn btn-sm btn-outline-dark'
    }),
    [isDark]
  );

  if (!post) return null;

  const reactions =
    typeof post.reactions === 'object' ? post.reactions.likes : post.reactions;

  return (
    <div className={themeClasses.card}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">{post.title}</h5>
        <button className={themeClasses.button} onClick={onClose} aria-label="Fermer">
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="card-body">
        {/* Exercice 4 - Contenu du post */}
        <p className="card-text">{post.body}</p>

        {/* Exercice 4 - Reactions et utilisateur */}
        <div className="d-flex gap-3 mb-3 text-muted">
          <span>
            <i className="bi bi-heart-fill text-danger me-1"></i>
            {reactions} reactions
          </span>
          <span>
            <i className="bi bi-person-fill me-1"></i>
            Utilisateur #{post.userId}
          </span>
        </div>

        {/* Exercice 4 - Tags */}
        <div className="d-flex flex-wrap gap-1">
          {(post.tags || []).map((tag) => (
            <span
              key={tag}
              className={themeClasses.badge}
              role="button"
              onClick={() => onTagClick && onTagClick(tag)}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Exercice 3 - React.memo pour optimiser les rendus
export default React.memo(PostDetails);
