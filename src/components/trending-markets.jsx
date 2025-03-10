import { Link } from "react-router-dom"
import { ArrowRight, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export default function TrendingMarkets({ markets, isLoading }) {
  return (
    <Card className="border border-border/50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="text-xl font-bold">Trending Markets</CardTitle>
        <Link to="#" className="flex items-center text-sm font-medium text-primary hover:underline">
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-12 rounded-md bg-muted animate-pulse"></div>
              ))}
          </div>
        ) : markets && markets.length > 0 ? (
          <div className="divide-y divide-border/50">
            {markets.slice(0, 4).map((market) => (
              <div
                key={market._id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <Link
                    to={`/market/${market._id}`}
                    className="line-clamp-1 font-medium hover:text-primary transition-colors"
                  >
                    {market.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Yes: {market.probability}%</span>
                    <span className={market.change >= 0 ? "text-green-500" : "text-red-500"}>
                      {market.change >= 0 ? "+" : ""}
                      {market.change}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{market.volume}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">No trending markets available</div>
        )}
      </CardContent>
    </Card>
  )
}

