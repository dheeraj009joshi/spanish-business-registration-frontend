"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, FileText, CheckCircle, AlertCircle, Download, Home } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"
import { submissionsApi } from "@/lib/api"
import type { Submission } from "@/types/submission"

export default function SubmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const submissionId = params.id as string

  useEffect(() => {
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

    if (submissionId) {
      fetchSubmission()
    }
  }, [submissionId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            Unknown
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          ) : submission ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        {submission.businessName || "Business Registration"}{" "}
                        <span className="ml-2">{getStatusBadge(submission.status)}</span>
                      </CardTitle>
                      <CardDescription>
                        {submission.type === "DIY" ? "DIY Registration" : "Assisted Registration"} • Submitted{" "}
                        {formatDate(submission.submittedAt)}
                      </CardDescription>
                    </div>
                    {submission.status === "completed" && submission.documents && submission.documents.length > 0 && (
                      <Button className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Documents
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Submission Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Information</h3>
                      <div className="space-y-2">
                        {submission.data?.businesstype && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Type</div>
                            <div className="text-sm text-gray-900 dark:text-white">{submission.data.businesstype}</div>
                          </div>
                        )}
                        {submission.data?.businessName1 && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Name</div>
                            <div className="text-sm text-gray-900 dark:text-white">{submission.data.businessName1}</div>
                          </div>
                        )}
                        {submission.data?.principalState && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">State</div>
                            <div className="text-sm text-gray-900 dark:text-white">
                              {submission.data.principalState}
                            </div>
                          </div>
                        )}
                        {submission.data?.principalCity && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">City</div>
                            <div className="text-sm text-gray-900 dark:text-white">{submission.data.principalCity}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Status Information</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Status</div>
                          <div className="text-sm text-gray-900 dark:text-white">{submission.status}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {formatDate(submission.lastUpdated)}
                          </div>
                        </div>
                        {submission.totalAmount > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</div>
                            <div className="text-sm text-gray-900 dark:text-white">${submission.totalAmount}</div>
                          </div>
                        )}
                        {submission.paymentStatus && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status</div>
                            <div className="text-sm text-gray-900 dark:text-white">{submission.paymentStatus}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {submission.notes && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notes</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300">{submission.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  {submission.timeline && submission.timeline.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Timeline</h3>
                      <div className="space-y-4">
                        {submission.timeline.map((event, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 border-l-2 border-blue-500 pl-4 pb-4 last:pb-0"
                          >
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 -ml-[17px]" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(event.date)}</p>
                              {event.description && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{event.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Submission not found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                The submission you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => router.push("/success")}>View All Submissions</Button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
