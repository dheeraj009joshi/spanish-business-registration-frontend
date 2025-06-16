export interface Submission {
  id: string
  type: "DIY" | "ASSISTED"
  businessName: string
  status: "pending" | "processing" | "completed" | "rejected"
  submittedAt: string
  lastUpdated: string
  totalAmount: number
  notes?: string
  documents?: Array<{
    id: string
    name: string
    url: string
    type: string
  }>
  // Additional fields from your API
  data?: {
    principalState?: string
    businesstype?: string
    principalAddress1?: string
    principalCity?: string
    principalZip?: string
    confirmPrimaryEmail?: string
    naicsCode?: string
    naicsSubCode?: string
    primaryEmail?: string
    principalAddress2?: string
    county?: string
    organizerInfo?: string
    registeredAgentInfo?: any
    agreeToPay?: boolean
  }
}

export interface SubmissionsResponse {
  submissions: Submission[]
  total: number
  page: number
  limit: number
  totalPages: number
}
