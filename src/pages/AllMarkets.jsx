"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import MarketCard from "../components/market-card"
import { fetchMarkets } from "../lib/api"

export default function AllMarkets() {
  const [markets, setMarkets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [status, setStatus] = useState("all")
  const [filteredMarkets, setFilteredMarkets] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch markets when filters or pagination changes
  useEffect(() => {
    const getMarkets = async () => {
      try {
        setIsLoading(true);
        // Pass the current page to the API
        const data = await fetchMarkets(currentPage, itemsPerPage, searchTerm, category);
        
        // Check if we have markets and set them
        if (data && data.markets) {
          setMarkets(data.markets);
          // Calculate total pages if not provided by API
          setTotalPages(data.totalPages || Math.ceil(data.total / itemsPerPage) || 1);
        } else {
          setMarkets([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching markets:", error);
        setMarkets([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    getMarkets();
  }, [currentPage, itemsPerPage, searchTerm, category, status]);

  // Apply filters and sorting
  useEffect(() => {
    // Apply status filter and sorting
    let result = [...markets];

    // Filter by status if not "all"
    if (status !== "all") {
      result = result.filter(market => 
        status === "active" ? !market.isResolved : market.isResolved
      );
    }

    // Sort markets
    if (sortBy === "newest") {
      // Already sorted by newest from the API
    } else if (sortBy === "oldest") {
      result = [...result].reverse();
    } else if (sortBy === "highestVolume") {
      result = [...result].sort((a, b) => {
        // Handle different volume formats
        const volumeA = typeof a.volume === 'string' 
          ? Number.parseFloat(a.volume.replace(/[^0-9.]/g, ""))
          : a.volume;
        const volumeB = typeof b.volume === 'string'
          ? Number.parseFloat(b.volume.replace(/[^0-9.]/g, ""))
          : b.volume;
        return volumeB - volumeA;
      });
    } else if (sortBy === "highestProbability") {
      result = [...result].sort((a, b) => b.probability - a.probability);
    }

    setFilteredMarkets(result);
  }, [markets, sortBy, status]);

  // Categories for filter
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Politics", label: "Politics" },
    { value: "Crypto", label: "Crypto" },
    { value: "Sports", label: "Sports" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Science", label: "Science" },
    { value: "Economics", label: "Economics" },
  ]

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold md:text-2xl gradient-text">All Markets</h1>
          <p className="text-sm text-muted-foreground">Browse all prediction markets on FutureBazaar</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8 border border-border/50">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search markets..."
                className="pl-8 border-border/50"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="border-border/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="border-border/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="highestVolume">Highest Volume</SelectItem>
                <SelectItem value="highestProbability">Highest Probability</SelectItem>
              </SelectContent>
            </Select>

            <Tabs
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                setCurrentPage(1)
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Markets Grid */}
      <div className="mb-8">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-64 rounded-lg bg-muted animate-pulse"></div>
              ))}
          </div>
        ) : filteredMarkets.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMarkets.map((market) => (
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
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1),
                    )
                    .map((page, i, array) => (
                      <React.Fragment key={page}>
                        {i > 0 && array[i - 1] !== page - 1 && <span className="text-muted-foreground">...</span>}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "bg-primary" : ""}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No markets found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  )
}
