// Client-side API utilities

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

// Helper function for API requests
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("adminToken")

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

    const response = await fetchWithAuth(`/api/markets?${queryParams}`)

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
    const response = await fetchWithAuth(`/api/markets/${id}`)

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
    const response = await fetchWithAuth("/api/markets", {
      method: "POST",
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

export const placeBet = async (betData) => {
  try {
    // For now, we'll simulate a successful bet placement since the endpoint doesn't exist yet
    // In a real app, you would uncomment the fetch call below

    // const response = await fetchWithAuth('/api/bets', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(betData),
    // });

    // if (!response.ok) {
    //   throw new Error(`Error: ${response.status}`);
    // }

    // return await response.json();

    // Simulate a successful response
    console.log("Simulating bet placement:", betData)

    // Wait for 1 second to simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: "bet_" + Math.random().toString(36).substring(2, 15),
      ...betData,
      timestamp: new Date().toISOString(),
      status: "confirmed",
    }
  } catch (error) {
    console.error("Error placing bet:", error)
    throw error
  }
}

