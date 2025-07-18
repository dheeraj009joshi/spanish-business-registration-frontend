"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface GoogleSignInButtonProps {
  onSuccess?: (result: any) => void
  onError?: (error: string) => void
  isLoading?: boolean
  text?: string
  mode?: "login" | "signup"
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  isLoading = false,
  text = "Continue with Google",
  mode = "login",
}: GoogleSignInButtonProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.georgia.registrarnegocio.com"

      // Create a popup window for Google OAuth
      const popup = window.open(
        `${API_BASE_URL}/api/auth/googleauth/sign?mode=${mode}`,
        "googleSignIn",
        "width=500,height=600,scrollbars=yes,resizable=yes",
      )

      if (!popup) {
        throw new Error("Popup blocked. Please allow popups for this site.")
      }

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) {
          return
        }

        if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
          popup.close()
          window.removeEventListener("message", messageListener)
          setIsGoogleLoading(false)

          // Force a page refresh to update the auth state
          window.location.reload()

          if (onSuccess) {
            onSuccess(event.data.result)
          }
        } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
          popup.close()
          window.removeEventListener("message", messageListener)
          setIsGoogleLoading(false)

          if (onError) {
            onError(event.data.error || "Google authentication failed")
          }
        }
      }

      window.addEventListener("message", messageListener)

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          window.removeEventListener("message", messageListener)
          setIsGoogleLoading(false)

          if (onError) {
            onError("Authentication cancelled")
          }
        }
      }, 1000)

      // Cleanup after 5 minutes
      setTimeout(() => {
        if (!popup.closed) {
          popup.close()
        }
        clearInterval(checkClosed)
        window.removeEventListener("message", messageListener)
        setIsGoogleLoading(false)

        if (onError) {
          onError("Authentication timeout")
        }
      }, 300000)
    } catch (error) {
      console.error("Google Sign-In error:", error)
      setIsGoogleLoading(false)

      if (onError) {
        onError(error instanceof Error ? error.message : "Google Sign-In failed")
      }
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-gray-300 hover:bg-gray-50"
      onClick={handleGoogleSignIn}
      disabled={isLoading || isGoogleLoading}
    >
      {isLoading || isGoogleLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      {text}
    </Button>
  )
}
