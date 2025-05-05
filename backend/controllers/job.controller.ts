import { type NextRequest, NextResponse } from "next/server"
import { getAllJobs, getJobById, createJob, updateJob, deleteJob } from "../models/job.model"
import type { ApiResponse, Job } from "@/types"

// Get all jobs
export const getJobs = async (): Promise<NextResponse<ApiResponse<Job[]>>> => {
  try {
    const jobs = getAllJobs()
    return NextResponse.json({
      data: jobs,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs", success: false }, { status: 500 })
  }
}

// Get a job by ID
export const getJob = async (id: number): Promise<NextResponse<ApiResponse<Job>>> => {
  try {
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid job ID", success: false }, { status: 400 })
    }

    const job = getJobById(id)
    if (!job) {
      return NextResponse.json({ error: "Job not found", success: false }, { status: 404 })
    }

    return NextResponse.json({
      data: job,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job", success: false }, { status: 500 })
  }
}

// Create a new job
export const createNewJob = async (request: NextRequest): Promise<NextResponse<ApiResponse<Job>>> => {
  try {
    const jobData = await request.json()

    // Validate required fields
    const requiredFields = ["title", "department", "location", "type", "experience", "openings"]
    for (const field of requiredFields) {
      if (!jobData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}`, success: false }, { status: 400 })
      }
    }

    const newJob = createJob(jobData)
    return NextResponse.json(
      {
        data: newJob,
        success: true,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job", success: false }, { status: 500 })
  }
}

// Update a job
export const updateExistingJob = async (request: NextRequest, id: number): Promise<NextResponse<ApiResponse<Job>>> => {
  try {
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid job ID", success: false }, { status: 400 })
    }

    const updates = await request.json()
    const updatedJob = updateJob(id, updates)

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found", success: false }, { status: 404 })
    }

    return NextResponse.json({
      data: updatedJob,
      success: true,
    })
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job", success: false }, { status: 500 })
  }
}

// Delete a job
export const deleteExistingJob = async (id: number): Promise<NextResponse<ApiResponse<null>>> => {
  try {
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid job ID", success: false }, { status: 400 })
    }

    const success = deleteJob(id)
    if (!success) {
      return NextResponse.json({ error: "Job not found", success: false }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Failed to delete job", success: false }, { status: 500 })
  }
}

// Add client-side data fetching fallback for the dashboard stats

// Update the getDashboardStats function to include client-side fallback
export const getDashboardStats = async (): Promise<NextResponse<ApiResponse<any>>> => {
  try {
    const jobs = getAllJobs()

    // Calculate stats
    const activeJobs = jobs.filter((job) => job.status === "active").length
    const inactiveJobs = jobs.filter((job) => job.status === "inactive").length
    const totalApplications = jobs.reduce((sum, job) => sum + job.applications, 0)

    // Get recent jobs (sorted by posted date)
    const sortedJobs = [...jobs].sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime())
    const recentJobs = sortedJobs.slice(0, 4).map((job) => ({
      id: job.id,
      title: job.title,
      department: job.department,
      type: job.type,
      openings: job.openings,
      applications: job.applications,
      status: job.status,
    }))

    return NextResponse.json({
      data: {
        totalApplications,
        totalJobs: jobs.length,
        activeJobs,
        inactiveJobs,
        recentJobs,
      },
      success: true,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics", success: false }, { status: 500 })
  }
}
