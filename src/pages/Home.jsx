"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import MarketCard from "../components/market-card"
import TrendingMarkets from "../components/trending-markets"
import PopularCategories from "../components/popular-categories"
import { Button } from "../components/ui/button"
import { fetchMarkets } from "../lib/api"

export default function Home() {
  const [markets, setMarkets] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getMarkets = async () => {
      try {
        setIsLoading(true)
        const data = await fetchMarkets(1, 6) // Get first 6 markets for featured section
        setMarkets(data.markets || [])
      } catch (error) {
        console.error("Error fetching markets:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getMarkets()
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="container py-8 md:py-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 md:p-8">
          <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8">
            <div className="flex flex-col justify-center space-y-4 z-10">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                <span className="gradient-text">Zindagi ek jua hai</span> <br />
                toh aap bhi try karlo
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Buy and sell shares on real-world events and earn profits when your predictions are right.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/markets" className="animated-gradient-button">
                  <span>Explore Markets</span>
                </Link>
                <Link
                  to="/subscription"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background/80 backdrop-blur-sm px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Buy Subscription
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center z-10">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-secondary opacity-30 blur-sm"></div>
                <img
                  src="https://www.safestbettingsites.com/app/uploads/2021/05/10-20-25-dollar-deposit-sportsbooks-1.jpg"
                  alt="Trading illustration"
                  className="relative rounded-xl object-cover shadow-lg"
                  width={400}
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Markets */}
      <section id="markets" className="container py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured Markets</h2>
          <Link to="/markets" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => <div key={i} className="h-64 rounded-lg bg-muted animate-pulse"></div>)
          ) : markets.length > 0 ? (
            markets
              .slice(0, 6)
              .map((market) => (
                <MarketCard
                  key={market._id}
                  id={market._id}
                  title={market.title}
                  probability={market.probability}
                  volume={market.volume}
                  endDate={market.endDate}
                  category={market.category}
                  isResolved={market.isResolved}
                />
              ))
          ) : (
            <div className="col-span-3 py-12 text-center">
              <p className="text-muted-foreground">No markets found. Create your first market!</p>
              <Link to="/create" className="mt-4 inline-block">
                <Button>Create Market</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trending and Categories */}
      <section className="container py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <TrendingMarkets markets={markets.slice(0, 4)} isLoading={isLoading} />
          <PopularCategories />
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-12 md:py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
            FutureBazaar is a prediction market platform where you can trade on the outcome of events.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted p-6 transition-all hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-lg font-bold text-primary-foreground shadow-md">
                1
              </div>
              <h3 className="mt-4 text-xl font-bold">Choose a Market</h3>
              <p className="mt-2 text-muted-foreground">
                Browse prediction markets on various topics and find ones that interest you.
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted p-6 transition-all hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-lg font-bold text-primary-foreground shadow-md">
                2
              </div>
              <h3 className="mt-4 text-xl font-bold">Buy Shares</h3>
              <p className="mt-2 text-muted-foreground">
                Purchase shares representing your prediction on the outcome of events.
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted p-6 transition-all hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-lg font-bold text-primary-foreground shadow-md">
                3
              </div>
              <h3 className="mt-4 text-xl font-bold">Earn Profits</h3>
              <p className="mt-2 text-muted-foreground">
                If your prediction is correct, you'll earn profits when the market resolves.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

