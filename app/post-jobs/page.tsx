"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { jobService } from "@/frontend/services/api.service"

export default function PostJobs() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    experience: "",
    salary: "",
    openings: "",
    description: "",
    requirements: "",
    responsibilities: "",
  })

  // Initialize data on component mount
  useEffect(() => {
    // Initialize dummy data in localStorage
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Format the data for the API
      const jobData = {
        ...formData,
        openings: Number.parseInt(formData.openings) || 1,
        status: "active",
      }

      // Send the data to our API
      await jobService.createJob(jobData)

      toast({
        title: "Job Posted Successfully",
        description: "Your job has been posted and is now live on the website.",
      })

      // Reset form
      setFormData({
        title: "",
        department: "",
        location: "",
        type: "",
        experience: "",
        salary: "",
        openings: "",
        description: "",
        requirements: "",
        responsibilities: "",
      })

      // Redirect to manage jobs page after a short delay
      setTimeout(() => {
        router.push("/manage-jobs")
      }, 2000)
    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Toaster />
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight mb-1">Post a New Job</h1>
        <p className="text-sm md:text-base text-gray-500">
          Create a new job posting to be published on the company website
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-semibold">Job Details</CardTitle>
            <CardDescription className="text-sm">Enter the basic information about the job position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Job Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="font-poppins"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">
                  Department
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                  required
                >
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Lagos, Nigeria"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="font-poppins"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Job Type
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)} required>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Part Time">Part Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium">
                  Experience Level
                </Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => handleSelectChange("experience", value)}
                  required
                >
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry Level">Entry Level</SelectItem>
                    <SelectItem value="Mid Level">Mid Level</SelectItem>
                    <SelectItem value="Senior Level">Senior Level</SelectItem>
                    <SelectItem value="Lead / Manager">Lead / Manager</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium">
                  Salary Range
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  placeholder="e.g. ₦500,000 - ₦800,000"
                  value={formData.salary}
                  onChange={handleChange}
                  className="font-poppins"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openings" className="text-sm font-medium">
                  Number of Openings
                </Label>
                <Input
                  id="openings"
                  name="openings"
                  type="number"
                  placeholder="e.g. 5"
                  value={formData.openings}
                  onChange={handleChange}
                  required
                  className="font-poppins"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Job Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a detailed description of the job..."
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
                className="font-poppins text-sm md:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-sm font-medium">
                Requirements
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="List the requirements for this position..."
                rows={5}
                value={formData.requirements}
                onChange={handleChange}
                required
                className="font-poppins text-sm md:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities" className="text-sm font-medium">
                Responsibilities
              </Label>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                placeholder="List the key responsibilities for this position..."
                rows={5}
                value={formData.responsibilities}
                onChange={handleChange}
                required
                className="font-poppins text-sm md:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <Button
                variant="outline"
                type="button"
                className="w-full sm:w-auto font-medium"
                onClick={() => router.push("/manage-jobs")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-[#FF0084] hover:bg-[#d60070] font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publishing..." : "Publish Job"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
