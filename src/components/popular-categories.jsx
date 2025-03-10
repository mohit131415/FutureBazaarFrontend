import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export default function PopularCategories() {
  const categories = [
    { id: 1, name: "Politics", count: 124, color: "from-blue-500 to-blue-600 text-white" },
    { id: 2, name: "Crypto", count: 87, color: "from-purple-500 to-purple-600 text-white" },
    { id: 3, name: "Sports", count: 65, color: "from-green-500 to-green-600 text-white" },
    { id: 4, name: "Entertainment", count: 42, color: "from-yellow-500 to-yellow-600 text-white" },
    { id: 5, name: "Science", count: 38, color: "from-red-500 to-red-600 text-white" },
    { id: 6, name: "Economics", count: 31, color: "from-indigo-500 to-indigo-600 text-white" },
  ]

  return (
    <Card className="border border-border/50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="text-xl font-bold">Popular Categories</CardTitle>
        <Link to="#" className="flex items-center text-sm font-medium text-primary hover:underline">
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="#"
              className="group flex flex-col items-center rounded-xl border border-border/50 p-3 text-center transition-all hover:shadow-md hover:border-primary/20"
            >
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-gradient-to-r ${category.color}`}
              >
                {category.count} markets
              </span>
              <span className="mt-2 font-medium group-hover:text-primary transition-colors">{category.name}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

