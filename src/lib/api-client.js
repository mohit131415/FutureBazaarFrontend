// Client-side API utilities

// Helper function for API requests
export async function fetchWithAuth(url, options = {}) {
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
  
  // Admin API functions
  export async function loginAdmin(credentials) {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }
  
    return response.json()
  }
  
  export async function validateAdminToken() {
    const response = await fetchWithAuth("/api/admin/validate")
  
    if (!response.ok) {
      throw new Error("Invalid token")
    }
  
    return response.json()
  }
  
  export async function fetchMarkets(page = 1, limit = 10, search = "", category = "") {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      category,
    })
  
    const response = await fetchWithAuth(`/api/admin/markets?${queryParams}`)
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch markets")
    }
  
    return response.json()
  }
  
  export async function fetchMarket(id) {
    const response = await fetchWithAuth(`/api/admin/markets/${id}`)
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch market")
    }
  
    return response.json()
  }
  
  export async function createMarket(marketData) {
    const response = await fetchWithAuth("/api/admin/markets", {
      method: "POST",
      body: JSON.stringify(marketData),
    })
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create market")
    }
  
    return response.json()
  }
  
  export async function updateMarket(id, marketData) {
    const response = await fetchWithAuth(`/api/admin/markets/${id}`, {
      method: "PUT",
      body: JSON.stringify(marketData),
    })
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update market")
    }
  
    return response.json()
  }
  
  export async function deleteMarket(id) {
    const response = await fetchWithAuth(`/api/admin/markets/${id}`, {
      method: "DELETE",
    })
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete market")
    }
  
    return response.json()
  }
  
  