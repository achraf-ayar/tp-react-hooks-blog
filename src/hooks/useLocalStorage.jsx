import { useState, useEffect } from 'react';

/**
 * Hook personnalise pour gerer le stockage local
 * @param {string} key - La cle de stockage local
 * @param {any} initialValue - La valeur initiale si rien n'est trouve dans localStorage
 * @returns {[any, function]} Valeur stockee et fonction pour la mettre a jour
 */
function useLocalStorage(key, initialValue) {
  // Exercice 2 - Initialisation paresseuse depuis localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur de lecture de la cle "${key}" :`, error);
      return initialValue;
    }
  });

  // On synchronise localStorage a chaque changement de valeur
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Erreur d'ecriture de la cle "${key}" :`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
