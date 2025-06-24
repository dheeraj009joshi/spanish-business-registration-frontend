"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [message, setMessage] = useState("Processing authentication...")

  useEffect(() => {
    const success = searchParams.get("success")
    const error = searchParams.get("error")
    const user = searchParams.get("user")
    const token = searchParams.get("token")

    if (success === "true" && user && token) {
      setStatus("success")
      setMessage("Authentication successful! Closing window...")

      // Send success message to parent window
      setTimeout(() => {
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
        window.close()
      }, 1000)
    } else {
      setStatus("error")
      setMessage(error || "Authentication failed")

      // Send error message to parent window
      setTimeout(() => {
        window.opener?.postMessage(
          {
            type: "GOOGLE_AUTH_ERROR",
            error: error || "Authentication failed",
          },
          window.location.origin,
        )
        window.close()
      }, 2000)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        {status === "processing" && (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-8 h-8 mx-auto mb-4 text-green-600">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-green-600 font-medium">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-8 h-8 mx-auto mb-4 text-red-600">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{message}</p>
          </>
        )}
      </div>
    </div>
  )
}
