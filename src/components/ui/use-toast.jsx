"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

// Types
const TOAST_POSITIONS = {
  TOP_LEFT: "top-left",
  TOP_RIGHT: "top-right",
  TOP_CENTER: "top-center",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_CENTER: "bottom-center",
}

const TOAST_VARIANTS = {
  DEFAULT: "default",
  DESTRUCTIVE: "destructive",
  SUCCESS: "success",
  WARNING: "warning",
  INFO: "info",
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

// Create a unique ID for each toast
let count = 0
function generateId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Create context
const ToastContext = createContext({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
})

export function ToastProvider({ children, position = TOAST_POSITIONS.TOP_RIGHT }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((toastId) => {
    setToasts((toasts) => 
      toasts.map((toast) => 
        toast.id === toastId 
          ? { ...toast, visible: false } 
          : toast
      )
    )

    setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== toastId))
    }, TOAST_REMOVE_DELAY)
  }, [])

  const toast = useCallback(({ title, description, variant = "default", duration = 5000 }) => {
    const id = generateId()
    
    const newToast = {
      id,
      title,
      description,
      variant,
      visible: true,
    }
    
    setToasts((toasts) => {
      const updatedToasts = [newToast, ...toasts]
      
      // Limit the number of toasts
      if (updatedToasts.length > TOAST_LIMIT) {
        updatedToasts.pop()
      }
      
      return updatedToasts
    })
    
    if (duration !== Infinity) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }
    
    return id
  }, [dismiss])

  // Clear all toasts when component unmounts
  useEffect(() => {
    return () => {
      setToasts([])
    }
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}

// Toast component
export function Toast({ toast, onDismiss }) {
  const { id, title, description, variant = "default", visible } = toast
  let timeoutId;
  
  useEffect(() => {
    return () => {
      clearTimeout(timeoutId)
    }
  }, [])
  
  const getVariantClasses = () => {
    switch (variant) {
      case "destructive":
        return "bg-destructive text-destructive-foreground"
      case "success":
        return "bg-green-500 text-white"
      case "warning":
        return "bg-yellow-500 text-white"
      case "info":
        return "bg-blue-500 text-white"
      default:
        return "bg-background border text-foreground"
    }
  }
  
  return (
    <div
      className={`pointer-events-auto relative flex w-full max-w-sm items-center space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full ${getVariantClasses()} ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:text-foreground hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  )
}

// Toaster component
export function Toaster() {
  const { toasts, dismiss } = useToast()
  
  return (
    <div className="fixed top-0 right-0 z-[100] flex flex-col gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col-reverse md:gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  )
}
