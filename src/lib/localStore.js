const store = {};

export const getLocal = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return store[key] || null;
  }
};

export const setLocal = (key, value) => {
  store[key] = value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be full or unavailable
  }
};
