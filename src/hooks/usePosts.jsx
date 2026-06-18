import { useState, useEffect, useCallback, useMemo } from 'react';
import useDebounce from './useDebounce';

/**
 * Hook personnalise pour gerer les posts du blog
 * @param {Object} options - Options de configuration
 * @param {string} options.searchTerm - Terme de recherche
 * @param {string} options.tag - Tag a filtrer
 * @param {number} options.limit - Nombre d'elements par page
 * @param {boolean} options.infinite - Mode de chargement infini vs pagination
 * @returns {Object} Etat et fonctions pour gerer les posts
 */
function usePosts({ searchTerm = '', tag = '', limit = 10, infinite = true } = {}) {
  // Etat local pour les posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Exercice 1 - Etats de pagination
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);

  // Exercice 4 - Post selectionne (vue detail)
  const [selectedPost, setSelectedPost] = useState(null);

  // Exercice 2 - On debounce le terme de recherche pour limiter les appels API
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Exercice 3 - Construction memoisee de l'URL en fonction des filtres
  const buildApiUrl = useCallback(
    (skipValue = 0) => {
      const params = `limit=${limit}&skip=${skipValue}`;

      if (tag) {
        return `https://dummyjson.com/posts/tag/${encodeURIComponent(tag)}?${params}`;
      }
      if (debouncedSearchTerm) {
        return `https://dummyjson.com/posts/search?q=${encodeURIComponent(debouncedSearchTerm)}&${params}`;
      }
      return `https://dummyjson.com/posts?${params}`;
    },
    [tag, debouncedSearchTerm, limit]
  );

  // Exercice 1 / 4 - Chargement des posts (reset = remplace, sinon ajoute)
  const fetchPosts = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        setError(null);

        const skipValue = reset ? 0 : skip;
        const response = await fetch(buildApiUrl(skipValue));
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();

        setTotal(data.total || 0);
        setPosts((prev) => (reset ? data.posts : [...prev, ...data.posts]));
        setSkip(skipValue + limit);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [buildApiUrl, skip, limit]
  );

  // Exercice 1 - Rechargement complet quand un filtre change
  useEffect(() => {
    fetchPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, tag, limit]);

  // Exercice 4 - Charger la page suivante (defilement infini / bouton)
  const loadMore = useCallback(() => {
    if (!loading && posts.length < total) {
      fetchPosts(false);
    }
  }, [loading, posts.length, total, fetchPosts]);

  // Y a-t-il encore des posts a charger ?
  const hasMore = posts.length < total;

  // Exercice 3 - Liste memoisee des tags uniques presents dans les posts
  const availableTags = useMemo(() => {
    const tagsSet = new Set();
    posts.forEach((post) => (post.tags || []).forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet).sort();
  }, [posts]);

  // Exercice 4 - Charger un post precis par son ID
  const fetchPostById = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`https://dummyjson.com/posts/${id}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      setSelectedPost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    total,
    hasMore,
    loadMore,
    availableTags,
    selectedPost,
    setSelectedPost,
    fetchPostById
  };
}

export default usePosts;
