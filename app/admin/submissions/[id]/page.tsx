"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft,
  Building2,
  User,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  FileText,
  MessageSquare,
  Plus,
  Eye
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  DialogTrigger,
} from "@/components/ui/dialog"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000"

interface SubmissionDetail {
  id: string
  submissionId: string
  userId: string
  user: { id: string; email: string; name: string } | null
  type: string
  status: string
  paymentStatus: string
  businessName: string
  businessType: string
  email: string
  phone: string
  totalAmount: number
  industry?: string
  businessDescription?: string
  businessAddress?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    zipCode?: string
    county?: string
  }
  personalAddress?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    zipCode?: string
    county?: string
  }
  data?: Record<string, any>
  additionalServices: string[]
  documents: any[]
  timeline: { status: string; message: string; timestamp: string; updatedBy?: string }[]
  adminNotes: { id?: string; note: string; adminName?: string; createdBy: string; createdAt: string; isPublic?: boolean }[]
  transactions: { id: string; amount: number; status: string; createdAt: string }[]
  createdAt: string
  lastUpdated: string
  notes?: string
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

export default function AdminSubmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")
  const [newNote, setNewNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)

  useEffect(() => {
    fetchSubmission()
  }, [params.id])

  const fetchSubmission = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        router.push("/admin/login")
        return
      }
      
      const response = await fetch(`${API_BASE_URL}/api/admin/submissions/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setSubmission(data.data)
        setNewStatus(data.data.status)
      } else if (data.error === "Invalid token" || response.status === 401) {
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminData")
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Failed to fetch submission:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async () => {
    if (!newStatus) return
    setIsUpdating(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`${API_BASE_URL}/api/admin/submissions/${params.id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, note: statusNote }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Status updated successfully" })
        fetchSubmission()
        setShowStatusDialog(false)
        setStatusNote("")
      } else {
        toast({ title: "Failed to update status", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error updating status", variant: "destructive" })
    } finally {
      setIsUpdating(false)
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return
    setIsAddingNote(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`${API_BASE_URL}/api/admin/submissions/${params.id}/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: newNote }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Note added successfully" })
        fetchSubmission()
        setShowNoteDialog(false)
        setNewNote("")
      } else {
        toast({ title: "Failed to add note", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error adding note", variant: "destructive" })
    } finally {
      setIsAddingNote(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <FileText className="h-12 w-12 mb-4 opacity-50" />
        <p>Submission not found</p>
        <Link href="/admin/submissions">
          <Button variant="link" className="text-blue-600 mt-2">
            Back to submissions
          </Button>
        </Link>
      </div>
    )
  }

  const status = statusColors[submission.status] || statusColors.pending
  const StatusIcon = status.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/admin/submissions">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Submission #{submission.submissionId?.slice(-8) || submission.id.slice(-8)}
            </h1>
            <p className="text-gray-500">{submission.type} Registration</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${status.bg} ${status.text} border-0 px-3 py-1`}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {submission.status}
          </Badge>
          <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Update Status
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Update Status</DialogTitle>
                <DialogDescription className="text-gray-500">
                  Change the status of this submission
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="bg-white border-gray-200 text-gray-700">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Add a note about this status change..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowStatusDialog(false)} className="border-gray-200">
                  Cancel
                </Button>
                <Button 
                  onClick={updateStatus} 
                  disabled={isUpdating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUpdating ? "Updating..." : "Update Status"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Info */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Business Name</p>
                  <p className="text-gray-900 mt-1">{submission.businessName || "—"}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Business Type</p>
                  <p className="text-gray-900 mt-1">{submission.businessType || "—"}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="text-gray-900 mt-1">{submission.email || "—"}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Phone</p>
                  <p className="text-gray-900 mt-1">{submission.phone || "—"}</p>
                </div>
                {submission.industry && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Industry</p>
                    <p className="text-gray-900 mt-1">{submission.industry}</p>
                  </div>
                )}
                {submission.totalAmount > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Total Amount</p>
                    <p className="text-gray-900 mt-1 font-semibold">${submission.totalAmount}</p>
                  </div>
                )}
                {submission.businessDescription && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 md:col-span-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Business Description</p>
                    <p className="text-gray-900 mt-1">{submission.businessDescription}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Addresses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Business Address</p>
                  <p className="text-gray-900 mt-1">
                    {submission.businessAddress ? 
                      [
                        submission.businessAddress.line1,
                        submission.businessAddress.line2,
                        submission.businessAddress.city,
                        submission.businessAddress.state,
                        submission.businessAddress.zipCode,
                        submission.businessAddress.county ? `${submission.businessAddress.county} County` : null
                      ].filter(Boolean).join(", ") || "—"
                      : "—"
                    }
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Personal Address</p>
                  <p className="text-gray-900 mt-1">
                    {submission.personalAddress ? 
                      [
                        submission.personalAddress.line1,
                        submission.personalAddress.line2,
                        submission.personalAddress.city,
                        submission.personalAddress.state,
                        submission.personalAddress.zipCode,
                        submission.personalAddress.county ? `${submission.personalAddress.county} County` : null
                      ].filter(Boolean).join(", ") || "—"
                      : "—"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Form Data (for reference) */}
          {submission.data && Object.keys(submission.data).length > 0 && (
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  All Form Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(submission.data).filter(([key]) => 
                    !['additionalServices', 'agreeToTerms', 'agreeToPayment'].includes(key)
                  ).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                      </p>
                      <p className="text-gray-900 mt-1">{String(value) || "—"}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Services */}
          {submission.additionalServices && submission.additionalServices.length > 0 && (
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Additional Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {submission.additionalServices.map((service) => (
                    <Badge key={service} className="bg-blue-100 text-blue-700 border-0">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submission.timeline && submission.timeline.length > 0 ? (
                <div className="space-y-4">
                  {submission.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-600" />
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{event.status}</p>
                        <p className="text-sm text-gray-500">{event.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(event.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No timeline events yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          {submission.user && (
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 text-sm">Submitted By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{submission.user.name || "User"}</p>
                    <p className="text-sm text-gray-500">{submission.user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dates */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 text-sm">Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Created</span>
                <span className="text-gray-900 text-sm">{formatDate(submission.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Last Updated</span>
                <span className="text-gray-900 text-sm">{formatDate(submission.lastUpdated)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 text-sm flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submission.transactions && submission.transactions.length > 0 ? (
                <div className="space-y-3">
                  {submission.transactions.map((tx) => (
                    <div key={tx.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-medium">${tx.amount}</span>
                        <Badge className={tx.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                          {tx.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(tx.createdAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No transactions yet</p>
              )}
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-900 text-sm flex items-center">
                <MessageSquare className="h-4 w-4 mr-1 text-orange-600" />
                Admin Notes
              </CardTitle>
              <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-gray-200">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900">Add Note</DialogTitle>
                    <DialogDescription className="text-gray-500">
                      Add an internal note to this submission
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Enter your note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 min-h-32"
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNoteDialog(false)} className="border-gray-200">
                      Cancel
                    </Button>
                    <Button 
                      onClick={addNote} 
                      disabled={isAddingNote}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isAddingNote ? "Adding..." : "Add Note"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {submission.adminNotes && submission.adminNotes.length > 0 ? (
                <div className="space-y-3">
                  {submission.adminNotes.map((note, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-gray-900 text-sm">{note.note}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatDate(note.createdAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No notes yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
