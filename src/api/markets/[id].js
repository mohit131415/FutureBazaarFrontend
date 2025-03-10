// API route for market by ID (get, update, delete)
import { connectToDatabase, Market } from "../../../lib/db"
import { validateToken } from "../../../lib/auth"

export default async function handler(req, res) {
  // Validate token
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.substring(7)
  if (!validateToken(token)) {
    return res.status(401).json({ message: "Invalid token" })
  }

  // Get market ID from URL
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ message: "Market ID is required" })
  }

  // Connect to database
  try {
    await connectToDatabase()
  } catch (error) {
    console.error("Database connection error:", error)
    return res.status(500).json({ message: "Database connection error" })
  }

  // Handle GET request (get market by ID)
  if (req.method === "GET") {
    try {
      const market = await Market.findById(id)

      if (!market) {
        return res.status(404).json({ message: "Market not found" })
      }

      return res.status(200).json(market)
    } catch (error) {
      console.error("Error fetching market:", error)
      return res.status(500).json({ message: "Error fetching market" })
    }
  }

  // Handle PUT request (update market)
  if (req.method === "PUT") {
    try {
      const marketData = req.body

      // Validate required fields
      if (!marketData.title || !marketData.category || !marketData.endDate) {
        return res.status(400).json({ message: "Missing required fields" })
      }

      // Update market
      const market = await Market.findByIdAndUpdate(
        id,
        { ...marketData, updatedAt: Date.now() },
        { new: true, runValidators: true },
      )

      if (!market) {
        return res.status(404).json({ message: "Market not found" })
      }

      return res.status(200).json(market)
    } catch (error) {
      console.error("Error updating market:", error)
      return res.status(500).json({ message: "Error updating market" })
    }
  }

  // Handle DELETE request (delete market)
  if (req.method === "DELETE") {
    try {
      const market = await Market.findByIdAndDelete(id)

      if (!market) {
        return res.status(404).json({ message: "Market not found" })
      }

      return res.status(200).json({ message: "Market deleted successfully" })
    } catch (error) {
      console.error("Error deleting market:", error)
      return res.status(500).json({ message: "Error deleting market" })
    }
  }

  // Method not allowed
  return res.status(405).json({ message: "Method not allowed" })
}

