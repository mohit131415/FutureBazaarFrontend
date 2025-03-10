import { Link } from "react-router-dom"
import { ArrowUpRight, TrendingUp } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Progress } from "./ui/progress"

export default function MarketCard({ id, title, probability, volume, endDate, category, isResolved }) {
  return (
    <Link to={`/market/${id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-md border border-border/50 hover:border-primary/20">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {category}
            </span>
            {isResolved ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Resolved
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">
                Active
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 text-base font-semibold group-hover:text-primary transition-colors">{title}</h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Yes</span>
              <span className="font-medium">{probability}%</span>
            </div>
            <Progress
              value={probability}
              className="h-2 bg-muted"
              indicatorClassName="bg-gradient-to-r from-primary to-secondary"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">No</span>
              <span className="font-medium">{100 - probability}%</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{volume}</span>
          </div>
          <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
            <span>Ends: {endDate}</span>
            <ArrowUpRight className="h-3 w-3" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

