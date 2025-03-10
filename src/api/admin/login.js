// API route for admin login
import { validateAdminCredentials, generateToken, storeToken } from "../../lib/auth"

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { username, password } = req.body

    // Validate credentials
    if (!validateAdminCredentials(username, password)) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate and store token
    const token = generateToken()
    storeToken(token)

    // Return token
    return res.status(200).json({ token })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

