"use client"

import { useState, useEffect } from "react"
import { Trophy, TrendingUp, Users, ArrowUp, ArrowDown, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Avatar } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"

export default function Leaderboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("weekly")
  
  // Mock data for the leaderboard
  const leaderboardData = {
    weekly: [
      { rank: 1, name: "Rahul Sharma", avatar: "RS", profit: 12500, winRate: 78, trades: 45, change: 5 },
      { rank: 2, name: "Priya Patel", avatar: "PP", profit: 9800, winRate: 72, trades: 38, change: -2 },
      { rank: 3, name: "Amit Kumar", avatar: "AK", profit: 8700, winRate: 68, trades: 52, change: 1 },
      { rank: 4, name: "Neha Singh", avatar: "NS", profit: 7600, winRate: 65, trades: 41, change: 3 },
      { rank: 5, name: "Vikram Mehta", avatar: "VM", profit: 6900, winRate: 63, trades: 37, change: -1 },
      { rank: 6, name: "Ananya Desai", avatar: "AD", profit: 6200, winRate: 61, trades: 44, change: 7 },
      { rank: 7, name: "Rajesh Gupta", avatar: "RG", profit: 5800, winRate: 59, trades: 39, change: -3 },
      { rank: 8, name: "Sunita Jain", avatar: "SJ", profit: 5300, winRate: 57, trades: 35, change: 2 },
      { rank: 9, name: "Karan Malhotra", avatar: "KM", profit: 4900, winRate: 55, trades: 42, change: 0 },
      { rank: 10, name: "Deepika Reddy", avatar: "DR", profit: 4500, winRate: 53, trades: 36, change: 4 },
    ],
    monthly: [
      { rank: 1, name: "Amit Kumar", avatar: "AK", profit: 32500, winRate: 75, trades: 120, change: 2 },
      { rank: 2, name: "Rahul Sharma", avatar: "RS", profit: 29800, winRate: 72, trades: 105, change: -1 },
      { rank: 3, name: "Priya Patel", avatar: "PP", profit: 27600, winRate: 70, trades: 98, change: 0 },
      { rank: 4, name: "Vikram Mehta", avatar: "VM", profit: 25900, winRate: 68, trades: 112, change: 3 },
      { rank: 5, name: "Neha Singh", avatar: "NS", profit: 23700, winRate: 67, trades: 95, change: -2 },
      { rank: 6, name: "Karan Malhotra", avatar: "KM", profit: 21500, winRate: 65, trades: 108, change: 5 },
      { rank: 7, name: "Ananya Desai", avatar: "AD", profit: 19800, winRate: 63, trades: 92, change: 1 },
      { rank: 8, name: "Rajesh Gupta", avatar: "RG", profit: 18200, winRate: 61, trades: 101, change: -3 },
      { rank: 9, name: "Deepika Reddy", avatar: "DR", profit: 16900, winRate: 59, trades: 89, change: 2 },
      { rank: 10, name: "Sunita Jain", avatar: "SJ", profit: 15500, winRate: 57, trades: 94, change: -1 },
    ],
    allTime: [
      { rank: 1, name: "Vikram Mehta", avatar: "VM", profit: 125000, winRate: 73, trades: 450, change: 0 },
      { rank: 2, name: "Amit Kumar", avatar: "AK", profit: 118000, winRate: 71, trades: 425, change: 0 },
      { rank: 3, name: "Rahul Sharma", avatar: "RS", profit: 109000, winRate: 69, trades: 410, change: 1 },
      { rank: 4, name: "Priya Patel", avatar: "PP", profit: 98000, winRate: 67, trades: 380, change: -1 },
      { rank: 5, name: "Karan Malhotra", avatar: "KM", profit: 92000, winRate: 66, trades: 395, change: 0 },
      { rank: 6, name: "Neha Singh", avatar: "NS", profit: 87000, winRate: 64, trades: 370, change: 2 },
      { rank: 7, name: "Ananya Desai", avatar: "AD", profit: 81000, winRate: 62, trades: 360, change: -1 },
      { rank: 8, name: "Rajesh Gupta", avatar: "RG", profit: 76000, winRate: 60, trades: 350, change: 0 },
      { rank: 9, name: "Deepika Reddy", avatar: "DR", profit: 72000, winRate: 58, trades: 340, change: 1 },
      { rank: 10, name: "Sunita Jain", avatar: "SJ", profit: 68000, winRate: 56, trades: 330, change: -1 },
    ]
  }

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      title: "Total Traders",
      value: "5,234",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "Active traders this month"
    },
    {
      title: "Total Volume",
      value: "$12.5M",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      description: "Trading volume this month"
    },
    {
      title: "Top Profit",
      value: "$125,000",
      icon: <Trophy className="h-4 w-4 text-muted-foreground" />,
      description: "Highest all-time profit"
    }
  ]

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">
          See who's making the most profit on FutureBazaar
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leaderboard Table */}
      <Card className="border border-border/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <CardTitle>Top Traders</CardTitle>
            <Tabs value={timeframe} onValueChange={setTimeframe}>
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="allTime">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            Traders ranked by profit in the selected time period
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded-md"></div>
                ))}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Trader</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Win Rate</TableHead>
                  <TableHead className="text-right">Trades</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData[timeframe].map((trader) => (
                  <TableRow key={trader.rank} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {trader.rank <= 3 ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold">
                          {trader.rank}
                        </div>
                      ) : (
                        trader.rank
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 bg-primary/10 text-primary">
                          <span>{trader.avatar}</span>
                        </Avatar>
                        <div>
                          <div className="font-medium">{trader.name}</div>
                          {trader.rank === 1 && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">Top Trader</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">${trader.profit.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{trader.winRate}%</TableCell>
                    <TableCell className="text-right">{trader.trades}</TableCell>
                    <TableCell className="text-right">
                      {trader.change > 0 ? (
                        <div className="flex items-center justify-end text-green-600">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          {trader.change}
                        </div>
                      ) : trader.change < 0 ? (
                        <div className="flex items-center justify-end text-red-600">
                          <ArrowDown className="h-4 w-4 mr-1" />
                          {Math.abs(trader.change)}
                        </div>
                      ) : (
                        <div className="text-muted-foreground">-</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* How to climb the leaderboard */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">How to Climb the Leaderboard</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" /> Trade More
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Increase your trading volume to gain more experience and opportunities for profit.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" /> Research Well
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Make informed decisions by researching markets thoroughly before placing trades.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" /> Upgrade Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get expert insights and save on fees with our premium subscription plans.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
