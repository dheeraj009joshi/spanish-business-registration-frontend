"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Search, 
  User,
  Mail,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000"

interface UserData {
  id: string
  email: string
  name: string
  phone: string
  authProvider: string
  submissionCount: number
  createdAt: string
  lastLogin: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchUsers()
  }, [pagination.page])

  const fetchUsers = async () => {
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
      if (search) params.append("search", search)

      const response = await fetch(`${API_BASE_URL}/api/admin/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data.users)
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
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchUsers()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never"
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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500">Manage registered users</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-0 w-fit">
          {pagination.total} total users
        </Badge>
      </div>

      {/* Search */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <User className="h-12 w-12 mb-4 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left p-4 text-sm font-medium text-gray-600">User</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Contact</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Auth</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Submissions</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Joined</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Last Login</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr 
                      key={user.id} 
                      className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold">
                              {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name || "—"}</p>
                            <p className="text-xs text-gray-400">ID: {user.id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="flex items-center text-sm text-gray-700">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <p className="text-xs text-gray-400 mt-1">{user.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={
                          user.authProvider === "google" 
                            ? "bg-red-100 text-red-700 border-0" 
                            : "bg-blue-100 text-blue-700 border-0"
                        }>
                          {user.authProvider || "local"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-gray-700">
                          <FileText className="h-4 w-4 mr-1 text-green-500" />
                          {user.submissionCount}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-500 text-sm">
                          {formatDate(user.lastLogin)}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/users/${user.id}`}>
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
                  ))}
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
