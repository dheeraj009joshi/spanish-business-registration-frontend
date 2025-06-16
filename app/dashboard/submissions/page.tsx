"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Download, ExternalLink, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"
import { submissionsApi } from "@/lib/api"
import type { Submission, SubmissionsResponse } from "@/types/submission"

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const { user } = useAuth()

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await submissionsApi.getUserSubmissions({
          page: pagination.page,
          limit: pagination.limit,
          status: activeTab !== "all" ? activeTab : undefined,
        })

        if (result.success && result.data) {
          const responseData = result.data as SubmissionsResponse
          setSubmissions(responseData.submissions || [])
          setPagination({
            page: responseData.page || 1,
            limit: responseData.limit || 10,
            total: responseData.total || 0,
            totalPages: responseData.totalPages || 0,
          })
        } else {
          setError(result.error || "Failed to fetch submissions")
          setSubmissions([])
        }
      } catch (error) {
        console.error("Failed to fetch submissions:", error)
        setError("An unexpected error occurred")
        setSubmissions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubmissions()
  }, [activeTab, pagination.page])

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

  const handleWhatsAppHelp = () => {
    const message = `Hi! I need help with my business registration submissions. My email: ${user?.email}`
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
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
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src="/images/logo.png"
                      alt="GeorgiaBiz Pro Logo"
                      className="w-full h-full object-contain"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">GeorgiaBiz Pro</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={handleWhatsAppHelp} className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Need Help?
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Welcome, {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Back to Dashboard Button */}
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 w-fit" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Your Business Submissions</CardTitle>
                <CardDescription>
                  Track and manage your business registration submissions
                  {pagination.total > 0 && (
                    <span className="ml-2 text-blue-600 dark:text-blue-400">
                      ({pagination.total} total submissions)
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="processing">Processing</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-0">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                    ) : error ? (
                      <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
                        <Button onClick={() => setActiveTab(activeTab)}>Retry</Button>
                      </div>
                    ) : submissions.length > 0 ? (
                      <div className="space-y-4">
                        {submissions.map((submission) => (
                          <div
                            key={submission.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    submission.type === "DIY"
                                      ? "bg-blue-100 dark:bg-blue-900/30"
                                      : "bg-green-100 dark:bg-green-900/30"
                                  }`}
                                >
                                  <div className="w-5 h-5 rounded overflow-hidden flex items-center justify-center">
                                    <img
                                      src="/images/logo.png"
                                      alt="GeorgiaBiz Pro Logo"
                                      className="w-full h-full object-contain"
                                      width={20}
                                      height={20}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {submission.businessName || "Business Registration"}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {submission.type === "DIY" ? "DIY Registration" : "Assisted Registration"} •
                                    Submitted {formatDate(submission.submittedAt)}
                                  </p>
                                  {submission.data?.principalState && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                      State: {submission.data.principalState} • Type: {submission.data.businesstype}
                                    </p>
                                  )}
                                  {submission.notes && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">
                                      "{submission.notes}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <div className="flex flex-col items-start sm:items-end">
                                  {getStatusBadge(submission.status)}
                                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Updated {formatDate(submission.lastUpdated)}
                                  </span>
                                  {submission.totalAmount > 0 && (
                                    <span className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                      ${submission.totalAmount}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  {submission.status === "completed" &&
                                    submission.documents &&
                                    submission.documents.length > 0 && (
                                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                                        <Download className="w-4 h-4" />
                                        Documents
                                      </Button>
                                    )}
                                  <Button size="sm" variant="outline" asChild>
                                    <Link href={`/dashboard/submissions/${submission.id}`}>
                                      <ExternalLink className="w-4 h-4 mr-1" />
                                      Details
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                          <div className="flex justify-center items-center space-x-2 mt-6">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={pagination.page <= 1}
                              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                            >
                              Previous
                            </Button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={pagination.page >= pagination.totalPages}
                              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                            >
                              Next
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center mx-auto mb-4 bg-gray-100">
                          <img
                            src="/images/logo.png"
                            alt="GeorgiaBiz Pro Logo"
                            className="w-full h-full object-contain"
                            width={48}
                            height={48}
                          />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No submissions found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                          {activeTab === "all"
                            ? "You haven't submitted any business registration forms yet."
                            : `You don't have any ${activeTab} submissions.`}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button asChild>
                            <Link href="/register/diy">Start DIY Registration</Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link href="/register/assisted">Get Assistance</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  )
}
