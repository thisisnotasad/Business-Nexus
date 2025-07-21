// Utility function to debounce a callback, ensuring it’s called only after a specified delay
// Prevents excessive function calls during rapid events (e.g., typing)
export function debounce(func, wait) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}