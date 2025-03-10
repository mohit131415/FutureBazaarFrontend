"use client"

// Adapted from shadcn/ui toast hook
import { useState, useEffect, useCallback } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toasts = []

export const useToast = () => {
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState(toasts)

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  const toast = useCallback(
    (props) => {
      const id = genId()
      const newToast = {
        id,
        ...props,
        open: true,
        onOpenChange: (open) => {
          if (!open) {
            dismissToast(id)
          }
        },
      }

      setState((prevState) => {
        const newState = [...prevState, newToast]
        if (newState.length > TOAST_LIMIT) {
          newState.shift()
        }
        return newState
      })

      setTimeout(() => {
        dismissToast(id)
      }, 5000)

      return id
    },
    [mounted],
  )

  const dismissToast = useCallback(
    (id) => {
      setState((prevState) => prevState.map((toast) => (toast.id === id ? { ...toast, open: false } : toast)))

      setTimeout(() => {
        setState((prevState) => prevState.filter((toast) => toast.id !== id))
      }, TOAST_REMOVE_DELAY)
    },
    [mounted],
  )

  return {
    toast,
    toasts: state,
    dismissToast,
  }
}

