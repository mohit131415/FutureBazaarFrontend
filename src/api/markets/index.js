// API route for markets (list, create)
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

  // Connect to database
  try {
    await connectToDatabase()
  } catch (error) {
    console.error("Database connection error:", error)
    return res.status(500).json({ message: "Database connection error" })
  }

  // Handle GET request (list markets)
  if (req.method === "GET") {
    try {
      const page = Number.parseInt(req.query.page) || 1
      const limit = Number.parseInt(req.query.limit) || 10
      const skip = (page - 1) * limit

      // Build query
      const query = {}

      // Add search filter if provided
      if (req.query.search) {
        query.title = { $regex: req.query.search, $options: "i" }
      }

      // Add category filter if provided
      if (req.query.category) {
        query.category = req.query.category
      }

      // Get total count for pagination
      const total = await Market.countDocuments(query)

      // Get markets with pagination
      const markets = await Market.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

      return res.status(200).json({
        markets,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      })
    } catch (error) {
      console.error("Error fetching markets:", error)
      return res.status(500).json({ message: "Error fetching markets" })
    }
  }

  // Handle POST request (create market)
  if (req.method === "POST") {
    try {
      const marketData = req.body

      // Validate required fields
      if (!marketData.title || !marketData.category || !marketData.endDate) {
        return res.status(400).json({ message: "Missing required fields" })
      }

      // Create new market
      const market = new Market(marketData)
      await market.save()

      return res.status(201).json(market)
    } catch (error) {
      console.error("Error creating market:", error)
      return res.status(500).json({ message: "Error creating market" })
    }
  }

  // Method not allowed
  return res.status(405).json({ message: "Method not allowed" })
}

