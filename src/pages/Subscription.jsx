"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"

export default function Subscription() {
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState("monthly")

  const plans = [
    {
      name: "Free",
      description: "Basic access to prediction markets",
      price: { monthly: 0, yearly: 0 },
      features: [
        { name: "Access to all markets", included: true },
        { name: "Standard transaction fee (₹20 per trade)", included: true },
        { name: "Basic market analytics", included: true },
        { name: "Community forum access", included: true },
        { name: "Expert predictions", included: false },
        { name: "Free transactions", included: false, details: "0 free transactions" },
        { name: "Priority customer support", included: false },
        { name: "Advanced market analytics", included: false },
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline",
    },
    {
      name: "Pro",
      description: "For active traders who want to save on fees",
      price: { monthly: 199, yearly: 1999 },
      features: [
        { name: "Access to all markets", included: true },
        { name: "Reduced transaction fee (₹10 per trade)", included: true },
        { name: "Basic market analytics", included: true },
        { name: "Community forum access", included: true },
        { name: "Weekly expert predictions", included: true },
        { name: "Free transactions", included: true, details: "20 free transactions per month" },
        { name: "Priority customer support", included: false },
        { name: "Advanced market analytics", included: false },
      ],
      popular: true,
      buttonText: "Upgrade to Pro",
      buttonVariant: "default",
    },
    {
      name: "Premium",
      description: "For serious traders who want the best insights",
      price: { monthly: 499, yearly: 4999 },
      features: [
        { name: "Access to all markets", included: true },
        { name: "No transaction fees", included: true },
        { name: "Basic market analytics", included: true },
        { name: "Community forum access", included: true },
        { name: "Daily expert predictions", included: true },
        { name: "Free transactions", included: true, details: "Unlimited free transactions" },
        { name: "Priority customer support", included: true },
        { name: "Advanced market analytics", included: true },
      ],
      popular: false,
      buttonText: "Upgrade to Premium",
      buttonVariant: "default",
    },
  ]

  // Calculate savings for yearly billing
  const calculateSavings = (plan) => {
    if (plan.price.monthly === 0) return 0
    const monthlyCost = plan.price.monthly * 12
    const yearlyCost = plan.price.yearly
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100)
  }

  const handleUpgrade = (plan) => {
    // In a real app, you would process payment here
    // For now, just navigate to success page with plan data
    navigate("/purchase-successful", { state: { plan } })
  }

  return (
    <div className="container py-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold tracking-tight gradient-text mb-4">Subscription Plans</h1>
        <p className="text-muted-foreground text-lg">
          Choose the perfect plan to enhance your trading experience on FutureBazaar
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          <Label
            htmlFor="billing-toggle"
            className={billingCycle === "monthly" ? "font-medium" : "text-muted-foreground"}
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingCycle === "yearly"}
            onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
          />
          <div className="flex items-center">
            <Label
              htmlFor="billing-toggle"
              className={billingCycle === "yearly" ? "font-medium" : "text-muted-foreground"}
            >
              Yearly
            </Label>
            {billingCycle === "yearly" && <Badge className="ml-2 bg-green-100 text-green-800">Save up to 16%</Badge>}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`border ${plan.popular ? "border-primary shadow-md relative" : "border-border/50"}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-0 right-0 mx-auto w-fit">
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white">Most Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">₹{plan.price[billingCycle]}</span>
                  {plan.price[billingCycle] > 0 && (
                    <span className="text-muted-foreground ml-2">/{billingCycle === "monthly" ? "month" : "year"}</span>
                  )}
                </div>
                {billingCycle === "yearly" && plan.price.monthly > 0 && (
                  <p className="text-sm text-green-600 mt-1">Save {calculateSavings(plan)}% with yearly billing</p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>
                      {feature.name}
                      {feature.details && feature.included && (
                        <span className="block text-xs text-muted-foreground mt-0.5">{feature.details}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={plan.buttonVariant}
                className={`w-full ${plan.popular ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90" : ""}`}
                onClick={() => handleUpgrade(plan)}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Plan Features Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6">Feature</th>
                <th className="text-center py-4 px-6">Free</th>
                <th className="text-center py-4 px-6">Pro</th>
                <th className="text-center py-4 px-6">Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-4 px-6 font-medium">Transaction Fee</td>
                <td className="text-center py-4 px-6">₹20 per trade</td>
                <td className="text-center py-4 px-6">₹10 per trade</td>
                <td className="text-center py-4 px-6">No fees</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6 font-medium">Free Transactions</td>
                <td className="text-center py-4 px-6">0</td>
                <td className="text-center py-4 px-6">20 per month</td>
                <td className="text-center py-4 px-6">Unlimited</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6 font-medium">Expert Predictions</td>
                <td className="text-center py-4 px-6">
                  <X className="h-5 w-5 text-muted-foreground mx-auto" />
                </td>
                <td className="text-center py-4 px-6">Weekly</td>
                <td className="text-center py-4 px-6">Daily</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6 font-medium">Customer Support</td>
                <td className="text-center py-4 px-6">Standard</td>
                <td className="text-center py-4 px-6">Standard</td>
                <td className="text-center py-4 px-6">Priority</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6 font-medium">Advanced Analytics</td>
                <td className="text-center py-4 px-6">
                  <X className="h-5 w-5 text-muted-foreground mx-auto" />
                </td>
                <td className="text-center py-4 px-6">
                  <X className="h-5 w-5 text-muted-foreground mx-auto" />
                </td>
                <td className="text-center py-4 px-6">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">How do the free transactions work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Free transactions are credited to your account each month based on your subscription plan. Pro users get
                20 free transactions per month, while Premium users enjoy unlimited free transactions. These free
                transactions allow you to trade without paying the standard transaction fee.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">What are expert predictions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Expert predictions are market insights and forecasts provided by our team of professional analysts. Pro
                users receive weekly expert predictions, while Premium users get daily insights to help make more
                informed trading decisions.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your subscription plan at any time. When upgrading, you'll be charged
                the prorated difference for the remainder of your billing cycle. When downgrading, the changes will take
                effect at the end of your current billing cycle.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Is there a refund policy?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We offer a 7-day money-back guarantee for all new subscriptions. If you're not satisfied with your
                subscription within the first 7 days, you can request a full refund. After this period, refunds are
                provided on a case-by-case basis.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <div className="max-w-3xl mx-auto p-8 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-border/50">
          <h2 className="text-2xl font-bold mb-4">Ready to enhance your trading experience?</h2>
          <p className="text-muted-foreground mb-6">
            Choose the plan that's right for you and start saving on transaction fees today.
          </p>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
            View Plans
          </Button>
        </div>
      </div>
    </div>
  )
}
