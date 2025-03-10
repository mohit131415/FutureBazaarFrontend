"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Share2, Bell, TrendingUp, Clock, Users, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Separator } from "./ui/separator"
import { useToast } from "../hooks/use-toast"
import { placeBet } from "../lib/api"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export default function MarketDetail({ marketId, market }) {
  const [selectedOption, setSelectedOption] = useState("yes")
  const [quantity, setQuantity] = useState(10)
  const [isPlacingBet, setIsPlacingBet] = useState(false)
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

      toast({
        title: "Bet placed successfully!",
        description: `You placed a bet of ${quantity} shares on ${selectedOption.toUpperCase()}`,
      })
    } catch (error) {
      console.error("Error placing bet:", error)
      toast({
        title: "Error placing bet",
        description: "There was an error placing your bet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPlacingBet(false)
    }
  }

  const priceData = market.priceHistory || [
    { date: "Apr 1", yes: 0.65, no: 0.35 },
    { date: "Apr 8", yes: 0.62, no: 0.38 },
    { date: "Apr 15", yes: 0.58, no: 0.42 },
    { date: "Apr 22", yes: 0.61, no: 0.39 },
    { date: "Apr 29", yes: 0.63, no: 0.37 },
    { date: "May 6", yes: 0.67, no: 0.33 },
    { date: "May 13", yes: 0.64, no: 0.36 },
    { date: "May 20", yes: 0.62, no: 0.38 },
    { date: "May 27", yes: 0.65, no: 0.35 },
    { date: "Jun 3", yes: 0.68, no: 0.32 },
    { date: "Jun 10", yes: 0.72, no: 0.28 },
    { date: "Jun 17", yes: 0.7, no: 0.3 },
    { date: "Jun 24", yes: 0.67, no: 0.33 },
    { date: "Jul 1", yes: 0.65, no: 0.35 },
    { date: "Jul 8", yes: market.probability / 100, no: (100 - market.probability) / 100 },
  ]

  const volumeData = market.volumeHistory || [
    { date: "Apr 1", volume: 120000 },
    { date: "Apr 8", volume: 180000 },
    { date: "Apr 15", volume: 150000 },
    { date: "Apr 22", volume: 220000 },
    { date: "Apr 29", volume: 190000 },
    { date: "May 6", volume: 250000 },
    { date: "May 13", volume: 310000 },
    { date: "May 20", volume: 280000 },
    { date: "May 27", volume: 350000 },
    { date: "Jun 3", volume: 420000 },
    { date: "Jun 10", volume: 380000 },
    { date: "Jun 17", volume: 450000 },
    { date: "Jun 24", volume: 520000 },
    { date: "Jul 1", volume: 480000 },
    { date: "Jul 8", volume: Number.parseInt(market.volume.replace(/[^0-9]/g, "")) * 1000 },
  ]

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
              <CardTitle>Price History</CardTitle>
              <CardDescription>Historical price movement for Yes and No shares</CardDescription>
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
                      <Line type="monotone" dataKey="yes" stroke="#3b82f6" name="Yes" />
                      <Line type="monotone" dataKey="no" stroke="#ef4444" name="No" />
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
                  className="h-2"
                  indicatorClassName="bg-gradient-to-r from-primary to-secondary"
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

