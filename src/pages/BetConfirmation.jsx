"use client"

import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { CheckCircle, ArrowRight, ArrowLeft, Share2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Separator } from "../components/ui/separator"
import confetti from "canvas-confetti"
import { useToast } from "../hooks/use-toast"

export default function BetConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { bet, market } = location.state || {}
  const { toast } = useToast()

  // Redirect if accessed directly without bet data
  useEffect(() => {
    if (!bet || !market) {
      navigate("/")
    }
  }, [bet, market, navigate])

  // Trigger confetti effect on page load
  useEffect(() => {
    if (bet) {
      const duration = 2 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since they're launched randomly, use both sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [bet])

  if (!bet || !market) {
    return null // Will redirect via the useEffect
  }

  // Generate a random transaction ID
  const transactionId = `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

  // Format the date
  const betDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="container py-12 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Bet Placed Successfully!</h1>
        <p className="text-muted-foreground">Your bet has been placed successfully. Good luck!</p>
      </div>

      <Card className="w-full max-w-md border border-border/50">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle>Bet Confirmation</CardTitle>
          <CardDescription>Your bet details</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{market.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {market.category}
              </span>
              <span>Ends: {market.endDate}</span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Your Prediction</p>
              <p className="font-semibold text-lg">{bet.option.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shares</p>
              <p className="font-semibold text-lg">{bet.shares}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price per Share</p>
              <p className="font-semibold text-lg">
                $
                {bet.option === "yes"
                  ? (market.probability / 100).toFixed(2)
                  : ((100 - market.probability) / 100).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="font-semibold text-lg">${bet.amount.toFixed(2)}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="text-sm font-medium">{transactionId}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="text-sm font-medium">{betDate}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Potential Profit</p>
              <p className="text-sm font-medium text-green-600">
                $
                {bet.option === "yes"
                  ? ((1 - market.probability / 100) * bet.shares).toFixed(2)
                  : ((1 - (100 - market.probability) / 100) * bet.shares).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-primary/10 rounded-md">
            <p className="text-sm text-center">
              If your prediction is correct, you'll receive a payout when the market resolves.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={() => navigate(`/market/${market.id}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Market
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                // In a real app, this would use a proper sharing API
                toast({
                  title: "Share link copied!",
                  description: "The link to this market has been copied to your clipboard.",
                })
              }}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share Bet
            </Button>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            onClick={() => navigate("/")}
          >
            Explore More Markets <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

