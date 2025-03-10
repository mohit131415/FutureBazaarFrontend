"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { DatePicker } from "../../components/ui/date-picker"
import { Switch } from "../../components/ui/switch"
import { useToast } from "../../hooks/use-toast"
import { fetchMarket, createMarket, updateMarket } from "../../lib/api-client"

export default function MarketForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    endDate: "",
    probability: 50,
    volume: "$0",
    isResolved: false,
    change: 0,
    traders: 0,
    resolutionDetails: "",
  })

  const isEditMode = !!id

  // Fetch market data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchMarketData = async () => {
        setIsFetching(true)
        try {
          const data = await fetchMarket(id)
          setFormData(data)
        } catch (error) {
          console.error("Error fetching market:", error)
          toast({
            title: "Error",
            description: "Failed to load market data",
            variant: "destructive",
          })
          navigate("/admin/dashboard")
        } finally {
          setIsFetching(false)
        }
      }

      fetchMarketData()
    }
  }, [id, isEditMode, navigate, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date) => {
    if (date) {
      // Format the date as YYYY-MM-DD
      const formattedDate = date.toISOString().split("T")[0]
      setFormData((prev) => ({ ...prev, endDate: formattedDate }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.title || !formData.category || !formData.endDate) {
        throw new Error("Please fill in all required fields")
      }

      if (isEditMode) {
        await updateMarket(id, formData)
        toast({
          title: "Market updated",
          description: "The market has been updated successfully",
        })
      } else {
        await createMarket(formData)
        toast({
          title: "Market created",
          description: "The market has been created successfully",
        })
      }

      navigate("/admin/dashboard")
    } catch (error) {
      console.error("Error saving market:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save market",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="container py-12">
        <div className="h-96 rounded-lg bg-muted animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/admin/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold md:text-2xl gradient-text">
            {isEditMode ? "Edit Market" : "Create New Market"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "Update the details of this prediction market"
              : "Create a new prediction market for the platform"}
          </p>
        </div>
      </div>

      <Card className="mx-auto max-w-3xl border border-border/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle>{isEditMode ? "Edit Market" : "Market Details"}</CardTitle>
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
                value={formData.description || ""}
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
                <DatePicker id="endDate" name="endDate" value={formData.endDate} onChange={handleDateChange} required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="probability">
                  Probability (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="probability"
                  name="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={handleNumberChange}
                  required
                  className="border-border/50 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">
                  Volume <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="volume"
                  name="volume"
                  placeholder="$0"
                  value={formData.volume}
                  onChange={handleChange}
                  required
                  className="border-border/50 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="traders">Traders</Label>
                <Input
                  id="traders"
                  name="traders"
                  type="number"
                  min="0"
                  value={formData.traders}
                  onChange={handleNumberChange}
                  className="border-border/50 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="change">Change (%)</Label>
                <Input
                  id="change"
                  name="change"
                  type="number"
                  value={formData.change}
                  onChange={handleNumberChange}
                  className="border-border/50 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isResolved" className="cursor-pointer">
                  Is Resolved
                </Label>
                <Switch
                  id="isResolved"
                  checked={formData.isResolved}
                  onCheckedChange={(checked) => handleSwitchChange("isResolved", checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">Toggle if this market has been resolved</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolutionDetails">Resolution Details</Label>
              <Textarea
                id="resolutionDetails"
                name="resolutionDetails"
                placeholder="Explain how this market will be resolved"
                value={formData.resolutionDetails || ""}
                onChange={handleChange}
                rows={3}
                className="border-border/50 focus-visible:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="border-border/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              {isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Market"
                  : "Create Market"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

