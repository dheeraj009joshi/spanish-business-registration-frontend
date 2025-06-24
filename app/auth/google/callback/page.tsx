"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const success = searchParams.get("success")
    const error = searchParams.get("error")
    const user = searchParams.get("user")
    const token = searchParams.get("token")

    if (success === "true" && user && token) {
      // Send success message to parent window
      window.opener?.postMessage(
        {
          type: "GOOGLE_AUTH_SUCCESS",
          result: {
            success: true,
            data: {
              user: JSON.parse(decodeURIComponent(user)),
              token: token,
            },
          },
        },
        window.location.origin,
      )
    } else {
      // Send error message to parent window
      window.opener?.postMessage(
        {
          type: "GOOGLE_AUTH_ERROR",
          error: error || "Authentication failed",
        },
        window.location.origin,
      )
    }

    // Close the popup
    window.close()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  )
}
