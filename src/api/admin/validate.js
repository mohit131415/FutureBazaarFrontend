// API route for validating admin token
import { validateToken } from "../../lib/auth"

export default async function handler(req, res) {
  // Only allow GET method
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.substring(7)

    // Validate token
    if (!validateToken(token)) {
      return res.status(401).json({ message: "Invalid token" })
    }

    // Return success
    return res.status(200).json({ valid: true })
  } catch (error) {
    console.error("Token validation error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

