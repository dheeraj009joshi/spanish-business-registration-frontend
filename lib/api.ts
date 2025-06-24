"use client"

const API_BASE_URL =  "https://api.georgia.registrarnegocio.com/api"

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface FormSubmissionRequest {
  type: "DIY" | "ASSISTED"
  data: any
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Password Reset Types
export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  new_password: string
}

// Form Submission Interface
export interface FormSubmission {
  id: string
  type: "DIY" | "ASSISTED"
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "REJECTED"
  businessName: string
  businessType: string
  submittedDate: string
  updatedDate: string
  data: Record<string, any>
  userId?: string
  totalAmount?: number
  notes?: string
  documents?: string[]
}

// In-memory storage for demo purposes - using localStorage to persist data
const getSubmissionsFromStorage = (): FormSubmission[] => {
  if (typeof window === "undefined") return []

  try {
    const storedSubmissions = localStorage.getItem("submissions")
    return storedSubmissions ? JSON.parse(storedSubmissions) : []
  } catch (error) {
    console.error("Error retrieving submissions from localStorage:", error)
    return []
  }
}

const saveSubmissionsToStorage = (submissions: FormSubmission[]) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("submissions", JSON.stringify(submissions))
  } catch (error) {
    console.error("Error saving submissions to localStorage:", error)
  }
}

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  method = "GET",
  data?: any,
  customHeaders: Record<string, string> = {},
): Promise<ApiResponse<T>> {
  try {
    const token = authApi.getToken()
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders,
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const requestOptions: RequestInit = {
      method,
      headers,
      credentials: "include",
    }

    if (data) {
      requestOptions.body = JSON.stringify(data)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions)

    // Handle authentication errors specifically
    if (response.status === 401 || response.status === 403) {
      // Clear local storage on auth errors
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")

      return {
        success: false,
        error: "Authentication failed. Please login again.",
      }
    }

    const responseData = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || responseData.message || "An error occurred",
      }
    }

    return {
      success: true,
      data: responseData.data || responseData,
      message: responseData.message,
    }
  } catch (error) {
    console.error("API request error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    }
  }
}

// Auth API
export const authApi = {
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiRequest<{ user: User; token: string }>("/auth/login", "POST", credentials)
  },

  async signup(userData: SignupRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiRequest<{ user: User; token: string }>("/auth/signup", "POST", userData)
  },

  async logout(): Promise<void> {
    try {
      await apiRequest("/auth/logout", "POST")
    } finally {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
    }
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem("user")
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  },

  getToken(): string | null {
    return localStorage.getItem("auth_token")
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },

  async fetchCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    const result = await apiRequest<{ user: User }>("/auth/me", "GET")

    // If the request fails due to auth issues, clear local storage
    if (!result.success && result.error?.includes("Authentication failed")) {
      this.logout()
    }

    return result
  },

  // Store user data and token in localStorage
  storeAuthData(user: User, token: string): void {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("user", JSON.stringify(user))
  },

  // Password Reset Functions
  async requestPasswordReset(email: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/request-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify({ email }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || responseData.message || "Failed to send reset email",
        }
      }

      return {
        success: true,
        message: responseData.message || "Reset email sent successfully",
      }
    } catch (error) {
      console.error("Password reset request error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_password: newPassword }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || responseData.message || "Failed to reset password",
        }
      }

      return {
        success: true,
        message: responseData.message || "Password reset successful",
      }
    } catch (error) {
      console.error("Password reset error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  },
}

// Form API
export const formApi = {
  async submitForm(formData: FormSubmissionRequest): Promise<ApiResponse<{ submissionId: string }>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const currentUser = authApi.getCurrentUser()
      const userId = currentUser?.id || "user_001"

      // Get existing submissions
      const submissions = getSubmissionsFromStorage()

      const newSubmission: FormSubmission = {
        id: `sub_${Date.now()}`,
        type: formData.type,
        status: "PENDING",
        businessName: formData.data.businessName || "Unnamed Business",
        businessType: formData.data.businesstype || formData.data.businessType || "domestic-llc",
        submittedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        data: formData.data,
        userId: userId,
        totalAmount: formData.data.totalAmount || 0,
        notes: formData.data.notes || "",
        documents: [],
      }

      // Add new submission
      submissions.push(newSubmission)

      // Save to localStorage
      saveSubmissionsToStorage(submissions)

      return {
        success: true,
        data: { submissionId: newSubmission.id },
        message: "Form submitted successfully",
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      return {
        success: false,
        error: "Failed to submit form",
      }
    }
  },

  async getSubmissionStatus(submissionId: string): Promise<ApiResponse<any>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    try {
      const submissions = getSubmissionsFromStorage()
      const submission = submissions.find((sub) => sub.id === submissionId)

      if (!submission) {
        return {
          success: false,
          error: "Submission not found",
        }
      }

      return {
        success: true,
        data: {
          id: submission.id,
          status: submission.status,
          businessName: submission.businessName,
          businessType: submission.businessType,
          submittedDate: submission.submittedDate,
          updatedDate: submission.updatedDate,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch submission status",
      }
    }
  },

  async getSubmissions(userId?: string): Promise<FormSubmission[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const submissions = getSubmissionsFromStorage()
      const currentUser = authApi.getCurrentUser()
      const targetUserId = userId || currentUser?.id || "user_001"

      // Filter submissions by user ID - only return submissions for the current user
      return submissions.filter((sub) => sub.userId === targetUserId)
    } catch (error) {
      console.error("Error fetching submissions:", error)
      return []
    }
  },

  async getSubmission(id: string): Promise<FormSubmission | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    try {
      const submissions = getSubmissionsFromStorage()
      const currentUser = authApi.getCurrentUser()
      const userId = currentUser?.id || "user_001"

      return submissions.find((sub) => sub.id === id && sub.userId === userId) || null
    } catch (error) {
      console.error("Error fetching submission:", error)
      return null
    }
  },
}

// Submissions API
export const submissionsApi = {
  async getUserSubmissions(
    options: { page?: number; limit?: number; status?: string } = {},
  ): Promise<ApiResponse<any>> {
    try {
      const currentUser = authApi.getCurrentUser()
      const userId = currentUser?.id || "user_001"

      // Get user's submissions
      const submissions = getSubmissionsFromStorage()
      const userSubmissions = submissions.filter((sub) => sub.userId === userId)

      // Filter by status if provided
      let filteredSubmissions = userSubmissions
      if (options.status && options.status !== "all") {
        filteredSubmissions = userSubmissions.filter(
          (sub) => sub.status.toLowerCase() === options.status?.toLowerCase(),
        )
      }

      // Apply pagination
      const page = options.page || 1
      const limit = options.limit || 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex)

      return {
        success: true,
        data: {
          submissions: paginatedSubmissions,
          page: page,
          limit: limit,
          total: filteredSubmissions.length,
          totalPages: Math.ceil(filteredSubmissions.length / limit),
        },
      }
    } catch (error) {
      console.error("Error fetching user submissions:", error)
      return {
        success: false,
        error: "Failed to fetch submissions",
      }
    }
  },

  async getSubmissionDetails(submissionId: string): Promise<ApiResponse<any>> {
    try {
      const submissions = getSubmissionsFromStorage()
      const currentUser = authApi.getCurrentUser()
      const userId = currentUser?.id || "user_001"

      const submission = submissions.find((sub) => sub.id === submissionId && sub.userId === userId)

      if (!submission) {
        return {
          success: false,
          error: "Submission not found",
        }
      }

      return {
        success: true,
        data: submission,
      }
    } catch (error) {
      console.error("Error fetching submission details:", error)
      return {
        success: false,
        error: "Failed to fetch submission details",
      }
    }
  },
}

// Payment API
export const paymentApi = {
  async createPaymentIntent(data: { submissionId: string; amount: number; currency?: string }): Promise<
    ApiResponse<any>
  > {
    return apiRequest("/payments/create-intent", "POST", data)
  },

  async confirmPayment(data: { paymentIntentId: string; submissionId: string }): Promise<ApiResponse<any>> {
    return apiRequest("/payments/confirm", "POST", data)
  },
}
