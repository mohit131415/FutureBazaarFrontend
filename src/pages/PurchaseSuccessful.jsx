"use client"

import { useEffect, useState } from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { CheckCircle, ArrowRight, Home } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import confetti from "canvas-confetti"

export default function PurchaseSuccessful() {
  const location = useLocation()
  const navigate = useNavigate()
  const [plan, setPlan] = useState(null)
  
  // Extract plan data from location state or default to Pro
  useEffect(() => {
    if (location.state && location.state.plan) {
      setPlan(location.state.plan)
    } else {
      // Redirect to subscription page if accessed directly without a plan
      navigate("/subscription")
    }
  }, [location, navigate])
  
  // Trigger confetti effect on page load
  useEffect(() => {
    const duration = 3 * 1000
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
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  if (!plan) {
    return null // Will redirect via the useEffect
  }

  return (
    <div className="container py-12 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Purchase Successful!</h1>
        <p className="text-muted-foreground">
          Thank you for upgrading to {plan.name}. Your account has been successfully upgraded.
        </p>
      </div>

      <Card className="w-full max-w-md border border-border/50">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Your subscription details</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <h3 className="font-medium">{plan.name} Plan</h3>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
            <div className="text-right">
              <div className="font-bold">${plan.price.monthly}/mo</div>
              {plan.price.monthly > 0 && (
                <div className="text-xs text-green-600">Save 16% with yearly billing</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Plan Benefits:</h4>
            <ul className="space-y-1 text-sm">
              {plan.features.filter(f => f.included).map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
          <Button 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            onClick={() => navigate("/markets")}
          >
            Start Trading Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" /> Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
