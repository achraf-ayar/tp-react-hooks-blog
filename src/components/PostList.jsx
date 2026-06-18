import React, { useCallback, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import LoadingSpinner from './LoadingSpinner';

/**
 * Composant d'affichage de la liste des posts
 * @param {Object} props - Proprietes du composant
 * @param {Array} props.posts - Liste des posts a afficher
 * @param {boolean} props.loading - Indicateur de chargement
 * @param {boolean} props.hasMore - Indique s'il y a plus de posts a charger
 * @param {Function} props.onLoadMore - Fonction pour charger plus de posts
 * @param {Function} props.onPostClick - Fonction appelee au clic sur un post
 * @param {Function} props.onTagClick - Fonction appelee au clic sur un tag
 * @param {boolean} props.infiniteScroll - Mode de defilement infini active ou non
 */
function PostList({
  posts = [],
  loading = false,
  hasMore = false,
  onLoadMore,
  onPostClick,
  onTagClick,
  infiniteScroll = true
}) {
  // Exercice 3 - Theme courant
  const { isDark } = useTheme();

  // Exercice 4 - Sentinelle pour le defilement infini
  const [sentinelRef, isIntersecting] = useIntersectionObserver({
    enabled: infiniteScroll && hasMore && !loading,
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Quand la sentinelle devient visible, on charge la suite
  useEffect(() => {
    if (isIntersecting && infiniteScroll && hasMore && !loading) {
      onLoadMore && onLoadMore();
    }
  }, [isIntersecting, infiniteScroll, hasMore, loading, onLoadMore]);

  // Exercice 3 - Gestionnaires memoises
  const handlePostClick = useCallback(
    (post) => {
      if (onPostClick) onPostClick(post);
    },
    [onPostClick]
  );

  const handleTagClick = useCallback(
    (e, tag) => {
      e.stopPropagation(); // Evite de declencher le clic sur le post
      if (onTagClick) onTagClick(tag);
    },
    [onTagClick]
  );

  const cardClasses = isDark ? 'card h-100 bg-dark text-light border-secondary' : 'card h-100';

  // Exercice 1 - Cas sans post (et hors chargement)
  if (!loading && posts.length === 0) {
    return (
      <div className="alert alert-info text-center" role="alert">
        Aucun article trouve.
      </div>
    );
  }

  return (
    <div className="post-list">
      {/* Exercice 1 - Affichage de la liste */}
      <div className="row g-4">
        {posts.map((post) => (
          <div className="col-md-6 col-lg-4" key={post.id}>
            <div className={cardClasses} onClick={() => handlePostClick(post)}>
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">
                  {post.body.length > 120 ? `${post.body.slice(0, 120)}...` : post.body}
                </p>
                <div className="d-flex flex-wrap gap-1 mb-2">
                  {(post.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="badge bg-secondary"
                      onClick={(e) => handleTagClick(e, tag)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <small className="text-muted">
                  <i className="bi bi-heart-fill text-danger me-1"></i>
                  {typeof post.reactions === 'object'
                    ? post.reactions.likes
                    : post.reactions}{' '}
                  reactions
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spinner de chargement */}
      {loading && <LoadingSpinner />}

      {/* Exercice 4 - Sentinelle pour le defilement infini */}
      {infiniteScroll && hasMore && <div ref={sentinelRef} style={{ height: '1px' }} />}

      {/* Exercice 1 - Bouton "Charger plus" en mode non-infini */}
      {!infiniteScroll && hasMore && !loading && (
        <div className="text-center my-4">
          <button className="btn btn-primary" onClick={onLoadMore}>
            Charger plus
          </button>
        </div>
      )}
    </div>
  );
}

// Exercice 3 - React.memo pour optimiser les rendus
export default React.memo(PostList);
