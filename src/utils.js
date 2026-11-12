// ===== SET YOUR OWN ADMIN LOGIN HERE =====
export const ADMIN_EMAIL = "mahesh@gmail.com";
export const ADMIN_PASSWORD = "Mahesh@799";
// =========================================

export const RESTAURANTS = [
  { name: "Spice Garden", cuisine: "Indian", icon: "🍛" },
  { name: "Pizza Palace", cuisine: "Italian", icon: "🍕" },
  { name: "Dragon Wok", cuisine: "Chinese", icon: "🥡" },
  { name: "Burger Barn", cuisine: "Fast Food", icon: "🍔" },
  { name: "Sushi Zen", cuisine: "Japanese", icon: "🍣" },
  { name: "Sweet Tooth", cuisine: "Desserts", icon: "🍰" }
];
export const CATEGORIES = ["Food Quality", "Service", "Ambience", "Cleanliness", "Price", "Suggestion"];

export const get = (key, fallback) => JSON.parse(localStorage.getItem(key)) || fallback;
export const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// Keep exactly one admin account, using the credentials above
export function ensureAdmin() {
  const users = get("users", []).filter(u => u.role !== "admin" && u.email !== ADMIN_EMAIL);
  users.push({ name: "Admin", email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: "admin" });
  set("users", users);

  const session = get("session", null);
  if (session && session.role === "admin" && session.email !== ADMIN_EMAIL) {
    localStorage.removeItem("session");
  }
}

export function logout() {
  localStorage.removeItem("session");
  window.location.href = "/";
}

export const stars = n => "★".repeat(n) + "☆".repeat(5 - n);
export const avg = list =>
  list.length ? (list.reduce((t, f) => t + f.rating, 0) / list.length).toFixed(1) : "–";