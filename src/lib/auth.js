// Simple authentication for admin routes
// In a real application, you would use a more robust authentication system

// Admin credentials - in production, these would be securely stored
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"

export function validateAdminCredentials(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

// Simple token generation
export function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// In-memory token storage (would use a database in production)
const validTokens = new Set()

export function storeToken(token) {
  validTokens.add(token)
}

export function validateToken(token) {
  return validTokens.has(token)
}

export function removeToken(token) {
  validTokens.delete(token)
}

