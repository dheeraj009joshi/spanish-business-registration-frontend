"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Filter,
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Mail,
  Clock,
  CheckCircle,
  Eye,
  User
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  createdAt: string
  respondedAt: string
}

const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
  in_progress: { bg: "bg-blue-100", text: "text-blue-700", icon: Eye },
  resolved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  closed: { bg: "bg-gray-100", text: "text-gray-700", icon: CheckCircle },
}

export default function AdminContactsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [responseNote, setResponseNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchContacts()
  }, [pagination.page, statusFilter])

  const fetchContacts = async () => {
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

      const response = await fetch(`${API_BASE_URL}/api/admin/contacts?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setContacts(data.data.contacts)
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
      console.error("Failed to fetch contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateContactStatus = async () => {
    if (!selectedContact || !newStatus) return
    setIsUpdating(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`${API_BASE_URL}/api/admin/contacts/${selectedContact.id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, responseNote }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Status updated successfully" })
        fetchContacts()
        setShowDetailDialog(false)
        setNewStatus("")
        setResponseNote("")
      } else {
        toast({ title: "Failed to update status", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error updating status", variant: "destructive" })
    } finally {
      setIsUpdating(false)
    }
  }

  const openContactDetail = (contact: Contact) => {
    setSelectedContact(contact)
    setNewStatus(contact.status)
    setShowDetailDialog(true)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Queries</h1>
          <p className="text-gray-500">Manage customer inquiries and support requests</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-0 w-fit">
          {pagination.total} queries
        </Badge>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
              <p>No contact queries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Contact</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Subject</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Message</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => {
                    const status = statusColors[contact.status] || statusColors.pending
                    const StatusIcon = status.icon

                    return (
                      <tr 
                        key={contact.id} 
                        className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                              <div className="flex items-center text-xs text-gray-400">
                                <Mail className="h-3 w-3 mr-1" />
                                {contact.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-700">{contact.subject || "General Inquiry"}</p>
                        </td>
                        <td className="p-4 max-w-xs">
                          <p className="text-sm text-gray-500 truncate">{contact.message}</p>
                        </td>
                        <td className="p-4">
                          <Badge className={`${status.bg} ${status.text} border-0`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {contact.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(contact.createdAt)}
                          </div>
                        </td>
                        <td className="p-4">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => openContactDetail(contact)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
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

      {/* Contact Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="bg-white border-gray-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Contact Query Details</DialogTitle>
            <DialogDescription className="text-gray-500">
              Review and respond to this inquiry
            </DialogDescription>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4 py-4">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase">Name</p>
                  <p className="text-gray-900 mt-1">{selectedContact.name}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase">Email</p>
                  <p className="text-gray-900 mt-1">{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase">Phone</p>
                    <p className="text-gray-900 mt-1">{selectedContact.phone}</p>
                  </div>
                )}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase">Subject</p>
                  <p className="text-gray-900 mt-1">{selectedContact.subject || "General Inquiry"}</p>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-400 uppercase mb-2">Message</p>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>

              {/* Date Info */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Received: {formatDate(selectedContact.createdAt)}</span>
                {selectedContact.respondedAt && (
                  <span>Responded: {formatDate(selectedContact.respondedAt)}</span>
                )}
              </div>

              {/* Update Status */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="bg-white border-gray-200 text-gray-700">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Add a response note (optional)..."
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                  className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)} className="border-gray-200">
              Cancel
            </Button>
            <Button 
              onClick={updateContactStatus}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
