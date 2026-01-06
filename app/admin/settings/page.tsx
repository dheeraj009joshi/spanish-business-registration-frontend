"use client"

import { useState } from "react"
import { 
  Settings,
  Key,
  Globe,
  Shield,
  UserPlus
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    name: "",
    role: "admin",
  })

  const createAdmin = async () => {
    if (!newAdmin.email || !newAdmin.password) {
      toast({ title: "Email and password are required", variant: "destructive" })
      return
    }
    
    setIsCreating(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`${API_BASE_URL}/api/admin/create-admin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      })
      const data = await response.json()
      
      if (data.success) {
        toast({ title: "Admin created successfully" })
        setShowCreateAdmin(false)
        setNewAdmin({ email: "", password: "", name: "", role: "admin" })
      } else {
        toast({ title: data.error || "Failed to create admin", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error creating admin", variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage admin settings and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Management */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Admin Management
            </CardTitle>
            <CardDescription className="text-gray-500">
              Create and manage admin accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog open={showCreateAdmin} onOpenChange={setShowCreateAdmin}>
              <DialogTrigger asChild>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create New Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Create Admin Account</DialogTitle>
                  <DialogDescription className="text-gray-500">
                    Add a new administrator to the system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Name</Label>
                    <Input
                      placeholder="Admin Name"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      className="bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Email</Label>
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      className="bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      className="bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Role</Label>
                    <Select 
                      value={newAdmin.role} 
                      onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value })}
                    >
                      <SelectTrigger className="bg-white border-gray-200 text-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateAdmin(false)} className="border-gray-200">
                    Cancel
                  </Button>
                  <Button 
                    onClick={createAdmin}
                    disabled={isCreating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isCreating ? "Creating..." : "Create Admin"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <p className="text-sm text-gray-400">
              Only super admins can create new admin accounts.
            </p>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <Key className="h-5 w-5 mr-2 text-purple-600" />
              API Configuration
            </CardTitle>
            <CardDescription className="text-gray-500">
              View API configuration details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-400 uppercase mb-1">API Base URL</p>
              <p className="text-gray-900 font-mono text-sm">{API_BASE_URL}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-400 uppercase mb-1">Stripe Mode</p>
              <p className="text-gray-900">
                {API_BASE_URL.includes("localhost") ? "Test Mode" : "Live Mode"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-green-600" />
              System Information
            </CardTitle>
            <CardDescription className="text-gray-500">
              Current system configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-gray-500">Environment</span>
              <span className="text-gray-900 font-medium">
                {API_BASE_URL.includes("localhost") ? "Development" : "Production"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-gray-500">Version</span>
              <span className="text-gray-900 font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-gray-500">Database</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-orange-600" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-gray-500">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-200 text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
              onClick={() => window.open("https://dashboard.stripe.com", "_blank")}
            >
              <Key className="h-4 w-4 mr-2 text-purple-500" />
              Open Stripe Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-200 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
              onClick={() => window.open("https://cloud.mongodb.com", "_blank")}
            >
              <Globe className="h-4 w-4 mr-2 text-green-500" />
              Open MongoDB Atlas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
