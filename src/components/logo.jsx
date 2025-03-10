import { Link } from "react-router-dom"

export function Logo({ className = "", showTagline = false }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
        <span className="text-lg font-bold text-white">FB</span>
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary to-secondary opacity-30 blur-sm"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight">FutureBazaar</span>
        {showTagline && <span className="text-xs text-muted-foreground">Zindagi ek jua hai toh aap bhi try karlo</span>}
      </div>
    </Link>
  )
}

