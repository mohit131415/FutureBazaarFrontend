// Client-side API utilities

// Helper function for API requests
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("adminToken")

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle unauthorized responses
  if (response.status === 401) {
    localStorage.removeItem("adminToken")
    window.location.href = "/admin/login"
    throw new Error("Unauthorized")
  }

  return response
}

// Public API functions
export async function fetchMarkets(page = 1, limit = 20, search = "", category = "") {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (search) {
      queryParams.append("search", search)
    }

    if (category && category !== "all") {
      queryParams.append("category", category)
    }

    const response = await fetch(`/api/markets?${queryParams}`)

    if (!response.ok) {
      throw new Error("Failed to fetch markets")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching markets:", error)
    throw error
  }
}

export async function fetchMarket(id) {
  try {
    const response = await fetch(`/api/markets/${id}`)

    if (!response.ok) {
      throw new Error("Failed to fetch market")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching market:", error)
    throw error
  }
}

export async function createMarket(marketData) {
  try {
    // No auth needed for public market creation
    const response = await fetch("/api/markets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(marketData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create market")
    }

    return response.json()
  } catch (error) {
    console.error("Error creating market:", error)
    throw error
  }
}

export async function placeBet(betData) {
  try {
    // No auth needed for placing bets
    const response = await fetch("/api/bets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(betData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to place bet")
    }

    return response.json()
  } catch (error) {
    console.error("Error placing bet:", error)
    throw error
  }
}

