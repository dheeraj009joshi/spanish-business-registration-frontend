"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, FileText, CheckCircle, AlertCircle, Download, Calendar, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"
import { submissionsApi } from "@/lib/api"

// Types for submission details
interface SubmissionDetail {
  id: string
  type: "DIY" | "ASSISTED"
  businessName: string
  businessType: string
  status: "pending" | "processing" | "completed" | "rejected"
  submittedAt: string
  lastUpdated: string
  totalAmount: number
  documents?: Array<{
    id: string
    name: string
    url: string
    type: string
  }>
  notes?: string
  timeline?: Array<{
    date: string
    status: string
    description: string
  }>
  businessDetails?: Record<string, any>
}

export default function SubmissionDetailPage() {
  const { id } = useParams()
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await submissionsApi.getSubmissionDetails(id as string)

        if (result.success && result.data) {
          setSubmission(result.data)
        } else {
          setError(result.error || "Failed to fetch submission details")
        }
      } catch (error) {
        console.error("Failed to fetch submission details:", error)
        setError("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchSubmissionDetails()
    }
  }, [id])

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

        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 w-fit" asChild>
            <Link href="/dashboard/submissions">
              <ArrowLeft className="w-4 h-4" />
              Back to Submissions
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
              <Button asChild>
                <Link href="/dashboard/submissions">View All Submissions</Link>
              </Button>
            </div>
          ) : submission ? (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Main Details */}
              <div className="md:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl">{submission.businessName}</CardTitle>
                          <CardDescription>
                            {submission.type === "DIY" ? "DIY Registration" : "Assisted Registration"} •
                            {submission.businessType}
                          </CardDescription>
                        </div>
                        {getStatusBadge(submission.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Submitted</div>
                          <div className="flex items-center mt-1">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{formatDate(submission.submittedAt)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                          <div className="flex items-center mt-1">
                            <Clock className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{formatDate(submission.lastUpdated)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Total Amount</div>
                          <div className="flex items-center mt-1">
                            <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                            <span>${submission.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {submission.notes && (
                        <div className="mb-6">
                          <h3 className="font-medium mb-2">Notes</h3>
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md text-gray-700 dark:text-gray-300 italic">
                            "{submission.notes}"
                          </div>
                        </div>
                      )}

                      {/* Business Details */}
                      {submission.businessDetails && (
                        <div>
                          <h3 className="font-medium mb-3">Business Details</h3>
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-4">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                              {Object.entries(submission.businessDetails).map(([key, value]) => (
                                <div key={key}>
                                  <dt className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </dt>
                                  <dd className="text-gray-900 dark:text-gray-100">{String(value)}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Documents Section */}
                {submission.status === "completed" && submission.documents && submission.documents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Documents</CardTitle>
                        <CardDescription>Download your business registration documents</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {submission.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 text-blue-600 mr-3" />
                                <span>{doc.name}</span>
                              </div>
                              <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                  <Download className="w-4 h-4" />
                                  Download
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Sidebar - Timeline */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Timeline</CardTitle>
                      <CardDescription>Track the progress of your submission</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {submission.timeline && submission.timeline.length > 0 ? (
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-3.5 top-1 bottom-1 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                          <div className="space-y-6">
                            {submission.timeline.map((event, index) => (
                              <div key={index} className="relative pl-10">
                                <div
                                  className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center ${
                                    index === 0 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800"
                                  }`}
                                >
                                  <div
                                    className={`w-2.5 h-2.5 rounded-full ${
                                      index === 0 ? "bg-blue-600 dark:bg-blue-400" : "bg-gray-400 dark:bg-gray-500"
                                    }`}
                                  ></div>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(event.date).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                  <h4 className="font-medium text-gray-900 dark:text-white mt-1">{event.status}</h4>
                                  <p className="text-gray-600 dark:text-gray-300 mt-1">{event.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Clock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Timeline information will appear here as your submission progresses.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Submission not found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                The submission you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button asChild>
                <Link href="/dashboard/submissions">View All Submissions</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
