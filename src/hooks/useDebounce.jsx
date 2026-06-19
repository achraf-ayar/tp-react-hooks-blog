import { useState, useEffect } from 'react';

/**
 * Hook personnalise pour debouncer une valeur
 * @param {any} value - La valeur a debouncer
 * @param {number} delay - Le delai en millisecondes
 * @returns {any} La valeur apres le delai
 */
function useDebounce(value, delay = 500) {
  // Exercice 2 - Etat qui stocke la valeur debouncee
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // On programme la mise a jour apres le delai
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyage : annule le timer si value ou delay change avant la fin
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
