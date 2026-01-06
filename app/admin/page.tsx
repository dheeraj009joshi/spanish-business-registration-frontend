"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Users, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000"

interface DashboardStats {
  users: { total: number }
  submissions: { total: number; pending: number; processing: number; completed: number }
  revenue: { total: number; monthly: number; transactions: number }
  contacts: { total: number; pending: number }
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        router.push("/admin/login")
        return
      }
      
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else if (data.error === "Invalid token" || response.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminData")
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users.total || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/admin/users",
    },
    {
      title: "Submissions",
      value: stats?.submissions.total || 0,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/admin/submissions",
      subtext: `${stats?.submissions.pending || 0} pending`,
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.revenue.total || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/admin/transactions",
      subtext: `$${(stats?.revenue.monthly || 0).toLocaleString()} this month`,
    },
    {
      title: "Contact Queries",
      value: stats?.contacts.total || 0,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/admin/contacts",
      subtext: `${stats?.contacts.pending || 0} pending`,
    },
  ]

  const submissionStatusCards = [
    {
      title: "Pending",
      value: stats?.submissions.pending || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "Processing",
      value: stats?.submissions.processing || 0,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Completed",
      value: stats?.submissions.completed || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="bg-white border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    {stat.subtext && (
                      <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Submission Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Submission Status</CardTitle>
            <CardDescription className="text-gray-500">
              Current status breakdown of all submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {submissionStatusCards.map((status) => (
                <div 
                  key={status.title}
                  className={`p-4 rounded-xl ${status.bgColor} border ${status.borderColor}`}
                >
                  <div className="flex items-center space-x-3">
                    <status.icon className={`h-5 w-5 ${status.color}`} />
                    <span className="text-gray-600 text-sm">{status.title}</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{status.value}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Completion Rate</span>
                <span>
                  {stats?.submissions.total 
                    ? Math.round((stats.submissions.completed / stats.submissions.total) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${stats?.submissions.total 
                      ? (stats.submissions.completed / stats.submissions.total) * 100 
                      : 0}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-gray-500">
              Frequently used actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/submissions?status=pending">
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
              >
                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                View Pending Submissions
              </Button>
            </Link>
            <Link href="/admin/contacts?status=pending">
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-200 text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200"
              >
                <MessageSquare className="h-4 w-4 mr-2 text-orange-500" />
                View Pending Queries
              </Button>
            </Link>
            <Link href="/admin/transactions">
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-200 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
              >
                <CreditCard className="h-4 w-4 mr-2 text-green-500" />
                View Transactions
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-200 text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
              >
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Card */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ${(stats?.revenue.total || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                ${(stats?.revenue.monthly || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {stats?.revenue.transactions || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
