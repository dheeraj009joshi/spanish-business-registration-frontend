"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Filter,
  CreditCard,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  User
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000"

interface Transaction {
  id: string
  userId: string
  userEmail: string
  submissionId: string
  type: string
  amount: number
  currency: string
  status: string
  stripeSessionId: string
  createdAt: string
  paidAt: string
}

const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
  completed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
  failed: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
  expired: { bg: "bg-gray-100", text: "text-gray-700", icon: XCircle },
}

export default function AdminTransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchTransactions()
  }, [pagination.page, statusFilter])

  const fetchTransactions = async () => {
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

      const response = await fetch(`${API_BASE_URL}/api/admin/transactions?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setTransactions(data.data.transactions)
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
      console.error("Failed to fetch transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate totals
  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500">View all payment transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-100 text-blue-700 border-0">
            {pagination.total} transactions
          </Badge>
          <Badge className="bg-green-100 text-green-700 border-0">
            <DollarSign className="h-3 w-3 mr-1" />
            ${totalRevenue.toLocaleString()} completed
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white border-gray-200 text-gray-700">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <CreditCard className="h-12 w-12 mb-4 opacity-50" />
              <p>No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Transaction</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">User</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Paid At</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => {
                    const status = statusColors[transaction.status] || statusColors.pending
                    const StatusIcon = status.icon

                    return (
                      <tr 
                        key={transaction.id} 
                        className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 font-mono">
                              #{transaction.id.slice(-8)}
                            </p>
                            {transaction.submissionId && (
                              <p className="text-xs text-gray-400">
                                Sub: {transaction.submissionId.slice(-8)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="text-sm text-gray-700">
                              {transaction.userEmail || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-blue-100 text-blue-700 border-0">
                            {transaction.type || "—"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-gray-900 font-semibold">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            {transaction.amount?.toLocaleString() || 0}
                            <span className="text-xs text-gray-400 ml-1 uppercase">
                              {transaction.currency || "usd"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`${status.bg} ${status.text} border-0`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {transaction.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(transaction.createdAt)}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-500 text-sm">
                            {formatDate(transaction.paidAt)}
                          </span>
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
