import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Check if the email exists in your database
    // 2. Generate a secure reset token
    // 3. Store the token with an expiration time
    // 4. Send an email with the reset link

    // For demo purposes, we'll simulate success
    console.log(`Password reset requested for: ${email}`)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(
      {
        message: "Password reset link sent successfully",
        email: email,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
