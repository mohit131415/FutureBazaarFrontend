"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { DatePicker } from "../components/ui/date-picker"
import { useToast } from "../hooks/use-toast"
import { createMarket } from "../lib/api"

export default function CreateMarketPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    endDate: "",
    resolutionDetails: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date) => {
    if (date) {
      setFormData((prev) => ({ ...prev, endDate: date.toISOString().split("T")[0] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.title || !formData.category || !formData.endDate) {
        throw new Error("Please fill in all required fields")
      }

      // Create a new market
      const data = await createMarket({
        ...formData,
        probability: 50, // Default to 50%
        volume: "$0",
        isResolved: false,
        change: 0,
        traders: 0,
      })

      toast({
        title: "Market created successfully!",
        description: "Your prediction market has been created.",
      })

      // Redirect to the new market page
      navigate(`/market/${data.id}`)
    } catch (error) {
      console.error("Error creating market:", error)
      toast({
        title: "Error creating market",
        description: error instanceof Error ? error.message : "There was an error creating your market",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <h1 className="text-xl font-bold md:text-2xl gradient-text">Create a New Market</h1>
          <p className="text-sm text-muted-foreground">Create a prediction market for any event</p>
        </div>
      </div>

      <Card className="mx-auto max-w-2xl border border-border/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle>Market Details</CardTitle>
          <CardDescription>
            Fill in the details for your prediction market. Be specific about the event and resolution criteria.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Question/Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Will [event] happen by [date]?"
                value={formData.title}
                onChange={handleChange}
                required
                className="border-border/50 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide details about this prediction market"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="border-border/50 focus-visible:ring-primary"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger id="category" className="border-border/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Politics">Politics</SelectItem>
                    <SelectItem value="Crypto">Crypto</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Economics">Economics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  value={formData.endDate ? new Date(formData.endDate) : undefined}
                  onChange={handleDateChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolutionDetails">Resolution Details</Label>
              <Textarea
                id="resolutionDetails"
                name="resolutionDetails"
                placeholder="Explain how this market will be resolved"
                value={formData.resolutionDetails}
                onChange={handleChange}
                rows={3}
                className="border-border/50 focus-visible:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
            <Button variant="outline" type="button" onClick={() => navigate("/")} className="border-border/50">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              {isSubmitting ? "Creating..." : "Create Market"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

