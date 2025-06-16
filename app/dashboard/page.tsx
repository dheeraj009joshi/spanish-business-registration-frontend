"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Home, Mail, ArrowLeft, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"
import { formApi } from "@/lib/api"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success")
  const type = searchParams.get("type")
  const { user } = useAuth()
  const [showSuccess, setShowSuccess] = useState(false)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (success === "true") {
      setShowSuccess(true)
      // Auto-hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

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
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Welcome, {user?.firstName} {user?.lastName}
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Back to Home Button - Small and positioned in top left */}
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 w-fit" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 mx-4 mt-4 rounded-r-lg"
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
              <div>
                <p className="text-green-700 dark:text-green-300 font-medium">
                  {type === "assisted"
                    ? "Assisted Service Request Submitted Successfully!"
                    : "DIY Registration Submitted Successfully!"}
                </p>
                <p className="text-green-600 dark:text-green-400 text-sm">
                  {type === "assisted"
                    ? "Our team will contact you within 24 hours to begin processing your registration."
                    : "Your registration is being processed. You'll receive updates via email."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Dashboard */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded overflow-hidden flex items-center justify-center">
                          <img
                            src="/images/logo.png"
                            alt="GeorgiaBiz Pro Logo"
                            className="w-full h-full object-contain"
                            width={20}
                            height={20}
                          />
                        </div>
                        <span>Your Registrations</span>
                      </CardTitle>
                      <CardDescription>Track the status of your business registrations</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                      <Link href="/dashboard/submissions">
                        <ExternalLink className="w-4 h-4" />
                        View All
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : submissions.length > 0 ? (
                      <div className="space-y-4">
                        {submissions.slice(0, 3).map((submission) => (
                          <div
                            key={submission.id}
                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
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
                                <h3 className="font-medium text-gray-900 dark:text-white">{submission.businessName}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {submission.type} Registration • Submitted{" "}
                                  {new Date(submission.submittedDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="secondary"
                                className={`
                                  ${submission.status === "PENDING" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}
                                  ${submission.status === "PROCESSING" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}
                                  ${submission.status === "COMPLETED" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"}
                                  ${submission.status === "REJECTED" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}
                                `}
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                {submission.status}
                              </Badge>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/dashboard/submissions/${submission.id}`}>Details</Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center mx-auto mb-4 bg-gray-100">
                          <img
                            src="/images/logo.png"
                            alt="GeorgiaBiz Pro Logo"
                            className="w-full h-full object-contain"
                            width={48}
                            height={48}
                          />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No registrations yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          Start your business registration process today
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
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto p-4 justify-start" asChild>
                        <Link href="/register/diy">
                          <div className="w-5 h-5 rounded overflow-hidden flex items-center justify-center mr-3">
                            <img
                              src="/images/logo.png"
                              alt="GeorgiaBiz Pro Logo"
                              className="w-full h-full object-contain"
                              width={20}
                              height={20}
                            />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">New DIY Registration</div>
                            <div className="text-sm text-gray-500">Complete registration yourself</div>
                          </div>
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start" asChild>
                        <Link href="/register/assisted">
                          <Mail className="w-5 h-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">Get Assistance</div>
                            <div className="text-sm text-gray-500">Let our team help you</div>
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                      <p className="text-gray-900 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                      <p className="text-gray-900 dark:text-white">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</label>
                      <p className="text-gray-900 dark:text-white">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Today"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link
                      href="/resources/guide"
                      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">Business Guide</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Step-by-step instructions</div>
                    </Link>
                    <Link
                      href="/resources/faq"
                      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">FAQ</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Common questions</div>
                    </Link>
                    <Link
                      href="/contact"
                      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">Contact Support</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Get help from our team</div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
