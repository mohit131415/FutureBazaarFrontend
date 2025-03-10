"use client"

import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import MarketDetail from "../components/market-detail"
import { fetchMarket } from "../lib/api"

export default function MarketPage() {
  const { id } = useParams()
  const [market, setMarket] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getMarket = async () => {
      try {
        setIsLoading(true)
        const data = await fetchMarket(id)
        setMarket(data)
      } catch (error) {
        console.error("Error fetching market:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      getMarket()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="h-96 rounded-lg bg-muted animate-pulse"></div>
      </div>
    )
  }

  if (!market) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold">Market not found</h2>
        <p className="mt-2 text-muted-foreground">The market you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return <MarketDetail marketId={id} market={market} />
}

