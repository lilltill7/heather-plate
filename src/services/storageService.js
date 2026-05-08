const KEY = 'heather_plate_v4';

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveData({ recipes, calendar, settings }) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ recipes, calendar, settings }));
  } catch {
    console.warn('Could not save to localStorage');
  }
}

export function clearData() {
  localStorage.removeItem(KEY);
}
