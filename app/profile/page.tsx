"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Mail, Save, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { formApi, type FormSubmission } from "@/lib/api"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
  })
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    // Here you would call an API to update the user profile
    // For now, we'll just toggle the editing state
    setIsEditing(false)
  }

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
        <Header />

        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="mb-6">
              <Button variant="ghost" size="sm" className="flex items-center gap-2" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Profile Sidebar */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader className="text-center">
                      <div className="mx-auto w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <User className="w-12 h-12 text-blue-600" />
                      </div>
                      <CardTitle>
                        {user?.firstName} {user?.lastName}
                      </CardTitle>
                      <CardDescription>{user?.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-gray-500 mr-3" />
                          <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-500 mr-3" />
                          <Link href="/dashboard/submissions" className="text-blue-600 hover:underline">
                            View All Submissions
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Profile Information</CardTitle>
                        <Button
                          variant={isEditing ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? "Cancel" : "Edit Profile"}
                        </Button>
                      </div>
                      <CardDescription>Manage your account details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            disabled={!isEditing}
                            placeholder={isEditing ? "Enter your phone number" : "Not provided"}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            disabled={!isEditing}
                            placeholder={isEditing ? "Enter your address" : "Not provided"}
                          />
                        </div>

                        {isEditing && (
                          <div className="flex justify-end">
                            <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                              <Save className="w-4 h-4" />
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-6"
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Submissions</CardTitle>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/dashboard/submissions">View All</Link>
                        </Button>
                      </div>
                      <CardDescription>Your recent business registration submissions</CardDescription>
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
                              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                              <div>
                                <h4 className="font-medium">{submission.businessName}</h4>
                                <p className="text-sm text-gray-500">
                                  {submission.type} • {new Date(submission.submittedDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`
                                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                  ${submission.status === "PENDING" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}
                                  ${submission.status === "PROCESSING" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}
                                  ${submission.status === "COMPLETED" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"}
                                  ${submission.status === "REJECTED" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}
                                `}
                                >
                                  {submission.status}
                                </span>
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/submissions/${submission.id}`}>Details</Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No submissions yet</p>
                          <Button className="mt-4" asChild>
                            <Link href="/register/diy">Start Registration</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  )
}
