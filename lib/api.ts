"use client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.georgia.registrarnegocio.com/api"
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
    return apiRequest<{ submissionId: string }>("/forms/submit", "POST", formData)
  },

  async getSubmissionStatus(submissionId: string): Promise<ApiResponse<any>> {
    return apiRequest(`/submissions/${submissionId}`, "GET")
  },

  async getSubmissions(userId?: string): Promise<FormSubmission[]> {
    const result = await apiRequest<{ submissions: any[] }>("/submissions", "GET")
    if (result.success && result.data?.submissions) {
      return result.data.submissions.map((sub: any) => ({
        id: sub.id,
        type: sub.type,
        status: sub.status?.toUpperCase() || "PENDING",
        businessName: sub.businessName || "Unnamed Business",
        businessType: sub.businessType || "domestic-llc",
        submittedDate: sub.submittedAt,
        updatedDate: sub.lastUpdated,
        data: sub.data || {},
        userId: sub.userId,
        totalAmount: sub.totalAmount || 0,
        notes: sub.notes || "",
        documents: sub.documents || [],
      }))
    }
    return []
  },

  async getSubmission(id: string): Promise<FormSubmission | null> {
    const result = await apiRequest<any>(`/submissions/${id}`, "GET")
    if (result.success && result.data) {
      const sub = result.data
      return {
        id: sub.id,
        type: sub.type,
        status: sub.status?.toUpperCase() || "PENDING",
        businessName: sub.businessName || "Unnamed Business",
        businessType: sub.businessType || "domestic-llc",
        submittedDate: sub.submittedAt,
        updatedDate: sub.lastUpdated,
        data: sub.businessDetails || {},
        userId: sub.userId,
        totalAmount: sub.totalAmount || 0,
        notes: sub.notes || "",
        documents: sub.documents || [],
      }
    }
    return null
  },
}

// Submissions API
export const submissionsApi = {
  async getUserSubmissions(
    options: { page?: number; limit?: number; status?: string } = {},
  ): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    if (options.page) queryParams.append("page", options.page.toString())
    if (options.limit) queryParams.append("limit", options.limit.toString())
    
    const result = await apiRequest<any>(`/submissions?${queryParams.toString()}`, "GET")
    
    if (result.success && result.data) {
      // Transform submissions to match frontend format
      const transformedSubmissions = result.data.submissions?.map((sub: any) => ({
        id: sub.id,
        type: sub.type,
        businessName: sub.businessName || "Unnamed Business",
        status: sub.status?.toLowerCase() || "pending",
        submittedAt: sub.submittedAt,
        lastUpdated: sub.lastUpdated,
        totalAmount: sub.totalAmount || 0,
        notes: sub.notes || "",
        documents: sub.documents || [],
        data: sub.data || {},
      })) || []

      // Filter by status on client side if needed
      let filteredSubmissions = transformedSubmissions
      if (options.status && options.status !== "all") {
        filteredSubmissions = transformedSubmissions.filter(
          (sub: any) => sub.status.toLowerCase() === options.status?.toLowerCase(),
        )
      }

      return {
        success: true,
        data: {
          submissions: filteredSubmissions,
          page: result.data.pagination?.page || options.page || 1,
          limit: result.data.pagination?.limit || options.limit || 10,
          total: result.data.pagination?.total || filteredSubmissions.length,
          totalPages: result.data.pagination?.totalPages || Math.ceil(filteredSubmissions.length / (options.limit || 10)),
        },
      }
    }
    
    return result
  },

  async getSubmissionDetails(submissionId: string): Promise<ApiResponse<any>> {
    const result = await apiRequest<any>(`/submissions/${submissionId}`, "GET")
    
    if (result.success && result.data) {
      return {
        success: true,
        data: {
          id: result.data.id,
          submissionId: result.data.submissionId,
          type: result.data.type,
          businessName: result.data.businessName || "Unnamed Business",
          businessType: result.data.businessType,
          email: result.data.email,
          phone: result.data.phone,
          status: result.data.status?.toLowerCase() || "pending",
          paymentStatus: result.data.paymentStatus || "unpaid",
          submittedAt: result.data.submittedAt,
          lastUpdated: result.data.lastUpdated,
          totalAmount: result.data.totalAmount || 0,
          notes: result.data.notes || "",
          adminNotes: result.data.adminNotes || [],
          documents: result.data.documents || [],
          timeline: result.data.timeline || [],
          transactions: result.data.transactions || [],
          data: result.data.data || {},
          businessAddress: result.data.businessAddress || {},
          personalAddress: result.data.personalAddress || {},
          additionalServices: result.data.additionalServices || [],
          industry: result.data.industry || "",
          businessDescription: result.data.businessDescription || "",
        },
      }
    }
    
    return result
  },

  async getSubmissionById(submissionId: string): Promise<ApiResponse<any>> {
    return this.getSubmissionDetails(submissionId)
  },

  async getSubmissionNotes(submissionId: string): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/submissions/${submissionId}/notes`, "GET")
  },
}

// Payment API - Secure Stripe Integration
export const paymentApi = {
  /**
   * Create a Stripe Checkout Session
   * Payment status is ONLY updated via Stripe webhooks (secure approach)
   */
  async createCheckoutSession(data: { 
    submissionId?: string
    type: "DIY" | "ASSISTED"
    additionalServices?: string[]
  }): Promise<ApiResponse<{ sessionId: string; url: string }>> {
    return apiRequest("/payments/create-checkout-session", "POST", data)
  },

  /**
   * Verify a checkout session status and update payment if paid
   */
  async verifySession(sessionId: string): Promise<ApiResponse<{
    status: string
    submissionId: string
    amount: number
  }>> {
    return apiRequest(`/payments/verify-session/${sessionId}`, "GET")
  },

  /**
   * Sync payment status from Stripe for a submission
   */
  async syncPaymentStatus(submissionId: string): Promise<ApiResponse<{
    paymentStatus: string
    amount?: number
    message?: string
  }>> {
    return apiRequest(`/payments/sync-payment/${submissionId}`, "POST")
  },

  /**
   * Get user's transaction history
   */
  async getUserTransactions(options: { page?: number; limit?: number } = {}): Promise<ApiResponse<{
    transactions: Array<{
      id: string
      submissionId: string
      type: string
      amount: number
      currency: string
      status: string
      createdAt: string
      paidAt?: string
    }>
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }>> {
    const params = new URLSearchParams()
    if (options.page) params.append("page", options.page.toString())
    if (options.limit) params.append("limit", options.limit.toString())
    return apiRequest(`/payments/user-transactions?${params.toString()}`, "GET")
  },
}

// Contact API
export const contactApi = {
  /**
   * Submit a contact form inquiry
   */
  async submitContactForm(data: {
    name: string
    email: string
    phone?: string
    subject?: string
    message: string
  }): Promise<ApiResponse<{ id: string; message: string }>> {
    return apiRequest("/admin/public/contact", "POST", data)
  },
}
