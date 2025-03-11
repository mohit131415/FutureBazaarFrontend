"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Share2, Bell, TrendingUp, Clock, Users, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Separator } from "./ui/separator"
import { useToast } from "../hooks/use-toast"
import { placeBet } from "../lib/api"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function MarketDetail({ marketId, market }) {
  const navigate = useNavigate()
  const [selectedOption, setSelectedOption] = useState("yes")
  const [quantity, setQuantity] = useState(10)
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  const [chartTimeframe, setChartTimeframe] = useState("1m")
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false)
  const { toast } = useToast()

  const handlePlaceBet = async () => {
    if (!market) return

    setIsPlacingBet(true)

    try {
      const bet = {
        marketId: market._id,
        option: selectedOption,
        amount:
          selectedOption === "yes"
            ? (market.probability / 100) * quantity
            : ((100 - market.probability) / 100) * quantity,
        shares: quantity,
      }

      await placeBet(bet)

      // Navigate to the bet confirmation page with bet details
      navigate("/bet-confirmation", {
        state: {
          bet,
          market: {
            id: market._id,
            title: market.title,
            probability: market.probability,
            endDate: market.endDate,
            category: market.category,
          },
        },
      })
    } catch (error) {
      console.error("Error placing bet:", error)
      toast({
        title: "Error placing bet",
        description: "There was an error placing your bet. Please try again.",
        variant: "destructive",
      })
      setIsPlacingBet(false)
    }
  }

  // Generate more detailed price data
  const generateDetailedPriceData = (timeframe) => {
    // This would normally come from an API with historical data
    // For now, we'll generate synthetic data based on the timeframe
    const baseData = market.priceHistory || []

    // If we have real data, use it
    if (baseData.length > 0) return baseData

    // Otherwise generate synthetic data
    const dataPoints = timeframe === "1w" ? 7 : timeframe === "1m" ? 30 : timeframe === "3m" ? 90 : 180
    const result = []

    let yesPrice = market.probability / 100
    let noPrice = 1 - yesPrice

    for (let i = 0; i < dataPoints; i++) {
      // Create some random fluctuations
      const change = (Math.random() - 0.5) * 0.03
      yesPrice = Math.max(0.01, Math.min(0.99, yesPrice + change))
      noPrice = 1 - yesPrice

      const date = new Date()
      date.setDate(date.getDate() - (dataPoints - i))

      result.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        yes: yesPrice,
        no: noPrice,
        volume: Math.floor(Math.random() * 50000) + 10000,
      })
    }

    return result
  }

  const priceData = generateDetailedPriceData(chartTimeframe)

  // Generate volume data
  const volumeData =
    market.volumeHistory ||
    priceData.map((item) => ({
      date: item.date,
      volume: item.volume || Math.floor(Math.random() * 50000) + 10000,
    }))

  // Generate trader activity data
  const traderActivityData = [
    { name: "Yes Traders", value: Math.floor(market.traders * 0.6) || 60 },
    { name: "No Traders", value: Math.floor(market.traders * 0.4) || 40 },
  ]

  // Generate price distribution data
  const priceDistributionData = [
    { price: "0-20%", count: 5 },
    { price: "21-40%", count: 12 },
    { price: "41-60%", count: 25 },
    { price: "61-80%", count: 18 },
    { price: "81-100%", count: 8 },
  ]

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold md:text-2xl gradient-text">{market.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {market.category}
            </span>
            <span>Ends: {market.endDate}</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border/50 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border/50 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="border border-border/50 overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Price History</CardTitle>
                  <CardDescription>Historical price movement for Yes and No shares</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={chartTimeframe === "1w" ? "bg-primary/10" : ""}
                    onClick={() => setChartTimeframe("1w")}
                  >
                    1W
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={chartTimeframe === "1m" ? "bg-primary/10" : ""}
                    onClick={() => setChartTimeframe("1m")}
                  >
                    1M
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={chartTimeframe === "3m" ? "bg-primary/10" : ""}
                    onClick={() => setChartTimeframe("3m")}
                  >
                    3M
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={chartTimeframe === "6m" ? "bg-primary/10" : ""}
                    onClick={() => setChartTimeframe("6m")}
                  >
                    6M
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="price">
                <TabsList className="mb-4">
                  <TabsTrigger value="price">Price</TabsTrigger>
                  <TabsTrigger value="volume">Volume</TabsTrigger>
                </TabsList>
                <TabsContent value="price" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 1]} tickFormatter={(value) => `$${value.toFixed(2)}`} />
                      <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Price"]} />
                      <Legend />
                      <Line type="monotone" dataKey="yes" stroke="#3b82f6" name="Yes" strokeWidth={2} />
                      <Line type="monotone" dataKey="no" stroke="#ef4444" name="No" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="volume" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => [`$${(value / 1000).toFixed(1)}k`, "Volume"]} />
                      <Area type="monotone" dataKey="volume" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Advanced Analytics</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedCharts(!showAdvancedCharts)}
              className="flex items-center gap-1"
            >
              {showAdvancedCharts ? "Hide" : "Show"}
              {showAdvancedCharts ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {showAdvancedCharts && (
            <div className="grid gap-6 mt-4 md:grid-cols-2">
              <Card className="border border-border/50 overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardTitle className="text-base">Trader Distribution</CardTitle>
                  <CardDescription>Breakdown of Yes vs No traders</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={traderActivityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {traderActivityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} traders`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border border-border/50 overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardTitle className="text-base">Price Distribution</CardTitle>
                  <CardDescription>Historical price range frequency</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="price" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} trades`, "Count"]} />
                      <Bar dataKey="count" fill="#8884d8">
                        {priceDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="mt-6 border border-border/50 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle>Market Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {market.description || 'This market resolves to "Yes" if the event occurs, and "No" otherwise.'}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold">Resolution Details</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {market.resolutionDetails || "This market will resolve based on the official outcome of the event."}
                  </p>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">End Date</div>
                      <div className="text-sm font-medium">{market.endDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Volume</div>
                      <div className="text-sm font-medium">{market.volume}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Traders</div>
                      <div className="text-sm font-medium">{market.traders || "0"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border border-border/50 overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle>Current Probability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Yes</div>
                    <div className="text-2xl font-bold gradient-text">{market.probability}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">No</div>
                    <div className="text-2xl font-bold">{100 - market.probability}%</div>
                  </div>
                </div>
                <Progress
                  value={market.probability}
                  className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary"
                />
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div className="rounded-md bg-muted p-2">
                    <div className="text-muted-foreground">Yes Price</div>
                    <div className="font-medium">${(market.probability / 100).toFixed(2)}</div>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <div className="text-muted-foreground">No Price</div>
                    <div className="font-medium">${((100 - market.probability) / 100).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border border-border/50 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle>Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex rounded-md">
                  <Button
                    variant={selectedOption === "yes" ? "default" : "outline"}
                    className="flex-1 rounded-r-none"
                    onClick={() => setSelectedOption("yes")}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={selectedOption === "no" ? "default" : "outline"}
                    className="flex-1 rounded-l-none"
                    onClick={() => setSelectedOption("no")}
                  >
                    No
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Quantity</span>
                    <span>{quantity} shares</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setQuantity(10)}>
                      10
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setQuantity(25)}>
                      25
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setQuantity(50)}>
                      50
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setQuantity(100)}>
                      100
                    </Button>
                  </div>
                </div>
                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost</span>
                    <span className="font-medium">
                      $
                      {selectedOption === "yes"
                        ? ((market.probability / 100) * quantity).toFixed(2)
                        : (((100 - market.probability) / 100) * quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm">Potential Profit</span>
                    <span className="font-medium text-green-600">
                      $
                      {selectedOption === "yes"
                        ? ((1 - market.probability / 100) * quantity).toFixed(2)
                        : ((1 - (100 - market.probability) / 100) * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                  onClick={handlePlaceBet}
                  disabled={isPlacingBet || market.isResolved}
                >
                  {isPlacingBet ? "Processing..." : `Buy ${selectedOption.toUpperCase()}`}
                </Button>
                {market.isResolved && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <Info className="h-3 w-3" />
                    <span>This market has been resolved</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
