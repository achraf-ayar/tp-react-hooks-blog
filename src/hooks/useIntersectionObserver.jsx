import { useState, useEffect, useRef } from 'react';

/**
 * Hook personnalise pour detecter quand un element devient visible dans le viewport
 * @param {Object} options - Options pour l'IntersectionObserver
 * @param {boolean} options.enabled - Est-ce que l'observer est actif
 * @param {number} options.threshold - Seuil de visibilite de l'element (0 a 1)
 * @param {string} options.rootMargin - Marge autour de la racine
 * @returns {[React.RefObject, boolean]} Reference a attacher et etat d'intersection
 */
function useIntersectionObserver({
  enabled = true,
  threshold = 0.1,
  rootMargin = '0px'
} = {}) {
  // Exercice 4 - Etat d'intersection + reference sur l'element sentinelle
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!enabled || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Nettoyage : on arrete d'observer au demontage / changement d'options
    return () => observer.disconnect();
  }, [enabled, threshold, rootMargin]);

  return [targetRef, isIntersecting];
}

export default useIntersectionObserver;
