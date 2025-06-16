"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"
import { formApi, type FormSubmission } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function SuccessPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const submissionType = searchParams.get("type") || "assisted"
  const submissionId = searchParams.get("submissionId")
  const { user } = useAuth()

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true)
        const data = await formApi.getSubmissions()
        setSubmissions(data)
      } catch (error) {
        console.error("Failed to fetch submissions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  const filteredSubmissions =
    activeTab === "all"
      ? submissions
      : submissions.filter((sub) => sub.status.toLowerCase() === activeTab.toLowerCase())

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <img src="/images/logo.png" alt="GeorgiaBiz Pro" className="h-8 w-8 mr-2" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">GeorgiaBiz Pro</h1>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {submissionType === "assisted"
                    ? "Your business registration request has been submitted!"
                    : "Your business registration has been submitted!"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {submissionType === "assisted"
                    ? "Our team will review your information and contact you within 24 hours to proceed with your registration."
                    : "Your registration is being processed. You can check the status below."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submissions List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Business Submissions</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track and manage your business registration submissions
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex px-6 -mb-px">
                {["all", "pending", "processing", "completed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 mr-8 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? "border-green-500 text-green-600 dark:text-green-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Submissions */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-green-600 dark:border-t-green-400"></div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading submissions...</p>
                </div>
              ) : filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <div key={submission.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`
                        p-2 rounded-full mr-4
                        ${
                          submission.type === "ASSISTED"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        }
                      `}
                      >
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{submission.businessName}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {submission.type} Registration • Submitted{" "}
                          {new Date(submission.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-4
                        ${submission.status === "PENDING" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}
                        ${submission.status === "PROCESSING" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}
                        ${submission.status === "COMPLETED" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"}
                        ${submission.status === "REJECTED" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}
                      `}
                      >
                        {submission.status}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/submissions/${submission.id}`)}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Details
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {activeTab === "all"
                      ? "No submissions found. Start your first business registration!"
                      : `No ${activeTab} submissions found.`}
                  </p>
                  <Button className="mt-4" onClick={() => router.push("/register/diy")}>
                    Start New Registration
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
