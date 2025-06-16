"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi, type User } from "@/lib/api"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (userData: { firstName: string; lastName: string; email: string; password: string }) => Promise<{
    success: boolean
    error?: string
  }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const loadUser = async () => {
      setIsLoading(true)

      // First check localStorage for cached user and token
      const currentUser = authApi.getCurrentUser()
      const token = authApi.getToken()

      if (currentUser && token) {
        // Set user immediately from cache to avoid login screen flash
        setUser(currentUser)

        // Then verify token is still valid with the server in the background
        try {
          const result = await authApi.fetchCurrentUser()
          if (result.success && result.data) {
            // Update user data if server returned updated info
            setUser(result.data.user)
            authApi.storeAuthData(result.data.user, token)
          } else {
            // Token invalid, clear local storage
            await authApi.logout()
            setUser(null)
          }
        } catch (error) {
          console.error("Error verifying user token:", error)

          // Check if it's a network error vs auth error
          const errorMessage = error instanceof Error ? error.message : ""

          if (
            errorMessage.includes("fetch") ||
            errorMessage.includes("NetworkError") ||
            errorMessage.includes("Failed to fetch")
          ) {
            // Network error - keep user logged in with cached data
            console.log("Network error, keeping user logged in with cached data")
            // User is already set from cache above
          } else {
            // Other errors (likely auth related) - log out
            await authApi.logout()
            setUser(null)
          }
        }
      } else {
        setUser(null)
      }

      setIsLoading(false)
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    const result = await authApi.login({ email, password })

    if (result.success && result.data) {
      const { user, token } = result.data
      authApi.storeAuthData(user, token)
      setUser(user)
    }

    setIsLoading(false)
    return { success: result.success, error: result.error }
  }

  const signup = async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
    setIsLoading(true)
    const result = await authApi.signup(userData)

    if (result.success && result.data) {
      const { user, token } = result.data
      authApi.storeAuthData(user, token)
      setUser(user)
    }

    setIsLoading(false)
    return { success: result.success, error: result.error }
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
