"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Eye, MoreHorizontal, Search, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { jobService } from "@/frontend/services/api.service"
import type { Job } from "@/types"

export default function ManageJobs() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<Job>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize data on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await jobService.getAllJobs()
        setJobs(jobsData)
      } catch (error) {
        console.error("Error fetching jobs:", error)
        toast({
          title: "Error",
          description: "Failed to load jobs. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || job.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (jobId: number, newStatus: "active" | "inactive") => {
    try {
      await jobService.updateJob(jobId, { status: newStatus })

      // Update local state
      setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)))

      toast({
        title: "Status Updated",
        description: `Job status has been updated to ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating job status:", error)
      toast({
        title: "Error",
        description: "Failed to update job status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteJob = async () => {
    if (!selectedJob) return

    setIsSubmitting(true)

    try {
      await jobService.deleteJob(selectedJob.id)

      // Update local state
      setJobs(jobs.filter((job) => job.id !== selectedJob.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Job Deleted",
        description: "The job posting has been permanently deleted.",
      })
    } catch (error) {
      console.error("Error deleting job:", error)
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return

    setIsSubmitting(true)

    try {
      await jobService.updateJob(selectedJob.id, editFormData)

      // Update local state
      setJobs(jobs.map((job) => (job.id === selectedJob.id ? { ...job, ...editFormData } : job)))
      setIsEditDialogOpen(false)

      toast({
        title: "Job Updated",
        description: "The job posting has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating job:", error)
      toast({
        title: "Error",
        description: "Failed to update job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSelectChange = (name: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const openEditDialog = (job: Job) => {
    setSelectedJob(job)
    setEditFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      openings: job.openings,
      description: job.description || "",
      requirements: job.requirements || "",
      responsibilities: job.responsibilities || "",
    })
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[#FF0084] border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Toaster />
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight mb-1">Manage Jobs</h1>
        <p className="text-sm md:text-base text-gray-500">View, edit, and manage all job postings</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg md:text-xl font-semibold">Job Listings</CardTitle>
          <Tabs defaultValue="all" onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all" className="text-xs md:text-sm">
                All Jobs
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs md:text-sm">
                Active
              </TabsTrigger>
              <TabsTrigger value="inactive" className="text-xs md:text-sm">
                Inactive
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search jobs..."
                className="pl-10 font-poppins"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="w-full sm:w-auto bg-[#FF0084] hover:bg-[#d60070] font-medium"
              onClick={() => router.push("/post-jobs")}
            >
              Add New Job
            </Button>
          </div>

          {/* Desktop table - hidden on mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-medium text-gray-500">Job Title</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-medium text-gray-500">Department</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-medium text-gray-500">Location</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-medium text-gray-500">Openings</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-medium text-gray-500">Applications</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-medium text-gray-500">Posted Date</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="border-b">
                    <td className="py-4 px-4 text-sm md:text-base font-medium">{job.title}</td>
                    <td className="py-4 px-4 text-sm">{job.department}</td>
                    <td className="py-4 px-4 text-sm">{job.location}</td>
                    <td className="py-4 px-4 text-sm">{job.type}</td>
                    <td className="py-4 px-4 text-sm">{job.openings}</td>
                    <td className="py-4 px-4 text-sm">{job.applications}</td>
                    <td className="py-4 px-4 text-sm">{new Date(job.posted).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 text-white text-xs rounded-md font-medium ${
                          job.status === "active" ? "bg-green-500" : "bg-orange-500"
                        }`}
                      >
                        {job.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedJob(job)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(job)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Job
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              handleStatusChange(job.id, job.status === "active" ? "inactive" : "active")
                            }}
                          >
                            {job.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedJob(job)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view - visible only on mobile */}
          <div className="md:hidden space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm md:text-base">{job.title}</h3>
                        <p className="text-xs md:text-sm text-gray-500">
                          {job.department} • {job.location}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-white text-xs rounded-md font-medium ${
                          job.status === "active" ? "bg-green-500" : "bg-orange-500"
                        }`}
                      >
                        {job.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Type</p>
                      <p className="font-medium">{job.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Openings</p>
                      <p className="font-medium">{job.openings}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Applications</p>
                      <p className="font-medium">{job.applications}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Posted</p>
                      <p className="font-medium">{new Date(job.posted).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 p-4 pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-medium"
                      onClick={() => {
                        setSelectedJob(job)
                        setIsViewDialogOpen(true)
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-medium"
                      onClick={() => openEditDialog(job)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-medium text-red-600"
                      onClick={() => {
                        setSelectedJob(job)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Job Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl font-semibold">{selectedJob?.title}</DialogTitle>
            <DialogDescription className="text-sm">
              Posted on {selectedJob && new Date(selectedJob.posted).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div>
              <h4 className="font-medium text-xs md:text-sm text-gray-500">Department</h4>
              <p className="text-sm md:text-base">{selectedJob?.department}</p>
            </div>
            <div>
              <h4 className="font-medium text-xs md:text-sm text-gray-500">Location</h4>
              <p className="text-sm md:text-base">{selectedJob?.location}</p>
            </div>
            <div>
              <h4 className="font-medium text-xs md:text-sm text-gray-500">Job Type</h4>
              <p className="text-sm md:text-base">{selectedJob?.type}</p>
            </div>
            <div>
              <h4 className="font-medium text-xs md:text-sm text-gray-500">Experience Level</h4>
              <p className="text-sm md:text-base">{selectedJob?.experience}</p>
            </div>
            <div>
              <h4 className="font-medium text-xs md:text-sm text-gray-500">Openings</h4>
              <p className="text-sm md:text-base">{selectedJob?.openings}</p>
            </div>
            <div>
              <h4 className="font-medium text-xs md:text-sm text-gray-500">Applications</h4>
              <p className="text-sm md:text-base">{selectedJob?.applications}</p>
            </div>
            <div>
              <h4 className="font-medium text-xs md:text-sm text-gray-500">Status</h4>
              <p className="capitalize text-sm md:text-base">{selectedJob?.status}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm md:text-base">Job Description</h4>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                {selectedJob?.description || "No description provided."}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm md:text-base">Requirements</h4>
              <div className="text-xs md:text-sm text-gray-600 mt-1 whitespace-pre-line">
                {selectedJob?.requirements || "No requirements specified."}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm md:text-base">Responsibilities</h4>
              <div className="text-xs md:text-sm text-gray-600 mt-1 whitespace-pre-line">
                {selectedJob?.responsibilities || "No responsibilities specified."}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl font-semibold">Edit Job</DialogTitle>
            <DialogDescription className="text-sm">
              Make changes to the job posting. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditJob}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Job Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={editFormData.title || ""}
                  onChange={handleEditInputChange}
                  required
                  className="font-poppins"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">
                  Department
                </Label>
                <Select
                  value={editFormData.department}
                  onValueChange={(value) => handleEditSelectChange("department", value)}
                >
                  <SelectTrigger className="font-poppins">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
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
                  value={editFormData.location || ""}
                  onChange={handleEditInputChange}
                  required
                  className="font-poppins"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Job Type
                </Label>
                <Select value={editFormData.type} onValueChange={(value) => handleEditSelectChange("type", value)}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Part Time">Part Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium">
                  Experience Level
                </Label>
                <Select
                  value={editFormData.experience}
                  onValueChange={(value) => handleEditSelectChange("experience", value)}
                >
                  <SelectTrigger className="font-poppins">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry Level">Entry Level</SelectItem>
                    <SelectItem value="Mid Level">Mid Level</SelectItem>
                    <SelectItem value="Senior Level">Senior Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openings" className="text-sm font-medium">
                  Number of Openings
                </Label>
                <Input
                  id="openings"
                  name="openings"
                  type="number"
                  value={editFormData.openings || ""}
                  onChange={handleEditInputChange}
                  required
                  className="font-poppins"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Job Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={editFormData.description || ""}
                  onChange={handleEditInputChange}
                  required
                  className="font-poppins text-sm"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="requirements" className="text-sm font-medium">
                  Requirements
                </Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  rows={5}
                  value={editFormData.requirements || ""}
                  onChange={handleEditInputChange}
                  required
                  className="font-poppins text-sm"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="responsibilities" className="text-sm font-medium">
                  Responsibilities
                </Label>
                <Textarea
                  id="responsibilities"
                  name="responsibilities"
                  rows={5}
                  value={editFormData.responsibilities || ""}
                  onChange={handleEditInputChange}
                  required
                  className="font-poppins text-sm"
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="w-full sm:w-auto font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-[#FF0084] hover:bg-[#d60070] font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteJob} className="font-medium" disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
