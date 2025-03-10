"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { useToast } from "../../hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"

// Update imports to use the new API client
import { validateAdminToken, fetchMarkets, deleteMarket } from "../../lib/api-client"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [markets, setMarkets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [marketToDelete, setMarketToDelete] = useState(null)

  const itemsPerPage = 10

  // Check for authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      navigate("/admin/login")
      return
    }

    // Validate token
    const validateToken = async () => {
      try {
        await validateAdminToken()
      } catch (error) {
        console.error("Auth error:", error)
        localStorage.removeItem("adminToken")
        navigate("/admin/login")
      }
    }

    validateToken()
    fetchMarketsData()
  }, [navigate, currentPage, searchTerm, categoryFilter])

  // Replace the fetchMarkets function with this:
  const fetchMarketsData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchMarkets(currentPage, itemsPerPage, searchTerm, categoryFilter)
      setMarkets(data.markets)
      setTotalPages(Math.ceil(data.total / itemsPerPage))
    } catch (error) {
      console.error("Error fetching markets:", error)
      toast({
        title: "Error",
        description: "Failed to load markets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    navigate("/admin/login")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  // Replace the handleDeleteMarket function with this:
  const handleDeleteMarket = async () => {
    if (!marketToDelete) return

    try {
      await deleteMarket(marketToDelete)

      toast({
        title: "Market deleted",
        description: "The market has been deleted successfully",
      })

      // Refresh markets
      fetchMarketsData()
    } catch (error) {
      console.error("Error deleting market:", error)
      toast({
        title: "Error",
        description: "Failed to delete market",
        variant: "destructive",
      })
    } finally {
      setMarketToDelete(null)
    }
  }

  const getCategoryBadgeColor = (category) => {
    const colors = {
      Politics: "bg-blue-100 text-blue-800",
      Crypto: "bg-purple-100 text-purple-800",
      Sports: "bg-green-100 text-green-800",
      Entertainment: "bg-yellow-100 text-yellow-800",
      Science: "bg-red-100 text-red-800",
      Economics: "bg-indigo-100 text-indigo-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border/50 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/50">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search markets..."
                  className="pl-8 border-border/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] border-border/50">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Politics">Politics</SelectItem>
                  <SelectItem value="Crypto">Crypto</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Economics">Economics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link to="/admin/markets/new">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity gap-2">
                <Plus className="h-4 w-4" />
                Add Market
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7}>
                        <div className="h-12 bg-muted animate-pulse rounded"></div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : markets.length > 0 ? (
                markets.map((market) => (
                  <TableRow key={market._id}>
                    <TableCell className="font-medium max-w-[300px] truncate">{market.title}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryBadgeColor(market.category)}>{market.category}</Badge>
                    </TableCell>
                    <TableCell>{market.probability}%</TableCell>
                    <TableCell>{market.volume}</TableCell>
                    <TableCell>{market.endDate}</TableCell>
                    <TableCell>
                      {market.isResolved ? (
                        <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/markets/edit/${market._id}`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setMarketToDelete(market._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the market.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setMarketToDelete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteMarket} className="bg-red-500 hover:bg-red-600">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No markets found. Create your first market!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <span className="px-2">{currentPage}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

