import React, { useState, useCallback } from 'react';
import './App.css';
import PostList from './components/PostList';
import PostSearch from './components/PostSearch';
import PostDetails from './components/PostDetails';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import usePosts from './hooks/usePosts';
import useLocalStorage from './hooks/useLocalStorage';

/**
 * Contenu de l'application (consomme le contexte de theme).
 */
function BlogContent() {
  const { isDark } = useTheme();

  // Etat local pour la recherche
  const [searchTerm, setSearchTerm] = useState('');
  // Exercice 4 - Tag selectionne
  const [selectedTag, setSelectedTag] = useState('');

  // Exercice 2 - Mode de defilement persiste dans le localStorage
  const [infiniteScroll, setInfiniteScroll] = useLocalStorage('infiniteScroll', true);

  // Exercice 1 - Recuperation des posts via le hook
  const {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    availableTags,
    selectedPost,
    setSelectedPost,
    fetchPostById
  } = usePosts({ searchTerm, tag: selectedTag, limit: 9, infinite: infiniteScroll });

  // Exercice 3 - Gestionnaires memoises
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleTagSelect = useCallback((tag) => {
    setSelectedTag(tag);
  }, []);

  // Exercice 4 - Clic sur un post -> chargement du detail
  const handlePostClick = useCallback(
    (post) => {
      fetchPostById(post.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [fetchPostById]
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedPost(null);
  }, [setSelectedPost]);

  return (
    <div className="container py-4">
      <header className="pb-3 mb-4 border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="display-5 fw-bold">Blog</h1>
          {/* Exercice 3 - Bascule de theme */}
          <ThemeToggle />
        </div>
      </header>

      <main>
        <PostSearch
          onSearch={handleSearchChange}
          onTagSelect={handleTagSelect}
          availableTags={availableTags}
          selectedTag={selectedTag}
        />

        {/* Exercice 2 - Choix du mode de defilement */}
        <div className="form-check form-switch mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="infiniteScrollSwitch"
            checked={infiniteScroll}
            onChange={(e) => setInfiniteScroll(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="infiniteScrollSwitch">
            Defilement infini {infiniteScroll ? '(active)' : '(desactive)'}
          </label>
        </div>

        {/* Exercice 1 - Message d'erreur */}
        {error && (
          <div className="alert alert-danger" role="alert">
            Une erreur est survenue : {error}
          </div>
        )}

        {/* Exercice 4 - Detail d'un post */}
        {selectedPost && (
          <PostDetails
            post={selectedPost}
            onClose={handleCloseDetails}
            onTagClick={handleTagSelect}
          />
        )}

        {/* Exercice 1 - Liste des posts */}
        <PostList
          posts={posts}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onPostClick={handlePostClick}
          onTagClick={handleTagSelect}
          infiniteScroll={infiniteScroll}
        />
      </main>

      <footer className="pt-3 mt-4 text-center border-top">
        <p className={isDark ? 'text-light' : ''}>
          TP React Hooks - Blog &middot; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

/**
 * Composant racine : fournit le contexte de theme a toute l'application.
 */
function App() {
  return (
    <ThemeProvider>
      <BlogContent />
    </ThemeProvider>
  );
}

export default App;
