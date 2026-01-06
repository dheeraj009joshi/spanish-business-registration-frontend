"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, Clock, FileText, CheckCircle, AlertCircle, Download, Home, 
  Building2, User, MapPin, CreditCard, MessageSquare, Calendar, RefreshCw
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"
import { submissionsApi, paymentApi } from "@/lib/api"
import { useLanguage } from "@/hooks/use-language"
import { useToast } from "@/hooks/use-toast"

interface Submission {
  id: string
  submissionId?: string
  type: string
  businessName: string
  businessType: string
  email?: string
  phone?: string
  status: string
  paymentStatus?: string
  submittedAt: string
  lastUpdated: string
  totalAmount: number
  notes?: string
  adminNotes?: Array<{
    id: string
    note: string
    adminName?: string
    createdAt: string
    isPublic?: boolean
  }>
  documents?: Array<{ name: string; url: string }>
  timeline?: Array<{
    status: string
    message: string
    timestamp: string
  }>
  transactions?: Array<{
    id: string
    amount: number
    status: string
    createdAt: string
  }>
  data?: Record<string, any>
  businessAddress?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    zipCode?: string
    county?: string
  }
  personalAddress?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    zipCode?: string
    county?: string
  }
  additionalServices?: string[]
  industry?: string
  businessDescription?: string
}

export default function SubmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { language } = useLanguage()
  const { toast } = useToast()
  const submissionId = params.id as string

  const fetchSubmission = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await submissionsApi.getSubmissionById(submissionId)

      if (result.success && result.data) {
        setSubmission(result.data as Submission)
      } else {
        setError(result.error || "Failed to fetch submission details")
      }
    } catch (error) {
      console.error("Failed to fetch submission:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncPayment = async () => {
    if (!submission?.submissionId && !submission?.id) return
    
    setIsSyncing(true)
    try {
      const result = await paymentApi.syncPaymentStatus(submission.submissionId || submission.id)
      
      if (result.success) {
        toast({
          title: "Payment Status Updated",
          description: result.data?.paymentStatus === "paid" 
            ? "Your payment has been confirmed!" 
            : "Payment status synced from Stripe",
        })
        // Refresh submission data
        fetchSubmission()
      } else {
        toast({
          title: "Sync Failed",
          description: result.error || "Could not sync payment status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to sync payment:", error)
      toast({
        title: "Error",
        description: "Failed to sync payment status",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {

    if (submissionId) {
      fetchSubmission()
    }
  }, [submissionId])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock, label: "Pending" },
      processing: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock, label: "Processing" },
      review: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: FileText, label: "Under Review" },
      approved: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle, label: "Approved" },
      completed: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle, label: "Completed" },
      rejected: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: AlertCircle, label: "Rejected" },
      cancelled: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", icon: AlertCircle, label: "Cancelled" },
    }

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant="secondary" className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      unpaid: { color: "bg-red-100 text-red-800", label: "Unpaid" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      refunded: { color: "bg-gray-100 text-gray-800", label: "Refunded" },
      failed: { color: "bg-red-100 text-red-800", label: "Failed" },
    }

    const config = statusConfig[status?.toLowerCase()] || statusConfig.unpaid

    return (
      <Badge variant="secondary" className={config.color}>
        <CreditCard className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "N/A"
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatAddress = (address: Submission["businessAddress"]) => {
    if (!address) return "N/A"
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.zipCode,
      address.county ? `${address.county} County` : null,
    ].filter(Boolean)
    return parts.length > 0 ? parts.join(", ") : "N/A"
  }

  const getBusinessTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      "domestic-profit": "Domestic Profit Corporation",
      "domestic-llc": "Limited Liability Company (LLC)",
      "domestic-nonprofit": "Nonprofit Corporation",
      "domestic-professional": "Professional Corporation",
      "domestic-lp": "Domestic Limited Partnership",
      "domestic-benefit": "Domestic Benefit Corporation",
    }
    return types[type] || type || "LLC"
  }

  const getServiceLabel = (service: string) => {
    const services: Record<string, string> = {
      ein: "EIN (Tax ID) Application",
      "registered-agent": "Registered Agent Service",
      "operating-agreement": "Operating Agreement",
      "business-license": "Business License Research",
      "document-review": "Document Review & Consultation",
      "expedited-processing": "Expedited Processing",
    }
    return services[service] || service
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">GeorgiaBiz Pro</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Welcome, {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </Button>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          ) : submission ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Header Card */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-3">
                        {submission.businessName || "Business Registration"}
                      </CardTitle>
                      <CardDescription className="mt-2 flex flex-wrap items-center gap-2">
                        <span>{submission.type === "DIY" ? "DIY Registration" : "Assisted Registration"}</span>
                        <span>•</span>
                        <span>Submitted {formatDate(submission.submittedAt)}</span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(submission.status)}
                      {getPaymentBadge(submission.paymentStatus || "unpaid")}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content - Left 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Business Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-green-600" />
                        Business Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Business Type</p>
                          <p className="text-gray-900 dark:text-white">{getBusinessTypeLabel(submission.businessType)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Business Name</p>
                          <p className="text-gray-900 dark:text-white">{submission.businessName || "N/A"}</p>
                        </div>
                        {submission.email && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-gray-900 dark:text-white">{submission.email}</p>
                          </div>
                        )}
                        {submission.phone && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p className="text-gray-900 dark:text-white">{submission.phone}</p>
                          </div>
                        )}
                        {submission.industry && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Industry</p>
                            <p className="text-gray-900 dark:text-white">{submission.industry}</p>
                          </div>
                        )}
                      </div>
                      {submission.businessDescription && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Business Description</p>
                          <p className="text-gray-900 dark:text-white">{submission.businessDescription}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Addresses */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        Addresses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Business Address</p>
                        <p className="text-gray-900 dark:text-white">{formatAddress(submission.businessAddress)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Personal Address</p>
                        <p className="text-gray-900 dark:text-white">{formatAddress(submission.personalAddress)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Services */}
                  {submission.additionalServices && submission.additionalServices.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Additional Services
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {submission.additionalServices.map((service) => (
                            <Badge key={service} variant="secondary" className="bg-green-100 text-green-800">
                              {getServiceLabel(service)}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Admin Notes / Messages */}
                  {submission.adminNotes && submission.adminNotes.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-green-600" />
                          Messages from Our Team
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {submission.adminNotes
                            .filter(note => note.isPublic !== false)
                            .map((note, index) => (
                              <div 
                                key={note.id || index} 
                                className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500"
                              >
                                <p className="text-gray-900 dark:text-white">{note.note}</p>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                  <User className="w-3 h-3" />
                                  <span>{note.adminName || "Admin"}</span>
                                  <span>•</span>
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(note.createdAt)}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Timeline */}
                  {submission.timeline && submission.timeline.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-green-600" />
                          Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {submission.timeline.map((event, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 border-l-2 border-green-500 pl-4 pb-4 last:pb-0"
                            >
                              <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 -ml-[17px]" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                  {event.status?.replace(/_/g, " ")}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(event.timestamp)}</p>
                                {event.message && (
                                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{event.message}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar - Right column */}
                <div className="space-y-6">
                  {/* Payment Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        Payment Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Total Amount</span>
                        <span className="text-xl font-bold text-green-600">${submission.totalAmount || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Payment Status</span>
                        {getPaymentBadge(submission.paymentStatus || "unpaid")}
                      </div>
                      
                      {/* Sync Payment Button - show if unpaid but has transactions */}
                      {(submission.paymentStatus === "unpaid" || submission.paymentStatus === "pending") && 
                       submission.transactions && submission.transactions.length > 0 && (
                        <Button
                          onClick={handleSyncPayment}
                          disabled={isSyncing}
                          variant="outline"
                          className="w-full border-green-500 text-green-600 hover:bg-green-50"
                        >
                          {isSyncing ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Sync Payment Status
                            </>
                          )}
                        </Button>
                      )}
                      
                      {/* Transactions */}
                      {submission.transactions && submission.transactions.length > 0 && (
                        <div className="border-t pt-4 mt-4">
                          <p className="text-sm font-medium text-gray-500 mb-2">Transactions</p>
                          {submission.transactions.map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center py-2 border-b last:border-0">
                              <div>
                                <p className="text-sm font-medium">${tx.amount}</p>
                                <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                              </div>
                              <Badge variant="secondary" className={
                                tx.status === "completed" ? "bg-green-100 text-green-800" : 
                                tx.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                                "bg-red-100 text-red-800"
                              }>
                                {tx.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Documents */}
                  {submission.documents && submission.documents.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {submission.documents.map((doc, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => window.open(doc.url, "_blank")}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              {doc.name}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Submission ID</p>
                        <p className="text-sm text-gray-900 dark:text-white font-mono">
                          {submission.submissionId || submission.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Registration Type</p>
                        <p className="text-sm text-gray-900 dark:text-white">{submission.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Updated</p>
                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(submission.lastUpdated)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Need Help */}
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Need Help?</h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                        Our team is here to assist you with your registration.
                      </p>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => router.push("/contact")}
                      >
                        Contact Support
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Submission not found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                The submission you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => router.push("/dashboard")}>View All Submissions</Button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
