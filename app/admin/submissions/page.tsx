"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Calendar,
  DollarSign
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000"

interface Submission {
  id: string
  submissionId: string
  userId: string
  type: string
  status: string
  paymentStatus: string
  businessName: string
  businessType: string
  email: string
  phone: string
  totalAmount: number
  createdAt: string
  lastUpdated: string
}

const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
  processing: { bg: "bg-blue-100", text: "text-blue-700", icon: AlertCircle },
  review: { bg: "bg-purple-100", text: "text-purple-700", icon: Eye },
  approved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  completed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
  cancelled: { bg: "bg-gray-100", text: "text-gray-700", icon: XCircle },
}

const paymentStatusColors: Record<string, { bg: string; text: string }> = {
  paid: { bg: "bg-green-100", text: "text-green-700" },
  unpaid: { bg: "bg-red-100", text: "text-red-700" },
  pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
}

export default function AdminSubmissionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchSubmissions()
  }, [pagination.page, statusFilter])

  const fetchSubmissions = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        router.push("/admin/login")
        return
      }
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (search) params.append("search", search)

      const response = await fetch(`${API_BASE_URL}/api/admin/submissions?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setSubmissions(data.data.submissions)
        setPagination((prev) => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
        }))
      } else if (data.error === "Invalid token" || response.status === 401) {
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminData")
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchSubmissions()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
          <p className="text-gray-500">Manage all business registration submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-700 border-0">
            {pagination.total} total
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by business name, email, or submission ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white border-gray-200 text-gray-700">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Building2 className="h-12 w-12 mb-4 opacity-50" />
              <p>No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Submission</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Business</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Contact</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Payment</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => {
                    const status = statusColors[submission.status] || statusColors.pending
                    const paymentStatus = paymentStatusColors[submission.paymentStatus] || paymentStatusColors.unpaid
                    const StatusIcon = status.icon

                    return (
                      <tr 
                        key={submission.id} 
                        className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              #{submission.submissionId?.slice(-8) || submission.id.slice(-8)}
                            </p>
                            <p className="text-xs text-gray-400">{submission.type}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {submission.businessName || "N/A"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {submission.businessType || "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <User className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                {submission.email || "N/A"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {submission.phone || "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`${status.bg} ${status.text} border-0`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {submission.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={`${paymentStatus.bg} ${paymentStatus.text} border-0`}>
                            <DollarSign className="h-3 w-3 mr-1" />
                            {submission.paymentStatus || "unpaid"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(submission.createdAt)}
                          </div>
                        </td>
                        <td className="p-4">
                          <Link href={`/admin/submissions/${submission.submissionId || submission.id}`}>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
