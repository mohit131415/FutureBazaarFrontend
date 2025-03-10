"use client"

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Logo } from "./logo"
import { Link } from "react-router-dom"
import { Search, Bell, Menu } from 'lucide-react'
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

export function Layout({ children, className = "" }) {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Reset scroll position when route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow ${scrolled ? "shadow-sm" : ""}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo showTagline className="hidden md:flex" />
            <Logo className="md:hidden" />
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === "/" ? "text-primary" : ""}`}
              >
                Markets
              </Link>
              <Link 
                to="/leaderboard"
                className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === "/leaderboard" ? "text-primary" : ""}`}
              >
                Leaderboard
              </Link>
              <Link 
                to="/subscription"
                className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === "/subscription" ? "text-primary" : ""}`}
              >
                Subscription
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search markets"
                className="h-9 rounded-md border border-input bg-background pl-8 pr-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <button className="hidden md:flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent transition-colors">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden h-9 w-9 flex items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent transition-colors">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <Logo showTagline />
                  </div>
                  <nav className="flex flex-col gap-4 py-6">
                    <Link
                      to="/"
                      className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                    >
                      Markets
                    </Link>
                    <Link
                      to="/leaderboard"
                      className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                    >
                      Leaderboard
                    </Link>
                    <Link
                      to="/subscription"
                      className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                    >
                      Subscription
                    </Link>
                  </nav>
                  <div className="mt-auto py-6">
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                      Sign In
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={`flex-1 ${className}`}>{children}</main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo showTagline />
              <p className="mt-4 text-sm text-muted-foreground">
                The world's largest prediction market platform where you can trade on the outcome of events.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Products</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-foreground">
                    Markets
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="text-muted-foreground hover:text-foreground">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link to="/subscription" className="text-muted-foreground hover:text-foreground">
                    Subscription
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Connect</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    Telegram
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} FutureBazaar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
