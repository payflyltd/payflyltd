"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function Settings() {
  const [seoDescription, setSeoDescription] = useState(
    "Join our team at Konga and be part of a dynamic and innovative company. Explore our current job openings and career opportunities.",
  )
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the SEO description to your backend here
    // For now, we're just updating the state
    const formData = new FormData(e.target as HTMLFormElement)
    const newSeoDescription = formData.get("seo-description") as string
    setSeoDescription(newSeoDescription)

    toast({
      title: "Settings Saved",
      description: "Your general settings have been updated successfully.",
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validatePasswordForm = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
    let isValid = true

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required"
      isValid = false
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required"
      isValid = false
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters"
      isValid = false
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setPasswordErrors(errors)
    return isValid
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    setIsChangingPassword(true)

    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      })
    }, 1000)
  }

  const handleResetPassword = () => {
    setIsResettingPassword(true)

    // Simulate API call
    setTimeout(() => {
      setIsResettingPassword(false)
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for instructions to reset your password.",
      })
    }, 1000)
  }

  // Update the document's meta description when seoDescription changes
  useEffect(() => {
    // This would typically be handled server-side in a real Next.js app
    // For client-side demonstration purposes only
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute("content", seoDescription)
    }
  }, [seoDescription])

  return (
    <div>
      <Toaster />
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500">Manage your HR dashboard and job posting preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <div className="overflow-x-auto -mx-3 px-3">
          <TabsList className="inline-flex w-auto min-w-full md:w-auto mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your HR dashboard general settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveGeneral} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" defaultValue="Konga" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">HR Contact Email</Label>
                      <Input id="contact-email" type="email" defaultValue="helpdesk@konga.com" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-address">Company Address</Label>
                    <Textarea id="company-address" defaultValue="5B Redemption Crescent, Gbagada, Lagos, Nigeria" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-job-expiry">Default Job Posting Expiry</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="45">45 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="90">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobs-per-page">Jobs Per Page</Label>
                    <Select defaultValue="10">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 jobs</SelectItem>
                        <SelectItem value="10">10 jobs</SelectItem>
                        <SelectItem value="15">15 jobs</SelectItem>
                        <SelectItem value="20">20 jobs</SelectItem>
                        <SelectItem value="25">25 jobs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo-description">Default SEO Description</Label>
                    <Textarea id="seo-description" name="seo-description" rows={3} defaultValue={seoDescription} />
                    <p className="text-xs text-gray-500">
                      This description will be used for SEO meta tags on job listing pages.
                    </p>
                  </div>
                </div>

                <Button type="submit" className="bg-[#FF0084] hover:bg-[#d60070]">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password Settings</CardTitle>
              <CardDescription>Change or reset your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  For security reasons, you'll need to enter your current password to make changes.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                    />
                    {passwordErrors.newPassword && <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="bg-[#FF0084] hover:bg-[#d60070]" disabled={isChangingPassword}>
                    {isChangingPassword ? "Changing Password..." : "Change Password"}
                  </Button>

                  <Button type="button" variant="outline" onClick={handleResetPassword} disabled={isResettingPassword}>
                    {isResettingPassword ? "Sending Reset Link..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
